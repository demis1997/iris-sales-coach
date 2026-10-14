begin;
-- Additive hardening; apply to a disposable Supabase project first. No remote apply is automatic.
create unique index if not exists calls_company_identity on public.calls(company_id,id);
do $$ declare child text; begin
  foreach child in array array['call_recordings','call_processing_jobs','call_transcripts','transcript_segments','call_ai_analyses'] loop
    execute format('alter table public.%I add constraint %I foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade',child,child||'_tenant_call_fk');
  end loop;
end $$;

create or replace function public.guard_profile_security() returns trigger
language plpgsql set search_path=public as $$
begin
  if current_user in ('authenticated','anon') then
    if TG_OP='INSERT' then
      if new.company_id is not null or new.phone_verified_at is not null then raise exception 'Profile ownership and verification are server-managed'; end if;
    else
      if new.company_id is distinct from old.company_id or new.phone_verified_at is distinct from old.phone_verified_at then raise exception 'Profile ownership and verification are server-managed'; end if;
      if new.phone_e164 is distinct from old.phone_e164 or new.phone is distinct from old.phone then new.phone_verified_at=null; end if;
    end if;
    if new.active_company_id is not null and not public.is_member_of(new.active_company_id) then raise exception 'Not a company member'; end if;
  end if;
  return new;
end $$;
create trigger protect_profile_security before insert or update on public.profiles for each row execute function public.guard_profile_security();
revoke all on public.phone_verification_challenges from authenticated,anon;
drop policy if exists "admins manage roles" on public.user_roles;
create policy "tenant_admin_role_management" on public.user_roles for all to authenticated
  using(public.has_company_role(company_id,array['owner','admin']::public.app_role[]))
  with check(public.has_company_role(company_id,array['owner','admin']::public.app_role[]));
drop policy if exists "admins update own company" on public.companies;
create policy "tenant_admin_company_update" on public.companies for update to authenticated
  using(public.has_company_role(id,array['owner','admin']::public.app_role[]))
  with check(public.has_company_role(id,array['owner','admin']::public.app_role[]));

create or replace function public.can_read_call(_company uuid,_call uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_member_of(_company) and exists(select 1 from public.calls c where c.id=_call and c.company_id=_company and c.deleted_at is null and
 (c.agent_user_id=auth.uid() or public.has_company_role(_company,array['owner','admin','ceo','viewer','platform_admin']::public.app_role[]) or
 (public.has_company_role(_company,array['manager','qa','team_leader','trainer']::public.app_role[]) and exists(select 1 from public.teams t where t.id=c.team_id and t.company_id=_company and t.manager_user_id=auth.uid()))));
$$;
-- Replace broad child access. Clients cannot fabricate analyses/transcripts or processing jobs.
do $$ declare tab text; pol record; begin
 foreach tab in array array['call_recordings','call_processing_jobs','call_transcripts','transcript_segments','call_ai_analyses'] loop
  for pol in select policyname from pg_policies where schemaname='public' and tablename=tab loop execute format('drop policy %I on public.%I',pol.policyname,tab); end loop;
  execute format('revoke insert,update,delete on public.%I from authenticated',tab);
  execute format('create policy secure_call_read on public.%I for select to authenticated using(public.can_read_call(company_id,call_id))',tab);
 end loop;
end $$;
grant insert on public.call_recordings to authenticated;
create policy owned_recording_insert on public.call_recordings for insert to authenticated with check(
  exists(select 1 from public.calls c where c.id=call_id and c.company_id=call_recordings.company_id and c.agent_user_id=auth.uid())
  and storage_path like company_id::text||'/'||call_id::text||'/%');
drop policy if exists "call_recordings_select" on storage.objects;
create policy "call_recordings_select" on storage.objects for select to authenticated using(
 bucket_id='call-recordings' and public.can_read_call((storage.foldername(name))[1]::uuid,(storage.foldername(name))[2]::uuid));
drop policy if exists "call_recordings_insert" on storage.objects;
create policy "call_recordings_insert" on storage.objects for insert to authenticated with check(
 bucket_id='call-recordings' and exists(select 1 from public.calls c where c.id=(storage.foldername(name))[2]::uuid and c.company_id=(storage.foldername(name))[1]::uuid and c.agent_user_id=auth.uid()));
drop policy if exists "call_recordings_update" on storage.objects;

alter table public.company_telephony_settings alter column record_calls set default false;
-- Existing consent policies must be reviewed before re-enabling recording.
update public.company_telephony_settings set record_calls=false;
alter table public.calls add column idempotency_key uuid, add column request_fingerprint text,
 add column provider_sequence bigint not null default -1, add column consent_reference text;
create unique index calls_idempotency on public.calls(company_id,agent_user_id,idempotency_key) where idempotency_key is not null;
create table public.contact_suppressions(company_id uuid not null references public.companies(id),phone_e164 text not null,reason text not null,created_at timestamptz not null default now(),primary key(company_id,phone_e164));
alter table public.contact_suppressions enable row level security;
grant all on public.contact_suppressions to service_role;
grant select,insert on public.contact_suppressions to authenticated;
create policy suppression_read on public.contact_suppressions for select to authenticated using(public.is_member_of(company_id));
create policy suppression_insert on public.contact_suppressions for insert to authenticated with check(public.is_member_of(company_id));

create table public.provider_rate_limits(company_id uuid not null, user_id uuid not null, action text not null, window_start timestamptz not null,hits integer not null,primary key(company_id,user_id,action,window_start));
revoke all on public.provider_rate_limits from anon,authenticated;
grant all on public.provider_rate_limits to service_role;
create function public.consume_provider_limit(_company uuid,_user uuid,_action text,_limit int,_seconds int) returns boolean language plpgsql security invoker set search_path=public as $$
declare bucket timestamptz; count int;
begin
 if _limit<1 or _seconds<1 then raise exception 'Invalid rate policy'; end if;
 bucket=to_timestamp(floor(extract(epoch from now())/_seconds)*_seconds);
 insert into provider_rate_limits values(_company,_user,_action,bucket,1) on conflict(company_id,user_id,action,window_start) do update set hits=provider_rate_limits.hits+1 returning hits into count;
 return count<=_limit;
end $$;
revoke all on function public.consume_provider_limit(uuid,uuid,text,int,int) from public,anon,authenticated;
grant execute on function public.consume_provider_limit(uuid,uuid,text,int,int) to service_role;

create table public.call_events(id bigint generated always as identity primary key,company_id uuid not null,call_id uuid not null,kind text not null,provider_sequence bigint,details jsonb not null default '{}',created_at timestamptz not null default now(),foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
alter table public.call_events enable row level security;
grant select on public.call_events to authenticated;
grant all on public.call_events to service_role;
grant usage,select on sequence public.call_events_id_seq to service_role;
create policy call_event_read on public.call_events for select to authenticated using(public.can_read_call(company_id,call_id));

create function public.apply_call_status(_company uuid,_call uuid,_sid text,_sequence bigint,_state text,_duration int) returns boolean language plpgsql security invoker set search_path=public as $$
declare c public.calls;
begin
 if _state not in ('created','ringing','in_progress','completed','failed','cancelled','missed') or _sequence<0 or _duration<0 or _duration>86400 then raise exception 'Invalid callback'; end if;
 select * into c from calls where id=_call and company_id=_company for update;
 if not found then raise exception 'Call not found'; end if;
 if c.external_call_id is not null and c.external_call_id<>_sid then raise exception 'Provider call mismatch'; end if;
 if c.provider<>'twilio' then raise exception 'Provider mismatch'; end if;
 if c.status in ('completed','failed','cancelled','missed') then
   if c.status=_state and _duration>coalesce(c.duration_seconds,0) then
     update calls set duration_seconds=_duration,provider_sequence=greatest(provider_sequence,coalesce(_sequence,provider_sequence)),updated_at=now() where id=_call and company_id=_company;
     insert into call_events(company_id,call_id,kind,provider_sequence,details) values(_company,_call,'provider_final_duration',_sequence,jsonb_build_object('durationSeconds',_duration));
     return true;
   end if;
   return false;
 end if;
 if _sequence<=c.provider_sequence then return false; end if;
 if c.status='in_progress' and _state in ('created','ringing') or c.status='ringing' and _state='created' then return false; end if;
 update calls set external_call_id=_sid,provider_sequence=coalesce(_sequence,provider_sequence),status=_state,duration_seconds=greatest(coalesce(duration_seconds,0),_duration),ended_at=case when _state in ('completed','failed','cancelled','missed') then coalesce(ended_at,now()) else ended_at end,updated_at=now() where id=_call and company_id=_company;
 insert into call_events(company_id,call_id,kind,provider_sequence,details) values(_company,_call,case when _sequence is null then 'provider_reconciled' else 'provider_status' end,_sequence,jsonb_build_object('state',_state,'sid',_sid));
 return true;
end $$;
revoke all on function public.apply_call_status(uuid,uuid,text,bigint,text,int) from public,anon,authenticated;
grant execute on function public.apply_call_status(uuid,uuid,text,bigint,text,int) to service_role;
drop policy if exists calls_select on public.calls;
create policy calls_select on public.calls for select to authenticated using(public.can_read_call(company_id,id));

-- Browser clients may upload their own recordings; provider identifiers and lifecycle are server-owned.
revoke update on public.calls from authenticated;
grant update(contact_name,contact_company,disposition,deleted_at) on public.calls to authenticated;
drop policy if exists calls_insert on public.calls;
create policy calls_insert on public.calls for insert to authenticated with check(
 public.is_member_of(company_id) and agent_user_id=auth.uid() and provider='upload' and external_call_id is null
 and status='uploaded' and is_converted=false and overall_score is null and phone_number is null);
revoke delete on public.calls from authenticated;
create function public.guard_call_deletion() returns trigger language plpgsql set search_path=public as $$
begin
 if current_user='authenticated' and new.deleted_at is distinct from old.deleted_at then
   if not public.has_company_role(old.company_id,array['owner','admin']::public.app_role[]) or old.status not in('completed','failed','cancelled','missed','uploaded') then raise exception 'Only company administrators can delete inactive calls'; end if;
 end if;
 return new;
end $$;
create trigger guard_call_deletion before update on public.calls for each row execute function public.guard_call_deletion();
create function public.guard_platform_role() returns trigger language plpgsql set search_path=public as $$
begin
 if current_user='authenticated' and new.role='platform_admin' then raise exception 'Platform role is server-managed'; end if;
 return new;
end $$;
create trigger guard_membership_platform_role before insert or update on public.company_memberships for each row execute function public.guard_platform_role();
create trigger guard_user_platform_role before insert or update on public.user_roles for each row execute function public.guard_platform_role();
commit;
