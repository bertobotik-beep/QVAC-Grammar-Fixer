# QVAC Grammar Fixer

Paste any text and an on-device AI corrects spelling and grammar mistakes while preserving your original meaning, tone, and style — it fixes errors, it doesn't rewrite your voice. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:31004

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

`src/logic.js` uses a low temperature (0.15) and an explicit "make the SMALLEST changes necessary" instruction so the model corrects errors without rewriting your voice or restructuring sentences. The `maxTokens` budget scales with input length (`Math.max(120, text.length / 3)`) so longer paragraphs aren't cut off mid-correction. If the model's reply looks unusable (empty, or a refusal like "I cannot..."), the original text is returned unchanged rather than showing a broken response.

## Example

- **Input:** `"Me and my friend was going too the store, its closed on sundays."`
- **Output:** `"My friend and I were going to the store; it's closed on Sundays."` — pronoun agreement, verb agreement, and the your/you're-style homophone (`too` -> `to`, `its` -> `it's`) are fixed, wording and tone are left otherwise untouched. The response also reports `unchanged: false` when a correction was actually made.

## Setup

Requires Node.js and a machine that can run the QVAC on-device runtime (see the QVAC SDK docs for platform support). `npm install` pulls in `@qvac/sdk`; `npm start` loads the `LLAMA_3_2_1B_INST_Q4_0` model on first run, which can take a moment.

## License

MIT
