import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, systemBlocks, extractJson } from "@/lib/anthropic";
import { attachCovers } from "@/lib/openlibrary";
import { recommendMessage } from "@/lib/userMessages";
import type { Recommendation, RecommendRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

/** What the model returns per book, before we add id + cover. */
type RawRec = Pick<Recommendation, "title" | "author" | "pitch" | "content_note">;

export async function POST(req: NextRequest) {
  try {
    const { emotion, text } = (await req.json()) as RecommendRequest;

    if (!emotion && !text?.trim()) {
      return NextResponse.json(
        { error: "Pick a mood or tell me what you're after first." },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: await systemBlocks(),
      messages: [
        { role: "user", content: recommendMessage(emotion, text ?? "") },
      ],
    });

    const textOut = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");

    const raw = extractJson<RawRec[]>(textOut);
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new Error("Model did not return a list of books.");
    }

    const withCovers = await attachCovers(raw.slice(0, 3));
    const recommendations: Recommendation[] = withCovers.map((b, i) => ({
      id: `rec-${i}`,
      title: b.title,
      author: b.author,
      pitch: b.pitch,
      content_note: b.content_note,
      coverUrl: b.coverUrl,
    }));

    return NextResponse.json({ recommendations });
  } catch (err) {
    console.error("[/api/recommend]", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the shelves." },
      { status: 500 }
    );
  }
}
