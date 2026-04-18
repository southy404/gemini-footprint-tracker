export type ModelKey =
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

export const MODEL_PROFILES: Record<
  ModelKey,
  { label: string; multiplier: number }
> = {
  "gemini-2.5-flash-lite": {
    label: "Gemini 2.5 Flash-Lite",
    multiplier: 0.85,
  },
  "gemini-2.5-flash": {
    label: "Gemini 2.5 Flash",
    multiplier: 1.0,
  },
  "gemini-2.5-pro": {
    label: "Gemini 2.5 Pro",
    multiplier: 1.35,
  },
};

const BASE_WATER_ML = 0.26;
const BASE_CO2_G = 0.03;

// Median Gemini prompt laut Google: ~400 Tokens gesamt
// Typisches Split: ~250 Input / ~150 Output
const REFERENCE_PROMPT_TOKENS = 250;
const REFERENCE_RESPONSE_TOKENS = 150;

// Output-Tokens kosten mehr als Input-Tokens (Autoregression vs. einmaliger Forward-Pass)
// Faktor ~3–4x ist in der Literatur gut belegt
const OUTPUT_WEIGHT = 3.5;

export function calculateFootprint({
  model,
  promptTokens,
  responseTokens,
}: {
  model: ModelKey;
  promptTokens: number;
  responseTokens: number;
}) {
  // Gewichtete Tokenanzahl
  const weightedTokens = promptTokens + responseTokens * OUTPUT_WEIGHT;

  const referenceWeighted =
    REFERENCE_PROMPT_TOKENS + REFERENCE_RESPONSE_TOKENS * OUTPUT_WEIGHT;

  // tokenScale = 1.0 bei einem typischen Gemini-Median-Prompt
  const tokenScale = Math.max(0.2, weightedTokens / referenceWeighted);

  const multiplier = MODEL_PROFILES[model].multiplier;

  return {
    water: BASE_WATER_ML * tokenScale * multiplier,
    co2: BASE_CO2_G * tokenScale * multiplier,
    tokens: promptTokens + responseTokens,
  };
}
