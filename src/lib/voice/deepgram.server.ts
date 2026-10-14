import WebSocket from "ws";
import { readBounded } from "@/lib/providers/http.server";
export async function* speakMulaw(
  text: string,
  signal: AbortSignal,
  request: typeof fetch = fetch,
) {
  const provider = process.env.TTS_PROVIDER || "deepgram";
  const key =
    provider === "elevenlabs" ? process.env.ELEVENLABS_API_KEY : process.env.DEEPGRAM_API_KEY;
  const model =
    provider === "elevenlabs" ? process.env.ELEVENLABS_MODEL : process.env.DEEPGRAM_TTS_MODEL;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  if (!key || !model || (provider === "elevenlabs" && !voice))
    throw new Error("TTS configuration missing");
  if (!["deepgram", "elevenlabs"].includes(provider)) throw new Error("Unsupported TTS provider");
  const url =
    provider === "elevenlabs"
      ? `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice!)}/stream?output_format=ulaw_8000`
      : `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(model)}&encoding=mulaw&sample_rate=8000&container=none`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (provider === "elevenlabs") headers["xi-api-key"] = key;
  else headers.Authorization = `Token ${key}`;
  const response = await request(url, {
    method: "POST",
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
    redirect: "error",
    headers,
    body: JSON.stringify({ text, ...(provider === "elevenlabs" ? { model_id: model } : {}) }),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error("TTS provider unavailable");
  }
  // Bound each sentence. Output is raw 8 kHz mu-law, never a WAV/MP3 header.
  const bytes = await readBounded(response, 256000);
  for (let offset = 0; offset < bytes.length; offset += 640) {
    signal.throwIfAborted();
    yield bytes.subarray(offset, offset + 640);
  }
}
export function speechSocket(language: "en" | "ru") {
  if (!process.env.DEEPGRAM_API_KEY) throw new Error("STT configuration missing");
  const params = new URLSearchParams({
    model: process.env.DEEPGRAM_STT_MODEL || "nova-3",
    encoding: "mulaw",
    sample_rate: "8000",
    channels: "1",
    language,
    interim_results: "true",
    vad_events: "true",
    endpointing: "300",
    utterance_end_ms: "1000",
  });
  return new WebSocket(`wss://api.deepgram.com/v1/listen?${params}`, {
    headers: { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}` },
    maxPayload: 262144,
    handshakeTimeout: 10000,
  });
}
