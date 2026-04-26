const DIMENSIONS = 64;

const MOOD_DIMENSIONS: Record<string, number> = {
  happy: 0,
  neutral: 1,
  sad: 2,
  anxious: 3,
};

const TOKEN_ALIASES: Record<string, string> = {
  amazing: "happy",
  anxious: "anxious",
  anxiety: "anxious",
  bad: "sad",
  calm: "neutral",
  delighted: "happy",
  depressed: "sad",
  exciting: "happy",
  excited: "happy",
  fun: "happy",
  glad: "happy",
  good: "happy",
  great: "happy",
  grief: "sad",
  happy: "happy",
  joyful: "happy",
  joy: "happy",
  low: "sad",
  miserable: "sad",
  nervous: "anxious",
  neutral: "neutral",
  okay: "neutral",
  ok: "neutral",
  overwhelmed: "anxious",
  panic: "anxious",
  peaceful: "neutral",
  pressure: "anxious",
  sad: "sad",
  scared: "anxious",
  stress: "anxious",
  stressed: "anxious",
  stressful: "anxious",
  tense: "anxious",
  unhappy: "sad",
  upset: "sad",
  worried: "anxious",
  worry: "anxious",
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "day",
  "days",
  "felt",
  "for",
  "i",
  "in",
  "memory",
  "memories",
  "mood",
  "my",
  "of",
  "on",
  "the",
  "times",
  "to",
  "today",
  "was",
  "with",
]);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => TOKEN_ALIASES[token] || token)
    .filter((token) => !STOP_WORDS.has(token));

const hashToken = (token: string) => {
  let hash = 0;

  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  }

  return 4 + (hash % (DIMENSIONS - 4));
};

const normalize = (vector: number[]) => {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

  if (!magnitude) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
};

export const buildEmbeddingText = (textEntry = "", mood = "") => `${textEntry} Mood: ${mood}`.trim();

export const generateEmbedding = async (text: string): Promise<number[]> => {
  const vector = Array.from({ length: DIMENSIONS }, () => 0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    const moodDimension = MOOD_DIMENSIONS[token];

    if (moodDimension !== undefined) {
      vector[moodDimension] += 3;
    }

    vector[hashToken(token)] += 1;
  }

  return normalize(vector);
};
