begin;
create table public.sales_leads(id uuid primary key default gen_random_uuid(),company_id uuid not null references public.companies(id),owner_user_id uuid not null references auth.users(id),name text not null check(length(name) between 1 and 120),phone_e164 text not null check(phone_e164~'^\+[1-9][0-9]{7,14}$'),status text not null default 'new' check(status in('new','qualified','follow_up','demo_booked','onboarding','reactivation','declined')),marketing_consent text not null default 'unknown' check(marketing_consent in('unknown','granted','withdrawn')),consent_reference text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(company_id,id),unique(company_id,phone_e164),check(marketing_consent<>'granted' or consent_reference is not null and length(consent_reference)>=8));
alter table public.sales_leads enable row level security;
grant all on public.sales_leads to service_role;
grant select,insert on public.sales_leads to authenticated;
grant update(name,status,marketing_consent,consent_reference,updated_at) on public.sales_leads to authenticated;
create function public.can_read_lead(_company uuid,_lead uuid) returns boolean language sql stable security definer set search_path=public as $$
 select public.is_member_of(_company) and exists(select 1 from sales_leads where company_id=_company and id=_lead and(owner_user_id=auth.uid() or public.has_company_role(_company,array['owner','admin','ceo','viewer']::app_role[])));
$$;
create policy lead_read on public.sales_leads for select to authenticated using(public.can_read_lead(company_id,id));
create policy lead_insert on public.sales_leads for insert to authenticated with check(public.is_member_of(company_id) and owner_user_id=auth.uid() and public.has_company_role(company_id,array['owner','admin','manager','team_leader','rep']::app_role[]));
create policy lead_update on public.sales_leads for update to authenticated using(public.is_member_of(company_id) and(owner_user_id=auth.uid() or public.has_company_role(company_id,array['owner','admin']::app_role[])) and public.has_company_role(company_id,array['owner','admin','manager','team_leader','rep']::app_role[]));
alter table public.calls add column lead_id uuid;
alter table public.calls add constraint calls_tenant_lead_fk foreign key(company_id,lead_id) references public.sales_leads(company_id,id);
create table public.lead_followups(id uuid primary key default gen_random_uuid(),company_id uuid not null,lead_id uuid not null,owner_user_id uuid not null references auth.users(id),kind text not null check(kind in('task','appointment')),title text not null check(length(title) between 1 and 200),due_at timestamptz not null,status text not null default 'scheduled' check(status in('scheduled','completed','cancelled')),created_at timestamptz not null default now(),foreign key(company_id,lead_id) references public.sales_leads(company_id,id) on delete cascade);
alter table public.lead_followups enable row level security;
grant all on public.lead_followups to service_role;
grant select,insert on public.lead_followups to authenticated;
grant update(status) on public.lead_followups to authenticated;
create policy followup_read on public.lead_followups for select to authenticated using(public.can_read_lead(company_id,lead_id));
create policy followup_insert on public.lead_followups for insert to authenticated with check(public.can_read_lead(company_id,lead_id) and owner_user_id=auth.uid() and public.has_company_role(company_id,array['owner','admin','manager','team_leader','rep']::app_role[]));
create policy followup_update on public.lead_followups for update to authenticated using(public.can_read_lead(company_id,lead_id) and owner_user_id=auth.uid());
-- Consent withdrawal creates durable suppression; the browser cannot remove it.
create function public.suppress_withdrawn_lead() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.marketing_consent='withdrawn' then insert into contact_suppressions(company_id,phone_e164,reason) values(new.company_id,new.phone_e164,'lead_consent_withdrawn') on conflict(company_id,phone_e164) do nothing; end if;
 return new;
end $$;
create trigger lead_withdrawal_suppression after insert or update on public.sales_leads for each row execute function public.suppress_withdrawn_lead();
commit;
