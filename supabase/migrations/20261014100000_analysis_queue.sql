begin;
create table public.analysis_tasks(id uuid primary key default gen_random_uuid(),company_id uuid not null,call_id uuid not null,transcript_text text check(length(transcript_text)<=120000),state text not null default 'queued' check(state in('queued','running','completed','failed')),attempt int not null default 0,available_at timestamptz not null default now(),lease_token uuid,lease_until timestamptz,error_code text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(company_id,call_id),foreign key(company_id,call_id) references public.calls(company_id,id) on delete cascade);
alter table public.analysis_tasks enable row level security;
grant all on public.analysis_tasks to service_role;
grant select on public.analysis_tasks to authenticated;
create policy analysis_task_read on public.analysis_tasks for select to authenticated using(public.can_read_call(company_id,call_id));
create function public.enqueue_analysis_task(_company uuid,_call uuid,_transcript text) returns uuid language plpgsql security invoker set search_path=public as $$
declare task uuid;
begin
 if not exists(select 1 from calls where company_id=_company and id=_call and deleted_at is null) then raise exception 'Call unavailable'; end if;
 insert into analysis_tasks(company_id,call_id,transcript_text) values(_company,_call,_transcript) on conflict(company_id,call_id) do nothing returning id into task;
 if task is null then select id into task from analysis_tasks where company_id=_company and call_id=_call; return task; end if;
 update calls set analysis_status='queued',recording_status=case when provider='upload' and exists(select 1 from call_recordings where company_id=_company and call_id=_call) then 'uploaded' else recording_status end,updated_at=now() where company_id=_company and id=_call;
 insert into call_events(company_id,call_id,kind,details) values(_company,_call,'analysis_queued',jsonb_build_object('taskId',task));
 return task;
end $$;
create function public.claim_analysis_task() returns setof public.analysis_tasks language plpgsql security invoker set search_path=public as $$
declare task uuid;
begin
 with exhausted as (update analysis_tasks set state='failed',error_code='retry_limit',lease_token=null,lease_until=null where attempt>=5 and (state='queued' or state='running' and lease_until<now()) returning company_id,call_id) update calls c set analysis_status='failed',updated_at=now() from exhausted e where c.company_id=e.company_id and c.id=e.call_id;
 select id into task from analysis_tasks where attempt<5 and (state='queued' and available_at<=now() or state='running' and lease_until<now()) order by created_at for update skip locked limit 1;
 if task is null then return; end if;
 return query update analysis_tasks set state='running',attempt=attempt+1,lease_token=gen_random_uuid(),lease_until=now()+interval '5 minutes',updated_at=now() where id=task returning *;
end $$;
create function public.fail_analysis_task(_task uuid,_token uuid) returns boolean language plpgsql security invoker set search_path=public as $$
declare t analysis_tasks;
begin
 select * into t from analysis_tasks where id=_task and state='running' and lease_token=_token and lease_until>now() for update;
 if not found then return false; end if;
 update analysis_tasks set state=case when attempt>=5 then 'failed' else 'queued' end,error_code='processing_failed',available_at=now()+interval '30 seconds'*power(2,least(attempt,5)),lease_token=null,lease_until=null,updated_at=now() where id=t.id;
 update calls set analysis_status=case when t.attempt>=5 then 'failed' else 'queued' end,updated_at=now() where company_id=t.company_id and id=t.call_id;
 return true;
end $$;
create function public.complete_analysis_task(_task uuid,_token uuid,_speech jsonb,_analysis jsonb,_provider text,_model text,_prompt text,_input int,_output int,_cost numeric,_latency int) returns boolean language plpgsql security invoker set search_path=public as $$
declare t analysis_tasks; transcript uuid;
begin
 select * into t from analysis_tasks where id=_task and state='running' and lease_token=_token and lease_until>now() for update;
 if not found then return false; end if;
 if _provider not in ('venice','openai') then raise exception 'Live analysis requires a real provider'; end if;
 perform 1 from calls where id=t.call_id and company_id=t.company_id and deleted_at is null for update;
 if not found then raise exception 'Call unavailable'; end if;
 -- Preserve existing transcript/segments if analysing a previously stored transcript.
 if t.transcript_text is not null or not exists(select 1 from call_transcripts where call_id=t.call_id and company_id=t.company_id) then
   delete from call_transcripts where call_id=t.call_id and company_id=t.company_id;
   insert into call_transcripts(company_id,call_id,full_text,language,provider,model) values(t.company_id,t.call_id,_speech->>'text',_speech->>'language',_speech->>'provider',_speech->>'model') returning id into transcript;
   insert into transcript_segments(company_id,call_id,transcript_id,speaker,speaker_type,start_ms,end_ms,text)
    select t.company_id,t.call_id,transcript,x.speaker,x.speaker_type,x.start_ms,x.end_ms,x.text from jsonb_to_recordset(_speech->'segments') as x(speaker text,speaker_type text,start_ms int,end_ms int,text text);
 end if;
 insert into call_ai_analyses(company_id,call_id,summary_concise,summary_detailed,customer_intent,outcome_category,conversion_confidence,overall_score,scores,objections,coaching,next_actions,missed_opportunities,compliance_flags,customer_analysis,prompt_version,provider,model,input_tokens,output_tokens,latency_ms,raw)
 values(t.company_id,t.call_id,_analysis#>>'{summary,concise}',_analysis#>>'{summary,detailed}',_analysis#>>'{summary,customerIntent}',_analysis#>>'{outcome,category}',(_analysis#>>'{outcome,conversionConfidence}')::numeric,(_analysis->>'overallScore')::numeric,_analysis->'scores',_analysis->'objections',_analysis->'coaching',_analysis->'nextActions',_analysis->'missedOpportunities',_analysis->'complianceFlags',_analysis->'customerAnalysis',_prompt,_provider,_model,_input,_output,_latency,_analysis)
 on conflict(call_id) do update set summary_concise=excluded.summary_concise,summary_detailed=excluded.summary_detailed,customer_intent=excluded.customer_intent,outcome_category=excluded.outcome_category,conversion_confidence=excluded.conversion_confidence,overall_score=excluded.overall_score,scores=excluded.scores,objections=excluded.objections,coaching=excluded.coaching,next_actions=excluded.next_actions,missed_opportunities=excluded.missed_opportunities,compliance_flags=excluded.compliance_flags,customer_analysis=excluded.customer_analysis,prompt_version=excluded.prompt_version,provider=excluded.provider,model=excluded.model,input_tokens=excluded.input_tokens,output_tokens=excluded.output_tokens,latency_ms=excluded.latency_ms,raw=excluded.raw;
 -- AI prediction is not a confirmed conversion. Do not change is_converted/revenue.
 update calls set analysis_status='completed',transcription_status='completed',overall_score=(_analysis->>'overallScore')::numeric,updated_at=now() where id=t.call_id and company_id=t.company_id;
 insert into call_processing_jobs(company_id,call_id,stage,status,provider,model,attempt,cost_estimate,completed_at) values(t.company_id,t.call_id,'completed','completed',_provider,_model,t.attempt,_cost,now());
 insert into call_events(company_id,call_id,kind,details) values(t.company_id,t.call_id,'analysis_completed',jsonb_build_object('taskId',t.id,'provider',_provider,'model',_model,'inputTokens',_input,'outputTokens',_output,'estimatedUsd',_cost));
 update analysis_tasks set state='completed',lease_token=null,lease_until=null,error_code=null,updated_at=now() where id=t.id;
 return true;
end $$;
revoke all on function public.enqueue_analysis_task(uuid,uuid,text),public.claim_analysis_task(),public.fail_analysis_task(uuid,uuid),public.complete_analysis_task(uuid,uuid,jsonb,jsonb,text,text,text,int,int,numeric,int) from public,anon,authenticated;
grant execute on function public.enqueue_analysis_task(uuid,uuid,text),public.claim_analysis_task(),public.fail_analysis_task(uuid,uuid),public.complete_analysis_task(uuid,uuid,jsonb,jsonb,text,text,text,int,int,numeric,int) to service_role;
commit;
