# Dogear

A mood-based book recommender. You tell it how you're feeling; it gives you three books chosen by mood, not genre.

Built with Next.js (App Router, TypeScript), deployed on Vercel, powered by the Anthropic API. Book covers come from the free Open Library API. No database, no auth.

## The two files you'll actually edit

- **`prompts/dogear.md`** — Dogear's brain. Its voice, beliefs, and rules. Edit this to change *how it thinks*. You can edit it right on GitHub from your phone; Vercel redeploys automatically.
- **`config/content.ts`** — the taste layer. The eight emotions and their prompts, the page copy, the input placeholder, button labels. Edit this to change *what the app says*.

## Local development (optional)

You don't need to run this locally, but if you want to:

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and paste your real Anthropic key.
3. `npm run dev` and open http://localhost:3000

## Environment variable

| Name                | Where it goes        | What it is                          |
| ------------------- | -------------------- | ----------------------------------- |
| `ANTHROPIC_API_KEY` | Vercel → Settings → Environment Variables | Your Anthropic API key. Never commit it. |

## Model

The Claude model is set in one place: `MODEL` in `lib/anthropic.ts`. It uses the most capable current model. To trade nuance for lower cost/latency, change it there.

## How it's wired

- `app/page.tsx` — the whole front end (landing, emotion reveal, results).
- `app/api/recommend` — three books for a mood.
- `app/api/replace` — one replacement when you tap "Not for me".
- `app/api/more` — a longer take when you tap "Tell me more".
- `lib/` — Anthropic client, Open Library covers, message builders, types.
