export type GeminiPayload = {
  systemInstruction: string;
  contents: Array<{
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }>;
};

export async function countTokens(
  apiKey: string,
  model: string,
  payload: GeminiPayload
) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:countTokens?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: payload.systemInstruction }] },
          contents: payload.contents,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) return 0;
    return Number(data.totalTokens || 0);
  } catch {
    return 0;
  }
}

export async function generateContent(
  apiKey: string,
  model: string,
  payload: GeminiPayload,
  mode: "normal" | "eco"
) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: payload.systemInstruction }] },
        contents: payload.contents,
        generationConfig: {
          temperature: mode === "eco" ? 0.45 : 0.75,
          maxOutputTokens: mode === "eco" ? 280 : 700,
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  return data;
}
