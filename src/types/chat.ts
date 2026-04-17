export type ChatRole = "user" | "assistant";

export type ChatItem = {
  id: string;
  role: ChatRole;
  content: string;
  isLoading?: boolean;
};

export type LastUsage = {
  model: string;
  prompt: number;
  response: number;
};

export type SessionEntry = {
  id: string;
  water: number;
  co2: number;
  prompt: string;
};
