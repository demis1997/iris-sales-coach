import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { readBounded } from "@/lib/providers/http.server";
const word = z.object({
  word: z.string().max(200),
  punctuated_word: z.string().max(200).optional(),
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
  speaker: z.number().int().nonnegative().optional(),
});
const responseSchema = z.object({
  results: z.object({
    channels: z
      .array(
        z.object({
          alternatives: z
            .array(
              z.object({
                transcript: z.string().max(120000),
                words: z.array(word).max(30000).optional(),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});
export type SpeechSegment = {
  speaker: string;
  speaker_type: string;
  start_ms: number;
  end_ms: number;
  text: string;
};
export function parseDeepgram(payload: unknown) {
  const channel = responseSchema.parse(payload).results.channels[0].alternatives[0];
  const segments: SpeechSegment[] = [];
  for (const word of channel.words ?? []) {
    if (word.end < word.start) throw new Error("invalid_speech_timestamp");
    const speaker = word.speaker === undefined ? "Unknown speaker" : `Speaker ${word.speaker}`;
    const previous = segments.at(-1);
    if (previous?.speaker === speaker && previous.text.length < 500) {
      previous.text += " " + (word.punctuated_word ?? word.word);
      previous.end_ms = Math.round(word.end * 1000);
    } else
      segments.push({
        speaker,
        speaker_type: "unknown",
        start_ms: Math.round(word.start * 1000),
        end_ms: Math.round(word.end * 1000),
        text: word.punctuated_word ?? word.word,
      });
  }
  return {
    text: segments.length
      ? segments.map((segment) => `${segment.speaker}: ${segment.text}`).join("\n")
      : channel.transcript,
    segments,
    provider: "deepgram",
    model: "nova-3",
  };
}
export async function transcribeAudio(
  audio: Blob,
  language: string,
  key: string,
  request: typeof fetch = fetch,
) {
  if (!key)
    throw new Error(
      "Configure DEEPGRAM_API_KEY for real transcription; no transcript was fabricated",
    );
  if (!["en", "ru"].includes(language)) throw new Error("Unsupported transcription language");
  if (audio.size > 100 * 1024 * 1024 || audio.size === 0) throw new Error("recording_size_bounds");
  const response = await request(
    `https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&diarize=true&language=${language}`,
    {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(90000),
      headers: { Authorization: `Token ${key}`, "Content-Type": audio.type || "audio/mpeg" },
      body: audio,
    },
  );
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`transcription_provider_rejected_${response.status}`);
  }
  return parseDeepgram(
    JSON.parse(new TextDecoder().decode(await readBounded(response, 8 * 1024 * 1024))),
  );
}
export async function transcribeStoredCall(
  admin: SupabaseClient,
  companyId: string,
  callId: string,
  language: string,
) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key)
    throw new Error(
      "Configure DEEPGRAM_API_KEY for real transcription; no transcript was fabricated",
    );
  const { data, error } = await admin
    .from("call_recordings")
    .select("storage_path")
    .eq("company_id", companyId)
    .eq("call_id", callId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data?.storage_path?.startsWith(`${companyId}/${callId}/`))
    throw new Error("recording_not_found");
  const recording = await admin.storage.from("call-recordings").download(data.storage_path);
  if (recording.error || !recording.data) throw new Error("recording_download_failed");
  return transcribeAudio(recording.data, language, key);
}
