import { apiRequest } from "@/lib/api";

export interface ContextualSearchResult {
  memoryId: string;
  date: string;
  textEntry: string;
  mood: string;
  score: number;
}

export const contextualSearchApi = (query: string, limit = 10) =>
  apiRequest<ContextualSearchResult[]>("/api/contextual-search", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  });
