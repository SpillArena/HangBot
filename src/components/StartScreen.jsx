import { useMemo, useState } from 'react'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'
import Leaderboard from './Leaderboard'

export default function StartScreen({
  defaultUsername,
  isDeveloperMode,
  leaderboard,
  lastResult,
  onDeleteLeaderboardEntry,
  onStart,
}) {
  const [username, setUsername] = useState(defaultUsername)
  const [difficulty, setDifficulty] = useState('medium')
  const [error, setError] = useState('')
  const bestEntry = useMemo(() => leaderboard[0] ?? null, [leaderboard])

  const handleStart = (event) => {
    event.preventDefault()
    const trimmed = username.trim()

    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters long.')
      return
    }

    setError('')
    onStart(trimmed, difficulty)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-xl shadow-black/20">
        <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.2em] text-cyan-300 md:text-4xl">HangBot</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
          Enter your username, pick difficulty, and challenge the bot’s mystery words. Results are persisted in the local leaderboard.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <section className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-slate-100">Start a round</h2>
          <form className="mt-4 space-y-4" onSubmit={handleStart}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-slate-300">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                maxLength={24}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. emil"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm text-slate-300">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} — {config.description}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-cyan-300"
            >
              Launch HangBot Round
            </button>
          </form>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>Bot behavior:</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• HangBot picks a hidden word and reveals a hint + category.</li>
              <li>• Every round uses real dictionary words only.</li>
              <li>• Score rewards wins, few mistakes, and higher difficulty.</li>
            </ul>
          </div>

          {bestEntry && (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              Top score: <span className="font-semibold">{bestEntry.score}</span> by <span className="font-semibold">{bestEntry.username}</span>
            </div>
          )}

          {lastResult && (
            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300">
              Last round: {lastResult.outcome === 'won' ? 'Win' : 'Loss'} • {lastResult.score} pts • {lastResult.wordLength} letters
            </div>
          )}
        </section>

        <Leaderboard
          entries={leaderboard}
          isDeveloperMode={isDeveloperMode}
          onDeleteEntry={onDeleteLeaderboardEntry}
        />
      </div>
    </main>
  )
}

