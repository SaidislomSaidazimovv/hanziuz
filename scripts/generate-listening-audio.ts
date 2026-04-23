/**
 * Generates MP3 audio files for vocabulary via Edge-TTS, uploads to
 * Supabase Storage bucket "listening-audio", and writes rows to
 * listening_clips.
 *
 * Usage:
 *   npx tsx scripts/generate-listening-audio.ts              # all HSK 1 words
 *   npx tsx scripts/generate-listening-audio.ts --level 2    # HSK 2
 *   npx tsx scripts/generate-listening-audio.ts --limit 5    # first 5 only (dry-ish run)
 *
 * Requires:
 *   - NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - Migration 020 applied
 *   - Public bucket "listening-audio" created in Supabase Storage
 */

import { createClient } from "@supabase/supabase-js";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Load .env.local manually because dotenv/config reads .env by default.
try {
  const envLocal = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  for (const line of envLocal.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // no .env.local — rely on process.env
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "listening-audio";
const VOICE = "zh-CN-XiaoxiaoNeural"; // female, Beijing standard
const SPEAKER_TAG = "tts-edge-xiaoxiao";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Parse args
const args = process.argv.slice(2);
function argVal(name: string, def?: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
}
const hskLevel = Number(argVal("level", "1"));
const limit = Number(argVal("limit", "500"));

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

async function synthesize(text: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  return streamToBuffer(audioStream);
}

async function uploadClip(
  vocabId: string,
  hanzi: string,
  buffer: Buffer
): Promise<string> {
  const safeId = vocabId.replace(/[^a-zA-Z0-9-]/g, "");
  const path = `hsk${hskLevel}/${safeId}.mp3`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });
  if (upErr) {
    throw new Error(`Upload failed for ${hanzi}: ${upErr.message}`);
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  console.log(`Loading HSK ${hskLevel} vocab (limit ${limit})...`);
  const { data: vocab, error } = await supabase
    .from("vocabulary")
    .select("id, hanzi, pinyin, meaning_uz")
    .eq("hsk_level", hskLevel)
    .limit(limit);

  if (error) {
    console.error("Vocab fetch failed:", error.message);
    process.exit(1);
  }
  if (!vocab || vocab.length === 0) {
    console.log("No vocab found.");
    return;
  }

  // Skip rows already present in listening_clips
  const { data: existing } = await supabase
    .from("listening_clips")
    .select("vocab_id")
    .eq("hsk_level", hskLevel)
    .eq("clip_type", "word");
  const done = new Set((existing ?? []).map((r) => r.vocab_id));
  const todo = vocab.filter((v) => !done.has(v.id));

  console.log(
    `${vocab.length} vocab rows total, ${done.size} already generated, ${todo.length} to do.`
  );

  let ok = 0;
  let fail = 0;
  for (const [i, word] of todo.entries()) {
    const progress = `[${i + 1}/${todo.length}]`;
    try {
      const buf = await synthesize(word.hanzi);
      const url = await uploadClip(word.id, word.hanzi, buf);
      const { error: insertErr } = await supabase
        .from("listening_clips")
        .insert({
          audio_url: url,
          transcript_zh: word.hanzi,
          transcript_pinyin: word.pinyin,
          translation_uz: word.meaning_uz,
          hsk_level: hskLevel,
          clip_type: "word",
          speaker: SPEAKER_TAG,
          vocab_id: word.id,
        });
      if (insertErr) throw new Error(insertErr.message);
      ok++;
      console.log(`${progress} ✓ ${word.hanzi} (${word.pinyin})`);
    } catch (err) {
      fail++;
      console.error(
        `${progress} ✗ ${word.hanzi}:`,
        err instanceof Error ? err.message : err
      );
    }
    // Brief pause to avoid rate-limiting the Edge-TTS service
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. Generated: ${ok}, Failed: ${fail}.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
