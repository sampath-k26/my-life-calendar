import vader from "vader-sentiment";

export type DetectedMood = "happy" | "neutral" | "sad" | "anxious";

const ANXIOUS_KEYWORDS = [
  "anxiety",
  "anxious",
  "overwhelmed",
  "panic",
  "panicked",
  "pressure",
  "stressed",
  "stressful",
  "stress",
  "tense",
  "worried",
  "worry",
];

export const detectMood = (textEntry: string): DetectedMood => {
  const text = textEntry.trim();

  if (!text) {
    return "neutral";
  }

  const lowerText = text.toLowerCase();
  const isAnxious = ANXIOUS_KEYWORDS.some((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(lowerText));

  if (isAnxious) {
    return "anxious";
  }

  const score = vader.SentimentIntensityAnalyzer.polarity_scores(text).compound;

  if (score > 0.3) {
    return "happy";
  }

  if (score < -0.3) {
    return "sad";
  }

  return "neutral";
};
