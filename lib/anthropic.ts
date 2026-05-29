import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "fs";
import path from "path";

/**
 * The Claude model Dogear uses. This is the one place to change it.
 *
 * claude-opus-4-8 is the most capable current model — best for taste-heavy,
 * judgment-heavy recommendations. If you ever want it cheaper/faster and are
 * happy to trade a little nuance, swap this to "claude-sonnet-4-6".
 */
export const MODEL = "claude-opus-4-8";

/** Single shared client. Reads ANTHROPIC_API_KEY from the environment. */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Reads the editable system prompt from prompts/dogear.md.
 *
 * It's read fresh from disk (and cached in-process per warm instance) rather
 * than imported, so the file stays plain markdown you can edit on GitHub
 * mobile. next.config.js makes sure the file ships with the serverless
 * function on Vercel.
 */
let cachedSystemPrompt: string | null = null;
export async function getSystemPrompt(): Promise<string> {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  const filePath = path.join(process.cwd(), "prompts", "dogear.md");
  cachedSystemPrompt = await fs.readFile(filePath, "utf-8");
  return cachedSystemPrompt;
}

/**
 * Builds the system field with prompt caching turned on. The system prompt is
 * identical across every request, so caching it means we don't pay to
 * re-process it each time — cheaper and a touch faster.
 */
export async function systemBlocks(): Promise<Anthropic.TextBlockParam[]> {
  const prompt = await getSystemPrompt();
  return [
    {
      type: "text",
      text: prompt,
      cache_control: { type: "ephemeral" },
    },
  ];
}

/**
 * Pulls the first JSON value out of a model response. Claude is asked to
 * return JSON, but we stay tolerant of stray prose or ```json fences around it.
 */
export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;

  // Try a straight parse first.
  try {
    return JSON.parse(candidate.trim()) as T;
  } catch {
    // Otherwise grab the first balanced array or object.
    const start = candidate.search(/[[{]/);
    if (start !== -1) {
      const open = candidate[start];
      const close = open === "[" ? "]" : "}";
      const end = candidate.lastIndexOf(close);
      if (end > start) {
        return JSON.parse(candidate.slice(start, end + 1)) as T;
      }
    }
    throw new Error("Could not parse JSON from model response.");
  }
}
