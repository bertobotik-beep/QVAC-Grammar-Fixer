// QVAC Grammar Fixer — core logic.
// completion() corrects grammar/spelling while preserving meaning and tone.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripPreamble(text) {
  return text
    .trim()
    .replace(/^(here'?s|here is)[^:\n]*:\s*/i, "")
    .replace(/^corrected( text| version)?:\s*/i, "")
    .replace(/^fixed( text| version)?:\s*/i, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

export async function fixGrammar(modelId, text) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You are a careful copy editor. Fix grammar, spelling, subject/object pronoun " +
          "mistakes (e.g. 'me and my friend was' -> 'my friend and I were'), and commonly " +
          "confused homophones (there/their/they're, its/it's, your/you're, then/than, " +
          "to/too/two). Make the SMALLEST changes necessary to fix real errors — do not " +
          "rephrase, restructure, or replace correct words. Preserve the original meaning, " +
          "tone, style, and voice exactly. Reply with ONLY the corrected text, no preamble, " +
          "no notes.",
      },
      { role: "user", content: text },
    ],
    stream: true,
    completionOpts: { temperature: 0.15, maxTokens: Math.max(120, Math.ceil(text.length / 3)) },
  });

  let raw = "";
  for await (const token of run.tokenStream) raw += token;
  let corrected = stripPreamble(raw);

  if (looksUnusable(corrected)) corrected = text;

  return { corrected, unchanged: corrected.trim() === text.trim() };
}
