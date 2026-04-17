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

## Features
- Username prompt and remembered player name.
- Difficulty modes with different guess limits and score multipliers.
- Bot-generated word rounds (including synthetic codenames in harder modes).
- Hint and category reveal per round.
- Persistent leaderboard with difficulty and outcome filters.
