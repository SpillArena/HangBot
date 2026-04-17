import { useMemo, useState } from 'react'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'

const formatTimestamp = (isoDate) => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }
  return date.toLocaleString('nb-NO')
}

export default function Leaderboard({ entries, isDeveloperMode = false, onDeleteEntry }) {
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const difficultyMatches = difficultyFilter === 'all' || entry.difficulty === difficultyFilter
      const outcomeMatches = outcomeFilter === 'all' || entry.outcome === outcomeFilter
      return difficultyMatches && outcomeMatches
    })
  }, [entries, difficultyFilter, outcomeFilter])

  const hasEntries = entries.length > 0

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-slate-100">Leaderboard</h2>
        {isDeveloperMode && (
          <span className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
            Developer mode
          </span>
        )}
      </div>

      {hasEntries && (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All difficulties</option>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <select
            value={outcomeFilter}
            onChange={(event) => setOutcomeFilter(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
          >
            <option value="all">All outcomes</option>
            <option value="won">Wins</option>
            <option value="lost">Losses</option>
          </select>
        </div>
      )}

      {!hasEntries && (
        <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400">
          No rounds saved yet. Start a game and your results will appear here.
        </p>
      )}

      {hasEntries && filteredEntries.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400">
          No entries match the selected filters.
        </p>
      )}

      {hasEntries && filteredEntries.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Player</th>
                <th className="px-2 py-2">Result</th>
                <th className="px-2 py-2">Difficulty</th>
                <th className="px-2 py-2">Score</th>
                <th className="px-2 py-2">Mistakes</th>
                <th className="px-2 py-2">Date</th>
                {isDeveloperMode && <th className="px-2 py-2">X</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id} className="transition hover:bg-slate-900/60">
                  <td className="px-2 py-2 font-semibold text-slate-300">#{index + 1}</td>
                  <td className="px-2 py-2">{entry.username}</td>
                  <td className="px-2 py-2">
                    <span className={entry.outcome === 'won' ? 'text-emerald-300' : 'text-rose-300'}>
                      {entry.outcome === 'won' ? 'Win' : 'Loss'}
                    </span>
                  </td>
                  <td className="px-2 py-2">{DIFFICULTY_CONFIG[entry.difficulty]?.label || entry.difficulty}</td>
                  <td className="px-2 py-2 font-semibold text-cyan-300">{entry.score}</td>
                  <td className="px-2 py-2">{entry.wrongGuesses}/{entry.maxWrongGuesses}</td>
                  <td className="px-2 py-2 text-xs text-slate-400">{formatTimestamp(entry.timestamp)}</td>
                  {isDeveloperMode && (
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        aria-label={`Delete leaderboard entry for ${entry.username}`}
                        onClick={() => onDeleteEntry?.(entry.id)}
                        className="rounded border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-100"
                      >
                        X
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

