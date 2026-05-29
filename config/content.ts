/**
 * Dogear — taste layer.
 *
 * Everything in this file is content you might want to tweak based on taste:
 * the eight emotions and their prompts, the page sub-copy, the input
 * placeholder, button labels, and error/empty messages.
 *
 * If you want to change *what the app says*, change it here. The components
 * read from this file — there is no user-facing copy hard-coded in them.
 *
 * (To change *how Dogear thinks* — its voice, its rules — edit the system
 * prompt at prompts/dogear.md instead.)
 */

export interface Emotion {
  /** Stable key used internally and sent to the API. */
  id: string;
  /** The label shown on the chip. */
  label: string;
  /** The three one-tap prompts revealed beneath this emotion. */
  prompts: string[];
}

export const emotions: Emotion[] = [
  {
    id: "heartbroken",
    label: "Heartbroken",
    prompts: [
      "Something that understands what I've lost",
      "A book to cry with, not cheer me up",
      "Show me someone who made it through this",
    ],
  },
  {
    id: "restless",
    label: "Restless",
    prompts: [
      "Something fast that doesn't let go",
      "Shake me out of this rut",
      "I can't sit still — grab me by the collar",
    ],
  },
  {
    id: "numb",
    label: "Numb",
    prompts: [
      "Make me feel something again",
      "Something that cuts through the fog",
      "I want to be wrecked, just to feel it",
    ],
  },
  {
    id: "cozy",
    label: "Cozy",
    prompts: [
      "A book like a warm room on a cold night",
      "Comfort, low stakes, nothing scary",
      "Somewhere I'd want to stay a while",
    ],
  },
  {
    id: "wired",
    label: "Wired",
    prompts: [
      "A twist I won't see coming",
      "Keep me up way too late",
      "Tension I can't put down",
    ],
  },
  {
    id: "adrift",
    label: "Adrift",
    prompts: [
      "I don't know what I want — surprise me",
      "Something to make sense of the drift",
      "Pull me somewhere, anywhere",
    ],
  },
  {
    id: "curious",
    label: "Curious",
    prompts: [
      "Teach me something without it feeling like work",
      "Something completely outside my usual",
      "A world I've never been to",
    ],
  },
  {
    id: "raw",
    label: "Raw",
    prompts: [
      "Something dark that doesn't flinch",
      "No false comfort — just the truth",
      "Go to the hard place with me",
    ],
  },
];

/** Page sub-copy and other small bits of UI text. */
export const copy = {
  /** App name, shown in the serif wordmark. */
  appName: "Dogear",
  /** The one quiet line under the name. */
  subCopy: "Tell me what you're in the mood for.",
  /** The small link that focuses the free-text input. */
  orTellMeYourself: "or tell me yourself",
  /** Placeholder inside the free-text input. */
  inputPlaceholder: "Say it however you want…",
  /** Submit button label. */
  submitLabel: "Find me a book",
  /** Label while the API is working. */
  loadingLabel: "Reading the shelves…",
  /** Per-card button labels. */
  notForMeLabel: "Not for me",
  tellMeMoreLabel: "Tell me more",
  /** Shown on the "tell me more" button while that call is in flight. */
  tellMeMoreLoadingLabel: "Thinking…",
  /** Link to start over from the results view. */
  startOverLabel: "Start over",
  /** Generic error message shown if a request fails. */
  errorMessage: "Something went wrong reaching the shelves. Try again.",
  /** Shown if the user submits with nothing typed and no emotion chosen. */
  emptyInputMessage: "Pick a mood or tell me what you're after first.",
  /** Alt text / placeholder caption when no cover image is found. */
  noCoverLabel: "No cover",
};
