"use client";

import { useRef, useState } from "react";
import { emotions, copy } from "@/config/content";
import type { Recommendation } from "@/lib/types";
import ResultCard from "./components/ResultCard";

type View = "home" | "loading" | "results";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [activeEmotion, setActiveEmotion] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // The emotion + text actually used for the current results, so per-card
  // calls ("not for me", "tell me more") carry the right context.
  const [submitted, setSubmitted] = useState<{
    emotion: string | null;
    text: string;
  }>({ emotion: null, text: "" });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  function toggleEmotion(id: string) {
    setNotice(null);
    setActiveEmotion((cur) => (cur === id ? null : id));
  }

  function choosePrompt(prompt: string) {
    setText(prompt);
    // Let the reveal settle, then focus so they can tweak it.
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  async function submit() {
    if (!activeEmotion && !text.trim()) {
      setNotice(copy.emptyInputMessage);
      return;
    }
    setNotice(null);
    setView("loading");
    const payload = { emotion: activeEmotion, text: text.trim() };
    setSubmitted(payload);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecs(data.recommendations ?? []);
      setView("results");
    } catch {
      setNotice(copy.errorMessage);
      setView("home");
    }
  }

  function replaceRec(id: string, replacement: Recommendation) {
    setRecs((cur) => cur.map((r) => (r.id === id ? replacement : r)));
  }

  function startOver() {
    setView("home");
    setRecs([]);
    setActiveEmotion(null);
    setText("");
    setNotice(null);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  if (view === "results") {
    return (
      <main className="page">
        <div className="results-head">
          <h2 className="results-title">Three for you</h2>
          <button className="startover" onClick={startOver}>
            {copy.startOverLabel}
          </button>
        </div>
        <div className="cards">
          {recs.map((rec) => (
            <ResultCard
              key={rec.id}
              rec={rec}
              emotion={submitted.emotion}
              text={submitted.text}
              others={recs
                .filter((r) => r.id !== rec.id)
                .map((r) => ({ title: r.title, author: r.author }))}
              onReplace={replaceRec}
            />
          ))}
        </div>
      </main>
    );
  }

  const loading = view === "loading";

  return (
    <main className="page">
      <h1 className="wordmark">{copy.appName}</h1>
      <p className="subcopy">{copy.subCopy}</p>

      <div className="emotions">
        {emotions.map((e) => (
          <button
            key={e.id}
            className="chip"
            aria-pressed={activeEmotion === e.id}
            onClick={() => toggleEmotion(e.id)}
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Prompts reveal for the active emotion. Always rendered so the
          height transition is smooth; toggled open via class. */}
      {emotions.map((e) => (
        <div
          key={e.id}
          className={`prompts${activeEmotion === e.id ? " open" : ""}`}
          aria-hidden={activeEmotion !== e.id}
        >
          {e.prompts.map((p) => (
            <button
              key={p}
              className="prompt"
              tabIndex={activeEmotion === e.id ? 0 : -1}
              onClick={() => choosePrompt(p)}
            >
              {p}
            </button>
          ))}
        </div>
      ))}

      <button className="tell-link" onClick={focusInput}>
        {copy.orTellMeYourself}
      </button>

      <div className="input-row">
        <textarea
          ref={inputRef}
          className="input"
          rows={1}
          placeholder={copy.inputPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onInputKeyDown}
        />
        <button className="submit" onClick={submit} disabled={loading}>
          {loading ? copy.loadingLabel : copy.submitLabel}
        </button>
      </div>

      {notice && <p className="notice">{notice}</p>}
    </main>
  );
}
