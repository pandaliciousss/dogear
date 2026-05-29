"use client";

import { useState } from "react";
import { copy } from "@/config/content";
import type { Recommendation } from "@/lib/types";

interface Props {
  rec: Recommendation;
  /** Mood context, forwarded to the "not for me" and "tell me more" calls. */
  emotion: string | null;
  text: string;
  /** The other current books, so a replacement stays varied. */
  others: { title: string; author: string }[];
  /** Called with a fresh recommendation when the user rejects this one. */
  onReplace: (id: string, replacement: Recommendation) => void;
}

export default function ResultCard({
  rec,
  emotion,
  text,
  others,
  onReplace,
}: Props) {
  const [swapping, setSwapping] = useState(false);
  // The longer take, once fetched, is cached here so re-opening is instant.
  const [detail, setDetail] = useState<string | null>(null);
  // Whether the cached description is currently shown.
  const [expanded, setExpanded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNotForMe() {
    setSwapping(true);
    setError(null);
    try {
      const res = await fetch("/api/replace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion,
          text,
          rejected: { title: rec.title, author: rec.author },
          keep: others,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Give the replacement a brand-new id. That changes this card's React
      // key, so it remounts with clean state — clearing the "swapping" flag and
      // any open "tell me more" description from the book we just replaced.
      // (Reusing the old id kept the stale loading flag and locked both buttons.)
      onReplace(rec.id, {
        ...data.recommendation,
        id: `${rec.id}__${Date.now()}`,
      });
    } catch {
      setError(copy.errorMessage);
      setSwapping(false);
    }
  }

  async function handleTellMeMore() {
    // Already fetched once — just toggle visibility, no second API call.
    if (detail !== null) {
      setExpanded((v) => !v);
      return;
    }
    setLoadingMore(true);
    setError(null);
    try {
      const res = await fetch("/api/more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: rec.title,
          author: rec.author,
          emotion,
          text,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetail(data.detail || "");
      setExpanded(true);
    } catch {
      setError(copy.errorMessage);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <article className={`card${swapping ? " swapping" : ""}`}>
      {rec.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="cover"
          src={rec.coverUrl}
          alt={`Cover of ${rec.title}`}
          onError={(e) => {
            // If Open Library returns a broken/blank cover, fall back cleanly.
            const el = e.currentTarget;
            el.style.display = "none";
            el.insertAdjacentHTML(
              "afterend",
              `<div class="cover-placeholder">${copy.noCoverLabel}</div>`
            );
          }}
        />
      ) : (
        <div className="cover-placeholder">{copy.noCoverLabel}</div>
      )}

      <div>
        <h3 className="card-title">{rec.title}</h3>
        <p className="card-author">{rec.author}</p>
        <p className="card-pitch">{rec.pitch}</p>

        {rec.content_note && (
          <p className="content-note">{rec.content_note}</p>
        )}

        {expanded && detail && <div className="card-more">{detail}</div>}

        <div className="card-actions">
          <button
            className="action"
            onClick={handleNotForMe}
            disabled={swapping}
          >
            {swapping ? copy.loadingLabel : copy.notForMeLabel}
          </button>
          <button
            className="action"
            onClick={handleTellMeMore}
            disabled={loadingMore || swapping}
          >
            {loadingMore
              ? copy.tellMeMoreLoadingLabel
              : expanded
              ? "Hide"
              : copy.tellMeMoreLabel}
          </button>
        </div>

        {error && <p className="notice">{error}</p>}
      </div>
    </article>
  );
}
