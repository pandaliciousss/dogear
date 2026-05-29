/**
 * Builders for the *user* side of each Claude call. (Dogear's voice and rules
 * live in prompts/dogear.md; this file just frames the specific ask.)
 */
import { emotions } from "@/config/content";

/** Turns an emotion id into its human label for the model, if present. */
function emotionLabel(emotionId: string | null): string | null {
  if (!emotionId) return null;
  return emotions.find((e) => e.id === emotionId)?.label ?? emotionId;
}

/** Frames the mood for the model: the chosen emotion plus what they typed. */
function moodContext(emotion: string | null, text: string): string {
  const label = emotionLabel(emotion);
  const parts: string[] = [];
  if (label) parts.push(`They chose the mood: "${label}".`);
  if (text.trim()) parts.push(`In their words: "${text.trim()}".`);
  if (parts.length === 0) parts.push("They didn't say much — surprise them well.");
  return parts.join(" ");
}

/** The main "give me three books" message. */
export function recommendMessage(emotion: string | null, text: string): string {
  return [
    moodContext(emotion, text),
    "",
    "Recommend exactly three books for this reader, right now. Return ONLY a JSON array of three objects, each with: title, author, pitch (2-3 sentences), and content_note (optional). No prose outside the JSON.",
  ].join("\n");
}

/** The "replace this one slot" message — keeps it varied, avoids repeats. */
export function replaceMessage(
  emotion: string | null,
  text: string,
  rejected: { title: string; author: string },
  keep: { title: string; author: string }[]
): string {
  const keepList =
    keep.length > 0
      ? keep.map((b) => `"${b.title}" by ${b.author}`).join("; ")
      : "(none)";
  return [
    moodContext(emotion, text),
    "",
    `They rejected this recommendation: "${rejected.title}" by ${rejected.author}. Do NOT recommend it again, and don't recommend anything too similar to it.`,
    `They're keeping these, so pick something that complements rather than duplicates them: ${keepList}.`,
    "",
    "Recommend ONE replacement book. Return ONLY a single JSON object with: title, author, pitch (2-3 sentences), and content_note (optional). No prose outside the JSON.",
  ].join("\n");
}

/** The "tell me more" message — a longer take on one specific book. */
export function moreMessage(
  title: string,
  author: string,
  emotion: string | null,
  text: string
): string {
  return [
    moodContext(emotion, text),
    "",
    `They want to hear more about "${title}" by ${author} — the one you recommended.`,
    "Give a longer take: what reading it actually feels like, who it's for and who it isn't, and why it fits this mood. Two short paragraphs, no spoilers, no plot summary. Return plain text only — no JSON, no headings.",
  ].join("\n");
}
