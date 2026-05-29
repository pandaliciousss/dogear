/**
 * Shared types for Dogear.
 *
 * Note on the future: post-read feedback (loved / liked / DNF / hated) is NOT
 * part of v1. But the Recommendation shape is intentionally an open object so a
 * `feedback` field can be added later without restructuring anything. The
 * `PostReadFeedback` type below is sketched out (and unused) on purpose, as a
 * marker for where that will slot in.
 */

/** What the model returns for a single book, plus what we attach to it. */
export interface Recommendation {
  /** Stable id for this slot, so the UI can replace one card cleanly. */
  id: string;
  title: string;
  author: string;
  /** 2-3 sentence reason — why this book, this mood, right now. */
  pitch: string;
  /** Optional flag for heavy themes / structural weirdness. */
  content_note?: string;
  /**
   * Open Library cover image URL, or null if none was found.
   * The UI falls back to a clean placeholder when this is null.
   */
  coverUrl?: string | null;
  /**
   * RESERVED FOR A FUTURE RELEASE — not set or read in v1.
   * Post-read feedback would live here so a recommendation can carry its own
   * fate without a separate data structure.
   */
  feedback?: PostReadFeedback;
}

/** Future: how a reader felt after (or during) reading. Unused in v1. */
export type PostReadFeedback = "loved" | "liked" | "dnf" | "hated";

/** Request body for the main recommendation call. */
export interface RecommendRequest {
  /** The chosen emotion id, or null if they only typed free text. */
  emotion: string | null;
  /** The final text in the input box (may be an edited prompt). */
  text: string;
}

/** Request body for replacing a single rejected slot. */
export interface ReplaceRequest extends RecommendRequest {
  /** The book being rejected, so we don't suggest it again. */
  rejected: { title: string; author: string };
  /** The other current books, so the replacement stays varied. */
  keep: { title: string; author: string }[];
}

/** Request body for the "tell me more" expansion. */
export interface MoreRequest {
  title: string;
  author: string;
  /** The mood context, so the longer take stays on-theme. */
  emotion: string | null;
  text: string;
}
