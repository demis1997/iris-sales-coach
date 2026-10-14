begin;
grant select,delete on public.live_call_suggestions to service_role;
grant select,update on public.agent_skill_scores,public.audit_logs to service_role;
alter table public.calls add column legal_hold boolean not null default false;
create function public.protect_call_legal_hold() returns trigger language plpgsql set search_path=public as $$
begin
 if current_user='authenticated' and ((tg_op='INSERT' and new.legal_hold) or (tg_op='UPDATE' and new.legal_hold is distinct from old.legal_hold)) then raise exception 'Legal hold is server-managed'; end if;
 return new;
end $$;
create trigger protect_call_legal_hold before insert or update on public.calls for each row execute function public.protect_call_legal_hold();
create table public.call_erasure_tasks(
 id uuid primary key default gen_random_uuid(),company_id uuid not null,call_id uuid not null,
 requested_by uuid not null references auth.users(id),approval_reference text not null check(length(approval_reference) between 8 and 128),
 state text not null default 'queued' check(state in('queued','running','failed')),attempt int not null default 0,
 lease_token uuid,lease_until timestamptz,error_code text,created_at timestamptz not null default now(),
 unique(company_id,call_id),foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
create table public.call_erasure_receipts(
 id uuid primary key default gen_random_uuid(),company_id uuid not null references public.companies(id),call_id uuid not null,
 approval_reference text not null,object_count int not null,completed_at timestamptz not null default now(),unique(company_id,call_id));
alter table public.call_erasure_tasks enable row level security;
alter table public.call_erasure_receipts enable row level security;
grant all on public.call_erasure_tasks,public.call_erasure_receipts to service_role;
grant select on public.call_erasure_tasks,public.call_erasure_receipts to authenticated;
create policy erasure_tasks_admin_read on public.call_erasure_tasks for select to authenticated using(public.has_company_role(company_id,array['owner','admin']::public.app_role[]));
create policy erasure_receipts_admin_read on public.call_erasure_receipts for select to authenticated using(public.has_company_role(company_id,array['owner','admin']::public.app_role[]));

create function public.request_call_erasure(_company uuid,_call uuid,_actor uuid,_reference text) returns uuid language plpgsql security invoker set search_path=public as $$
declare c calls; task uuid;
begin
 if not exists(select 1 from company_memberships where company_id=_company and user_id=_actor and status='active' and role in('owner','admin')) then raise exception 'Administrator required'; end if;
 select * into c from calls where company_id=_company and id=_call for update;
 if not found or c.legal_hold then raise exception 'Call unavailable or held'; end if;
 if c.status not in('completed','failed','cancelled','missed','uploaded') or exists(select 1 from analysis_tasks where company_id=_company and call_id=_call and state='running') or exists(select 1 from voice_sessions where company_id=_company and call_id=_call and state='active') then raise exception 'Call processing is active'; end if;
 update calls set deleted_at=coalesce(deleted_at,now()),updated_at=now() where company_id=_company and id=_call;
 update analysis_tasks set state='failed',lease_token=null,lease_until=null,error_code='erasure_requested' where company_id=_company and call_id=_call and state='queued';
 insert into call_erasure_tasks(company_id,call_id,requested_by,approval_reference) values(_company,_call,_actor,_reference) on conflict(company_id,call_id) do nothing returning id into task;
 if task is null then select id into task from call_erasure_tasks where company_id=_company and call_id=_call; end if;
 insert into call_events(company_id,call_id,kind,details) values(_company,_call,'erasure_requested',jsonb_build_object('actor',_actor,'taskId',task));
 return task;
end $$;

create function public.set_call_legal_hold(_company uuid,_call uuid,_actor uuid,_held boolean) returns void language plpgsql security invoker set search_path=public as $$
begin
 if not exists(select 1 from company_memberships where company_id=_company and user_id=_actor and status='active' and role in('owner','admin')) then raise exception 'Administrator required'; end if;
 perform 1 from calls where company_id=_company and id=_call for update;
 if not found then raise exception 'Call not found'; end if;
 if exists(select 1 from call_erasure_tasks where company_id=_company and call_id=_call and state='running') then raise exception 'Erasure already in progress; cannot change hold'; end if;
 update calls set legal_hold=_held where company_id=_company and id=_call;
 insert into call_events(company_id,call_id,kind,details) values(_company,_call,'legal_hold_changed',jsonb_build_object('actor',_actor,'held',_held));
end $$;

create function public.plan_call_erasures(_company uuid) returns table(task_id uuid,call_id uuid,approval_reference text,objects jsonb) language sql security invoker set search_path=public as $$
 select t.id,t.call_id,t.approval_reference,
 coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'path',r.storage_path) order by r.storage_path,r.id) from call_recordings r where r.company_id=t.company_id and r.call_id=t.call_id),'[]'::jsonb)
 from call_erasure_tasks t join calls c on c.company_id=t.company_id and c.id=t.call_id
 left join company_retention_policies p on p.company_id=t.company_id
 where t.company_id=_company and (t.state='queued' or t.state='running' and t.lease_until<now()) and t.attempt<10
 and c.deleted_at<=now()-make_interval(days=>greatest(coalesce(p.soft_delete_grace_days,30),1)) and not c.legal_hold
 and c.status in('completed','failed','cancelled','missed','uploaded')
 and not exists(select 1 from analysis_tasks a where a.company_id=c.company_id and a.call_id=c.id and a.state in('queued','running'))
 and not exists(select 1 from voice_sessions v where v.company_id=c.company_id and v.call_id=c.id and v.state='active')
 order by t.created_at limit 50;
$$;

create function public.claim_call_erasure(_company uuid,_task uuid,_expected jsonb) returns uuid language plpgsql security invoker set search_path=public as $$
declare t call_erasure_tasks; c calls; planned jsonb; token uuid;
begin
 select * into t from call_erasure_tasks where id=_task and company_id=_company for update;
 if not found then return null; end if;
 select * into c from calls where id=t.call_id and company_id=_company for update;
 select p.objects into planned from plan_call_erasures(_company) p where p.task_id=_task;
 if planned is null or planned<>_expected or jsonb_array_length(planned)>500 then return null; end if;
 token=gen_random_uuid();
 update call_erasure_tasks set state='running',attempt=attempt+1,lease_token=token,lease_until=now()+interval '5 minutes',error_code=null where id=_task;
 return token;
end $$;

create function public.finish_call_erasure(_company uuid,_task uuid,_token uuid,_expected jsonb) returns boolean language plpgsql security invoker set search_path=public as $$
declare t call_erasure_tasks; c calls; actual jsonb;
begin
 select * into t from call_erasure_tasks where id=_task and company_id=_company and state='running' and lease_token=_token and lease_until>now() for update;
 if not found then return false; end if;
 select * into c from calls where id=t.call_id and company_id=_company for update;
 if not found or c.legal_hold then return false; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'path',storage_path) order by storage_path,id),'[]'::jsonb) into actual from call_recordings where company_id=_company and call_id=t.call_id;
 if actual<>_expected then return false; end if;
 insert into call_erasure_receipts(company_id,call_id,approval_reference,object_count) values(_company,t.call_id,t.approval_reference,jsonb_array_length(actual));
 delete from live_call_suggestions where company_id=_company and call_id=t.call_id::text;
 update agent_skill_scores set evidence_call_id=null,explanation=null,exercise=null where company_id=_company and evidence_call_id=t.call_id::text;
 update audit_logs set resource_id=null,metadata='{"redactedBy":"call_erasure"}'::jsonb where company_id=_company and resource_type='call' and resource_id=t.call_id::text;
 delete from calls where company_id=_company and id=t.call_id;
 return true;
end $$;

create function public.fail_call_erasure(_company uuid,_task uuid,_token uuid) returns boolean language sql security invoker set search_path=public as $$
 with changed as(update call_erasure_tasks set state=case when attempt>=10 then 'failed' else 'queued' end,lease_token=null,lease_until=null,error_code='storage_or_commit_failed' where company_id=_company and id=_task and state='running' and lease_token=_token returning id) select exists(select 1 from changed);
$$;
revoke all on function public.request_call_erasure(uuid,uuid,uuid,text),public.set_call_legal_hold(uuid,uuid,uuid,boolean),public.plan_call_erasures(uuid),public.claim_call_erasure(uuid,uuid,jsonb),public.finish_call_erasure(uuid,uuid,uuid,jsonb),public.fail_call_erasure(uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.request_call_erasure(uuid,uuid,uuid,text),public.set_call_legal_hold(uuid,uuid,uuid,boolean),public.plan_call_erasures(uuid),public.claim_call_erasure(uuid,uuid,jsonb),public.finish_call_erasure(uuid,uuid,uuid,jsonb),public.fail_call_erasure(uuid,uuid,uuid) to service_role;
commit;
