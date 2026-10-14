import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

// Real PostgreSQL engine compiled to WASM; auth/storage schemas below are test
// fixtures, not a Supabase/PostgREST integration or real telephony test.
test("migrations, tenant FK/RLS, server-managed verification, monotonic callbacks and fenced queue", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create schema storage;
      grant usage on schema public,auth,storage to authenticated,anon,service_role;
      create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,owner uuid);
      alter table storage.objects enable row level security;
      grant all on storage.objects to authenticated,service_role;
      create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;`);
    const migration = (name) => readFileSync(`supabase/migrations/${name}`, "utf8");
    await db.exec(migration("20260806111711_7ce7b1fc-7abb-4895-bf45-8b470ee386ee.sql"));
    for (const role of ["platform_admin", "team_leader", "viewer", "trainer"])
      await db.exec(`alter type public.app_role add value '${role}'`);
    for (const file of [
      "20260806111728_0a3f9da4-cb90-4579-80f4-3301c66d6e66.sql",
      "20260806143000_revenue_intelligence.sql",
      "20260806154000_phase1_tenancy.sql",
      "20260809120000_phase2_calls.sql",
      "20260809210000_phase3_telephony.sql",
      "20261014090000_production_boundaries.sql",
      "20261014100000_analysis_queue.sql",
      "20261014110000_live_voice.sql",
      "20261014120000_crm_outbox.sql",
      "20261014140000_leads.sql",
      "20261014150000_call_metrics.sql",
      "20261014160000_call_erasure.sql",
    ])
      await db.exec(migration(file));
    const u1 = "00000000-0000-4000-8000-000000000001",
      u2 = "00000000-0000-4000-8000-000000000002";
    await db.query(
      "insert into auth.users(id,email) values($1,'one@example.test'),($2,'two@example.test')",
      [u1, u2],
    );
    const company = async (user) =>
      (await db.query("select company_id from company_memberships where user_id=$1", [user]))
        .rows[0].company_id;
    const c1 = await company(u1),
      c2 = await company(u2);
    const call = "00000000-0000-4000-8000-000000000003";
    await db.query(
      "insert into calls(id,company_id,agent_user_id,provider,status,idempotency_key) values($1,$2,$3,'twilio','created',$1)",
      [call, c1, u1],
    );
    await assert.rejects(
      () =>
        db.query("insert into calls(company_id,agent_user_id,idempotency_key) values($1,$2,$3)", [
          c1,
          u1,
          call,
        ]),
      /unique/,
    );
    await assert.rejects(
      () =>
        db.query(
          "insert into call_transcripts(company_id,call_id,full_text) values($1,$2,'wrong tenant')",
          [c2, call],
        ),
      /foreign key/,
    );
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [u2]);
    await db.exec("set role authenticated");
    assert.equal((await db.query("select * from calls where id=$1", [call])).rows.length, 0);
    assert.equal(
      (await db.query("select public.can_read_call($1,$2) as allowed", [c1, call])).rows[0].allowed,
      false,
    );
    await assert.rejects(
      () => db.query("update profiles set phone_verified_at=now() where id=$1", [u2]),
      /server-managed/,
    );
    await assert.rejects(
      () => db.query("select public.enqueue_analysis_task($1,$2,null)", [c1, call]),
      /permission denied/,
    );
    await db.exec("reset role");
    await db.exec("set role service_role");
    assert.equal(
      (
        await db.query("select apply_call_status($1,$2,$3,2,'completed',10) as applied", [
          c1,
          call,
          "CA" + "a".repeat(32),
        ])
      ).rows[0].applied,
      true,
    );
    assert.equal(
      (
        await db.query("select apply_call_status($1,$2,$3,1,'ringing',0) as applied", [
          c1,
          call,
          "CA" + "a".repeat(32),
        ])
      ).rows[0].applied,
      false,
    );
    await assert.rejects(
      () =>
        db.query("select apply_call_status($1,$2,$3,3,'completed',10)", [
          c1,
          call,
          "CA" + "b".repeat(32),
        ]),
      /mismatch/,
    );
    for (let n = 0; n < 3; n++)
      assert.equal(
        (await db.query("select consume_provider_limit($1,$2,'dial',2,60) as allowed", [c1, u1]))
          .rows[0].allowed,
        n < 2,
      );
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [u1]);
    await db.exec("set role authenticated");
    await assert.rejects(
      () =>
        db.query(
          "update company_memberships set role='platform_admin' where company_id=$1 and user_id=$2",
          [c1, u1],
        ),
      /server-managed/,
    );
    const lead = "00000000-0000-4000-8000-000000000010";
    await assert.rejects(
      () =>
        db.query(
          "insert into sales_leads(company_id,owner_user_id,name,phone_e164,marketing_consent) values($1,$2,'Missing consent evidence','+12345678901','granted')",
          [c1, u1],
        ),
      /check constraint/,
    );
    await db.query(
      "insert into sales_leads(id,company_id,owner_user_id,name,phone_e164,status,marketing_consent,consent_reference) values($1,$2,$3,'Test lead','+12345678901','qualified','granted','test-consent-record')",
      [lead, c1, u1],
    );
    await db.query(
      "insert into lead_followups(company_id,lead_id,owner_user_id,kind,title,due_at) values($1,$2,$3,'appointment','Test internal demo',now()+interval '1 day')",
      [c1, lead, u1],
    );
    await db.query("update sales_leads set marketing_consent='withdrawn' where id=$1", [lead]);
    assert.equal(
      (await db.query("select * from contact_suppressions where company_id=$1", [c1])).rows.length,
      1,
    );
    const metrics = (
      await db.query(
        "select call_metrics($1,now()-interval '1 day',now()+interval '1 day') as metrics",
        [c1],
      )
    ).rows[0].metrics;
    assert.equal(metrics.qualifiedLeads, 1);
    assert.equal(metrics.appointmentsBooked, 1);
    assert.equal(metrics.phoneCalls, 1);
    assert.equal(metrics.completed, 1);
    assert.equal(metrics.providerBillingUsd, null);
    await assert.rejects(
      () => db.query("update calls set external_call_id='tampered' where id=$1", [call]),
      /permission denied/,
    );
    await db.exec("reset role;set role service_role");
    const task = (await db.query("select enqueue_analysis_task($1,$2,null) as id", [c1, call]))
      .rows[0].id;
    assert.equal(
      (await db.query("select enqueue_analysis_task($1,$2,null) as id", [c1, call])).rows[0].id,
      task,
    );
    const claimed = (await db.query("select * from claim_analysis_task()")).rows[0];
    assert.equal(claimed.id, task);
    assert.equal(
      (await db.query("select fail_analysis_task($1,$2) as ok", [task, call])).rows[0].ok,
      false,
    );
    assert.equal(
      (await db.query("select fail_analysis_task($1,$2) as ok", [task, claimed.lease_token]))
        .rows[0].ok,
      true,
    );
    await db.query("update analysis_tasks set available_at=now()-interval '1 second' where id=$1", [
      task,
    ]);
    const next = (await db.query("select * from claim_analysis_task()")).rows[0];
    const analysis = {
      summary: {
        concise: "Observed test speech",
        detailed: "Explicit SQL test fixture, not real provider data",
      },
      outcome: { category: "Follow-up", conversionConfidence: 0.5, converted: true },
      overallScore: 70,
      scores: {},
      objections: [],
      coaching: {},
      nextActions: [],
      missedOpportunities: [],
      complianceFlags: [],
      customerAnalysis: {},
    };
    const speech = {
      text: "Speaker 0: Actual SQL test input",
      language: "en",
      provider: "test-fixture",
      model: "fixture",
      segments: [],
    };
    const sql =
      "select complete_analysis_task($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7,$8,$9,$10,$11) as ok";
    assert.equal(
      (
        await db.query(sql, [
          task,
          claimed.lease_token,
          JSON.stringify(speech),
          JSON.stringify(analysis),
          "venice",
          "fixture",
          "test@1",
          1,
          2,
          null,
          3,
        ])
      ).rows[0].ok,
      false,
    );
    assert.equal(
      (
        await db.query(sql, [
          task,
          next.lease_token,
          JSON.stringify(speech),
          JSON.stringify(analysis),
          "venice",
          "fixture",
          "test@1",
          1,
          2,
          null,
          3,
        ])
      ).rows[0].ok,
      true,
    );
    assert.equal(
      (await db.query("select is_converted from calls where id=$1", [call])).rows[0].is_converted,
      false,
    );
    assert.equal(
      (await db.query("select state from crm_outbox where call_id=$1", [call])).rows[0].state,
      "blocked",
    );
    const voiceCall = "00000000-0000-4000-8000-000000000011";
    await db.query(
      "insert into calls(id,company_id,provider,status) values($1,$2,'twilio','ringing')",
      [voiceCall, c1],
    );
    await db.query(
      "insert into voice_sessions(company_id,call_id,provider_call_sid,token_hash,mode,expires_at) values($1,$2,$3,'hash','coach',now()+interval '1 minute')",
      [c1, voiceCall, "CA" + "a".repeat(32)],
    );
    assert.equal(
      (
        await db.query("select * from claim_voice_session('hash',$1,'stream-1')", [
          "CA" + "a".repeat(32),
        ])
      ).rows.length,
      1,
    );
    assert.equal(
      (
        await db.query("select * from claim_voice_session('hash',$1,'stream-1')", [
          "CA" + "a".repeat(32),
        ])
      ).rows.length,
      0,
    );

    {
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [u1]);
      await db.exec("set role authenticated");
      await assert.rejects(
        () => db.query("update calls set legal_hold=true where id=$1", [call]),
        /permission denied|server-managed/,
      );
      await assert.rejects(
        () => db.query("select plan_call_erasures($1)", [c1]),
        /permission denied/,
      );
      await db.exec("reset role;set role service_role");
      await assert.rejects(
        () => db.query("select request_call_erasure($1,$2,$3,'ticket-123')", [c1, call, u2]),
        /Administrator/,
      );
      await db.query("select set_call_legal_hold($1,$2,$3,true)", [c1, call, u1]);
      await assert.rejects(
        () => db.query("select request_call_erasure($1,$2,$3,'ticket-123')", [c1, call, u1]),
        /held/,
      );
      await db.query("select set_call_legal_hold($1,$2,$3,false)", [c1, call, u1]);
      const task = (
        await db.query("select request_call_erasure($1,$2,$3,'ticket-123') as id", [c1, call, u1])
      ).rows[0].id;
      assert.equal(
        (await db.query("select request_call_erasure($1,$2,$3,'ticket-123') as id", [c1, call, u1]))
          .rows[0].id,
        task,
      );
      assert.equal((await db.query("select * from plan_call_erasures($1)", [c1])).rows.length, 0);
      await db.query("update calls set deleted_at=now()-interval '400 days' where id=$1", [call]);
      await db.query(
        "insert into call_recordings(company_id,call_id,storage_path) values($1,$2,$3)",
        [c1, call, `${c1}/${call}/recording.wav`],
      );
      const planned = (await db.query("select * from plan_call_erasures($1)", [c1])).rows[0];
      assert.equal(planned.task_id, task);
      assert.equal(
        (await db.query("select claim_call_erasure($1,$2,'[{}]') as token", [c1, task])).rows[0]
          .token,
        null,
      );
      const token = (
        await db.query("select claim_call_erasure($1,$2,$3) as token", [
          c1,
          task,
          JSON.stringify(planned.objects),
        ])
      ).rows[0].token;
      assert.ok(token);
      await assert.rejects(
        () => db.query("select set_call_legal_hold($1,$2,$3,true)", [c1, call, u1]),
        /in progress/,
      );
      assert.equal(
        (
          await db.query("select finish_call_erasure($1,$2,$3,$4) as done", [
            c1,
            task,
            u2,
            JSON.stringify(planned.objects),
          ])
        ).rows[0].done,
        false,
      );
      assert.equal(
        (
          await db.query("select finish_call_erasure($1,$2,$3,$4) as done", [
            c1,
            task,
            token,
            JSON.stringify(planned.objects),
          ])
        ).rows[0].done,
        true,
      );
      assert.equal((await db.query("select * from calls where id=$1", [call])).rows.length, 0);
      assert.equal(
        (await db.query("select * from call_transcripts where call_id=$1", [call])).rows.length,
        0,
      );
      assert.equal(
        (await db.query("select * from call_erasure_receipts where call_id=$1", [call])).rows
          .length,
        1,
      );
      assert.equal((await db.query("select * from calls where id=$1", [voiceCall])).rows.length, 1);
    }
  } finally {
    await db.close();
  }
});
