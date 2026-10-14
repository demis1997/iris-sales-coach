begin;
create function public.call_metrics(_company uuid,_from timestamptz,_to timestamptz) returns jsonb language plpgsql security invoker set search_path=public as $$
declare result jsonb;
begin
 if not public.is_member_of(_company) or _to<=_from or _to-_from>interval '366 days' then raise exception 'Invalid metrics scope'; end if;
 select jsonb_build_object('phoneCalls',count(*) filter(where provider='twilio'),'uploads',count(*) filter(where provider='upload'),
 'active',count(*) filter(where status in('created','ringing','in_progress','provider_unknown')),
 'completed',count(*) filter(where status='completed' and provider='twilio'),
 'failed',count(*) filter(where status='failed' and provider='twilio'),
 'missed',count(*) filter(where status='missed' and provider='twilio'),
 'cancelled',count(*) filter(where status='cancelled' and provider='twilio'),
 'agentLegConnected',count(*) filter(where provider='twilio' and (status in('in_progress','completed') or duration_seconds>0)),
 'totalProviderLegSeconds',coalesce(sum(duration_seconds) filter(where provider='twilio'),0),
 'averageScore',avg(overall_score) filter(where analysis_status='completed'),
 'recordedConversions',count(*) filter(where is_converted),
 'from',_from,'to',_to,'scope','Accessible rows under database RLS; phone durations are parent-leg seconds, not prospect talk time',
 'providerBillingUsd',null,'appointmentsBooked',(select count(*) from lead_followups where company_id=_company and kind='appointment' and status='scheduled' and created_at>=_from and created_at<_to),'qualifiedLeads',(select count(*) from sales_leads where company_id=_company and status='qualified' and created_at>=_from and created_at<_to))
 into result from calls where company_id=_company and deleted_at is null and created_at>=_from and created_at<_to;
 return result;
end $$;
revoke all on function public.call_metrics(uuid,timestamptz,timestamptz) from public,anon;
grant execute on function public.call_metrics(uuid,timestamptz,timestamptz) to authenticated;
commit;
