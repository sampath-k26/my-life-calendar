export type MoodKey = "happy" | "neutral" | "sad" | "anxious";

type MoodDisplay = {
  emoji: string;
  label: string;
};

const MOOD_DISPLAY: Record<MoodKey, MoodDisplay> = {
  happy: { emoji: "😊", label: "Happy" },
  neutral: { emoji: "😌", label: "Neutral" },
  sad: { emoji: "😢", label: "Sad" },
  anxious: { emoji: "😟", label: "Anxious" },
};

const LEGACY_MOOD_MAP: Record<string, MoodKey> = {
  "😊": "happy",
  "😢": "sad",
  "🤩": "happy",
  "😌": "neutral",
  "😴": "neutral",
};

export const normalizeMood = (mood = ""): MoodKey | "" => {
  const trimmedMood = mood.trim().toLowerCase();

  if (trimmedMood in MOOD_DISPLAY) {
    return trimmedMood as MoodKey;
  }

  return LEGACY_MOOD_MAP[mood] || "";
};

export const getMoodDisplay = (mood = "") => {
  const normalizedMood = normalizeMood(mood);

  if (!normalizedMood) {
    return { emoji: "📝", label: "Memory" };
  }

  return MOOD_DISPLAY[normalizedMood];
};

export const getMoodCalendarClass = (mood = "") => {
  const normalizedMood = normalizeMood(mood);

  switch (normalizedMood) {
    case "happy":
      return "bg-green-200/70 dark:bg-green-900/40";
    case "neutral":
      return "bg-yellow-200/70 dark:bg-yellow-900/40";
    case "sad":
      return "bg-blue-200/70 dark:bg-blue-900/40";
    case "anxious":
      return "bg-red-200/70 dark:bg-red-900/40";
    default:
      return "";
  }
};
