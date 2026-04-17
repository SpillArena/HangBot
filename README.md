# HangBot
HangBot is a React + Vite + Tailwind hangman game inspired by FleetBot's flow.
You enter a username, choose difficulty, and play against bot-generated mystery words.
Results are persisted to a local leaderboard.

## Stack
- React 19
- Vite 7
- Tailwind CSS
- ESLint

## Local development
1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Build production bundle:
   `npm run build`

## Cloudflare Pages + D1 (leaderboard backend)
The app includes a Pages Function at `/api/leaderboard` that writes to a D1 database.

Required setup in Cloudflare Pages project:
1. Go to **Settings -> Functions -> D1 bindings**.
2. Add a D1 binding with variable name `DB` (recommended) or `LEADERBOARD_DB`.
3. Select your D1 database.
4. Redeploy the project.

If the binding is missing, frontend falls back to localStorage and logs a warning in browser console.

## Features
- Username prompt and remembered player name.
- Difficulty modes with different guess limits and score multipliers.
- Bot-generated word rounds (including synthetic codenames in harder modes).
- Hint and category reveal per round.
- Persistent leaderboard with difficulty and outcome filters.
