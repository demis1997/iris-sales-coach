import { createServer } from "node:http";
import { createHash } from "node:crypto";
import WebSocket, { WebSocketServer } from "ws";
import twilio from "twilio";
import { analysisDatabase, enqueueCallAnalysis } from "../src/lib/ai/analysis.server.ts";
import { speechSocket, speakMulaw } from "../src/lib/voice/deepgram.server.ts";
import { Conversation } from "../src/lib/voice/conversation.ts";
import { createVeniceProvider } from "../src/ai/services/venice-provider.ts";
import { voiceSystem, workflowSchema } from "../src/lib/voice/workflow.ts";
import { LiveCopilotSchema } from "../src/ai/schemas/live-copilot.schema.ts";

if (process.env.ARTEMIS_ENABLE_VOICE !== "true" || process.env.ARTEMIS_ENABLE_PAID_AI !== "true")
  throw new Error("Explicit voice and paid-AI enablement required");
for (const key of [
  "TWILIO_AUTH_TOKEN",
  "TWILIO_ACCOUNT_SID",
  "DEEPGRAM_API_KEY",
  "VENICE_API_KEY",
  "VENICE_MODEL",
  "MEDIA_STREAM_PUBLIC_URL",
])
  if (!process.env[key]) throw new Error(`Missing ${key}`);
const publicUrl = new URL(process.env.MEDIA_STREAM_PUBLIC_URL!);
if (publicUrl.protocol !== "wss:" || publicUrl.pathname !== "/media")
  throw new Error("Public voice endpoint must use wss://host/media");
const signatureUrl = new URL(publicUrl);
signatureUrl.protocol = "https:";
const admin = analysisDatabase();
const venice = createVeniceProvider();
let draining = false;
const server = createServer((request, response) => {
  response.writeHead(request.url === "/health" && !draining ? 200 : 503, {
    "Content-Type": "application/json",
  });
  response.end(
    JSON.stringify({
      status: draining ? "draining" : "configured",
      providerConnectivity: "not_checked",
    }),
  );
});
const sockets = new WebSocketServer({ noServer: true, maxPayload: 65536 });
server.on("upgrade", (request, socket, head) => {
  const signature = request.headers["x-twilio-signature"];
  if (
    draining ||
    sockets.clients.size >= 50 ||
    request.url !== "/media" ||
    typeof signature !== "string" ||
    !twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN!, signature, signatureUrl.href, {})
  ) {
    socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  sockets.handleUpgrade(request, socket, head, (ws) => sockets.emit("connection", ws, request));
});
sockets.on("connection", (ws) => {
  let session:
    | {
        id: string;
        company_id: string;
        call_id: string;
        mode: string;
        provider_call_sid: string;
        workflow: unknown;
      }
    | undefined;
  let streamSid = "",
    lastSequence = 0,
    starting = false,
    closing = false,
    idle = Date.now(),
    coachGeneration = 0;
  let coachController: AbortController | undefined;
  const earlyAudio = new Map<string, Buffer[]>();
  const speech = new Map<string, WebSocket>();
  const rolling: string[] = [];
  const transcript: string[] = [];
  let transcriptSize = 0;
  const remember = (line: string) => {
    transcriptSize += line.length;
    if (transcriptSize > 120000) {
      ws.close(1009, "transcript limit");
      return;
    }
    transcript.push(line);
  };
  const utterances = new Map<string, string[]>();
  let conversation: Conversation | undefined;
  const send = (value: unknown) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (ws.bufferedAmount > 512000) {
        ws.close(1013, "audio backpressure");
        return;
      }
      ws.send(JSON.stringify(value));
    }
  };
  let eventQueue = Promise.resolve();
  let queued = 0;
  const emit = (kind: string, payload: Record<string, unknown>) => {
    if (!session || closing) return;
    if (++queued > 50) {
      ws.close(1013, "event backpressure");
      return;
    }
    const owner = session;
    eventQueue = eventQueue
      .then(async () => {
        const result = await admin
          .from("live_call_events")
          .insert({ company_id: owner.company_id, call_id: owner.call_id, kind, payload });
        if (result.error) ws.close(1011, "event persistence failed");
      })
      .catch(() => ws.close(1011, "event persistence failed"))
      .finally(() => {
        queued--;
      });
  };
  const handoff = async () => {
    if (!session || session.mode !== "agent") return;
    const workflow = workflowSchema.parse(session.workflow);
    try {
      await twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        .calls(session.provider_call_sid)
        .update({
          twiml: `<Response><Say>Connecting you to a human agent.</Say><Dial>${workflow.humanHandoffNumber}</Dial></Response>`,
        });
    } catch {
      emit("handoff_failed", {});
      ws.close(1011, "handoff failed");
    }
  };
  const optOut = async () => {
    if (!session) return;
    conversation?.close();
    coachController?.abort();
    const call = await admin
      .from("calls")
      .select("phone_number")
      .eq("id", session.call_id)
      .eq("company_id", session.company_id)
      .maybeSingle();
    if (call.error || !call.data?.phone_number) {
      emit("suppression_failed", {});
      ws.close(1011, "suppression failed");
      return;
    }
    const suppression = await admin.from("contact_suppressions").upsert(
      {
        company_id: session.company_id,
        phone_e164: call.data.phone_number,
        reason: "live_call_opt_out",
      },
      { onConflict: "company_id,phone_e164" },
    );
    if (suppression.error) emit("suppression_failed", {});
    else emit("opt_out_recorded", {});
    try {
      await twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        .calls(session.provider_call_sid)
        .update({ status: "completed" });
    } catch {
      emit("hangup_failed", {});
    }
    ws.close(1000, "opt out");
  };
  const coach = async () => {
    coachController?.abort();
    const controller = (coachController = new AbortController());
    const generation = ++coachGeneration;
    try {
      let text = "";
      const started = Date.now();
      for await (const chunk of venice.stream(
        [
          {
            role: "system",
            content:
              'You coach a human forex sales representative silently. Return JSON only: {"suggestions":[{"type":"objection","priority":"high","shortTitle":"...","reason":"evidence only","suggestedAction":"under 20 words","optionalPhrase":"..."}]}. Maximum 2 suggestions. Return none unless useful. No guaranteed returns, investment advice or invented facts. Include discovery gaps, objections or excessive agent speech only when supported.',
          },
          { role: "user", content: rolling.join("\n").slice(-12000) },
        ],
        controller.signal,
      )) {
        if (generation !== coachGeneration) return;
        if (chunk.type === "text") text += chunk.text;
      }
      if (generation !== coachGeneration) return;
      emit("coaching", {
        ...LiveCopilotSchema.parse(JSON.parse(text)),
        latencyMs: Date.now() - started,
        promptVersion: "live-coach-1.0.0",
      });
    } catch {
      if (!controller.signal.aborted) emit("coaching_unavailable", {});
    }
  };
  const attachSpeech = (track: string, language: "en" | "ru") => {
    const stt = speechSocket(language);
    speech.set(track, stt);
    stt.on("open", () => {
      for (const audio of earlyAudio.get(track) ?? []) stt.send(audio);
      earlyAudio.delete(track);
    });
    stt.on("error", () => ws.close(1011, "speech provider unavailable"));
    stt.on("close", () => {
      if (!closing) ws.close(1011, "speech connection ended");
    });
    stt.on("message", (bytes) => {
      try {
        const event = JSON.parse(bytes.toString());
        if (event.type === "SpeechStarted") {
          idle = Date.now();
          if (session?.mode === "agent") conversation?.interrupt();
          return;
        }
        if (event.type !== "Results") return;
        const text = event.channel?.alternatives?.[0]?.transcript;
        if (typeof text !== "string" || text.length > 8000) return;
        if (text.trim()) idle = Date.now();
        if (event.is_final && text.trim())
          utterances.set(track, [...(utterances.get(track) ?? []), text]);
        if (!event.speech_final) return;
        const final = (utterances.get(track) ?? []).join(" ");
        utterances.delete(track);
        if (!final) return;
        const speaker =
          session?.mode === "agent" ? "Customer" : track === "inbound" ? "Agent" : "Customer";
        remember(`${speaker}: ${final}`);
        rolling.push(`${speaker}: ${final}`);
        if (rolling.length > 40) rolling.shift();
        emit("transcript", {
          speaker,
          text: final,
          startMs: Math.round((event.start ?? 0) * 1000),
          durationMs: Math.round((event.duration ?? 0) * 1000),
          provider: "deepgram",
        });
        if (
          speaker === "Customer" &&
          /stop calling|do not call|opt out|не звоните|не звони|отпиш/i.test(final)
        ) {
          void optOut();
        } else if (session?.mode === "agent") {
          if (/human agent|speak to a person|оператор|человек/i.test(final)) {
            conversation?.close();
            void handoff();
          } else void conversation?.accept(final);
        } else void coach();
      } catch {
        ws.close(1008, "invalid speech event");
      }
    });
    const keepAlive = setInterval(() => {
      if (stt.readyState === WebSocket.OPEN) stt.send(JSON.stringify({ type: "KeepAlive" }));
    }, 5000);
    stt.once("close", () => clearInterval(keepAlive));
  };
  const startTimeout = setTimeout(() => {
    if (!session) ws.close(1008, "start required");
  }, 5000);
  const silence = setInterval(() => {
    if (session && Date.now() - idle > 45000) {
      emit("silence_timeout", {});
      conversation?.close();
      void handoff();
      ws.close(1000, "silence timeout");
    }
  }, 5000);
  const lifetime = setTimeout(() => ws.close(1000, "session time limit"), 1800000);
  ws.on("error", () => {});
  let frameQueue = Promise.resolve(),
    pendingFrames = 0;
  ws.on("message", (bytes) => {
    if (++pendingFrames > 100) {
      ws.close(1013, "frame backpressure");
      return;
    }
    frameQueue = frameQueue
      .then(async () => {
        try {
          const message = JSON.parse(bytes.toString());
          if (message.event === "connected") return;
          const sequence = Number(message.sequenceNumber);
          if (!Number.isSafeInteger(sequence) || sequence <= lastSequence)
            throw new Error("message order");
          lastSequence = sequence;
          if (message.event === "start") {
            if (session || starting) throw new Error("duplicate start");
            starting = true;
            const start = message.start;
            if (
              start.accountSid !== process.env.TWILIO_ACCOUNT_SID ||
              start.mediaFormat?.encoding !== "audio/x-mulaw" ||
              start.mediaFormat?.sampleRate !== 8000 ||
              start.mediaFormat?.channels !== 1 ||
              !/^MZ[a-fA-F0-9]{32}$/.test(start.streamSid) ||
              !/^CA[a-fA-F0-9]{32}$/.test(start.callSid) ||
              !/^[a-f0-9]{64}$/.test(start.customParameters?.token ?? "")
            )
              throw new Error("invalid start");
            const result = await admin.rpc("claim_voice_session", {
              _hash: createHash("sha256").update(start.customParameters.token).digest("hex"),
              _sid: start.callSid,
              _stream: start.streamSid,
            });
            if (result.error || result.data?.length !== 1) throw new Error("invalid session");
            session = result.data[0];
            if (closing || ws.readyState !== WebSocket.OPEN) {
              await admin.from("voice_sessions").update({ state: "closed" }).eq("id", session!.id);
              return;
            }
            streamSid = start.streamSid;
            clearTimeout(startTimeout);
            if (session!.mode === "agent") {
              const workflow = workflowSchema.parse(session!.workflow);
              conversation = new Conversation(
                {
                  stream: (messages, signal) => venice.stream(messages, signal),
                  speak: speakMulaw,
                  audio: (audio) =>
                    send({
                      event: "media",
                      streamSid,
                      media: { payload: Buffer.from(audio).toString("base64") },
                    }),
                  clear: () => send({ event: "clear", streamSid }),
                  event: (event) => {
                    if (event.type === "response_generated" && event.text)
                      remember(`AI (generated; playback unverified): ${event.text}`);
                    emit(event.type, { ...event });
                    if (event.type === "human_handoff_required") void handoff();
                  },
                },
                voiceSystem(workflow),
              );
              attachSpeech("inbound", workflow.language);
            } else {
              const language =
                (session!.workflow as { language?: string } | null)?.language === "ru"
                  ? "ru"
                  : "en";
              attachSpeech("inbound", language);
              attachSpeech("outbound", language);
            }
            emit("stream_connected", { mode: session!.mode });
          } else if (message.event === "media") {
            if (
              !session ||
              message.streamSid !== streamSid ||
              typeof message.media?.payload !== "string" ||
              message.media.payload.length > 16000
            )
              throw new Error("invalid media");
            const stt = speech.get(message.media.track ?? "inbound");
            if (!stt) throw new Error("unknown track");
            if (stt.readyState === WebSocket.CONNECTING) {
              const track = message.media.track ?? "inbound";
              const pending = earlyAudio.get(track) ?? [];
              const audio = Buffer.from(message.media.payload, "base64");
              if (pending.reduce((size, chunk) => size + chunk.length, 0) + audio.length > 16000) {
                ws.close(1013, "speech initialization timeout");
                return;
              }
              pending.push(audio);
              earlyAudio.set(track, pending);
              return;
            }
            if (stt.readyState !== WebSocket.OPEN) {
              ws.close(1011, "speech not available");
              return;
            }
            if (stt.bufferedAmount > 64000) {
              ws.close(1013, "speech backpressure");
              return;
            }
            stt.send(Buffer.from(message.media.payload, "base64"));
          } else if (message.event === "stop") ws.close(1000, "call ended");
        } catch {
          ws.close(1008, "invalid stream");
        }
      })
      .finally(() => {
        pendingFrames--;
      });
  });
  ws.once("close", () => {
    closing = true;
    clearTimeout(startTimeout);
    clearTimeout(lifetime);
    clearInterval(silence);
    conversation?.close();
    coachController?.abort();
    for (const stt of speech.values()) stt.close();
    if (session) {
      const owner = session;
      void eventQueue
        .then(async () => {
          await admin.from("voice_sessions").update({ state: "closed" }).eq("id", owner.id);
          const result = await admin.from("call_transcripts").insert({
            company_id: owner.company_id,
            call_id: owner.call_id,
            full_text: transcript.join("\n"),
            provider: "deepgram",
            model: process.env.DEEPGRAM_STT_MODEL || "nova-3",
          });
          if (!result.error && rolling.length)
            await enqueueCallAnalysis({ companyId: owner.company_id, callId: owner.call_id });
        })
        .catch(() =>
          console.error(JSON.stringify({ event: "voice_finalize_failed", callId: owner.call_id })),
        );
    }
  });
});
const shutdown = () => {
  draining = true;
  server.close();
  for (const ws of sockets.clients) ws.close(1012, "server draining");
  setTimeout(() => process.exit(0), 10000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
server.listen(Number(process.env.VOICE_PORT || 4400), process.env.VOICE_BIND || "127.0.0.1", () =>
  console.info(
    JSON.stringify({ event: "voice_worker_listening", providerConnectivity: "unverified" }),
  ),
);
