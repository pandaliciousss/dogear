import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODEL, systemBlocks } from "@/lib/anthropic";
import { moreMessage } from "@/lib/userMessages";
import type { MoreRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { title, author, emotion, text } = (await req.json()) as MoreRequest;

    if (!title) {
      return NextResponse.json({ error: "No book given." }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: await systemBlocks(),
      messages: [
        {
          role: "user",
          content: moreMessage(title, author ?? "", emotion, text ?? ""),
        },
      ],
    });

    const detail = response.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    return NextResponse.json({ detail });
  } catch (err) {
    console.error("[/api/more]", err);
    return NextResponse.json(
      { error: "Something went wrong reaching the shelves." },
      { status: 500 }
    );
  }
}
