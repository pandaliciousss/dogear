import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, systemBlocks, extractJson } from "@/lib/anthropic";
import { fetchCoverUrl } from "@/lib/openlibrary";
import { replaceMessage } from "@/lib/userMessages";
import type { Recommendation, ReplaceRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type RawRec = Pick<Recommendation, "title" | "author" | "pitch" | "content_note">;

export async function POST(req: NextRequest) {
  try {
    const { emotion, text, rejected, keep } =
      (await req.json()) as ReplaceRequest;

    if (!rejected?.title) {
      return NextResponse.json(
        { error: "Nothing to replace." },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: await systemBlocks(),
      messages: [
        {
          role: "user",
          content: replaceMessage(emotion, text ?? "", rejected, keep ?? []),
        },
      ],
    });

    const textOut = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");

    const raw = extractJson<RawRec>(textOut);
    if (!raw?.title) {
      throw new Error("Model did not return a replacement book.");
    }

    const recommendation: Recommendation = {
      // Keep the slot id so the UI swaps this card in place; the client
      // overrides it with the slot it's replacing.
      id: "rec-replacement",
      title: raw.title,
      author: raw.author,
      pitch: raw.pitch,
      content_note: raw.content_note,
      coverUrl: await fetchCoverUrl(raw.title, raw.author),
    };

    return NextResponse.json({ recommendation });
  } catch (err) {
    console.error("[/api/replace]", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the shelves." },
      { status: 500 }
    );
  }
}
