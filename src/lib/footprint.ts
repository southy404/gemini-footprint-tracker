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

const REFERENCE_TOKENS = 400;

export function calculateFootprint({
  model,
  promptTokens,
  responseTokens,
}: {
  model: ModelKey;
  promptTokens: number;
  responseTokens: number;
}) {
  const totalTokens = promptTokens + responseTokens;

  const tokenScale = Math.max(0.35, totalTokens / REFERENCE_TOKENS);

  const modelMultiplier = MODEL_PROFILES[model].multiplier;

  const water = BASE_WATER_ML * tokenScale * modelMultiplier;
  const co2 = BASE_CO2_G * tokenScale * modelMultiplier;

  return {
    water,
    co2,
    tokens: totalTokens,
  };
}
