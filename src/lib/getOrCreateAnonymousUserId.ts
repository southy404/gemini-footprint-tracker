export function getOrCreateAnonymousUserId() {
  const key = "gemini-footprint-anon-user-id";
  const existing = localStorage.getItem(key);

  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(key, id);
  return id;
}
