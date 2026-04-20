import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'

const formatTimestamp = (isoDate, language) => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }
  return date.toLocaleString(language === 'no' ? 'nb-NO' : 'en-US')
}

const MEDAL_BY_RANK = {
  0: 'border-amber-300/60 bg-amber-300/20 text-amber-100',
  1: 'border-slate-300/60 bg-slate-300/20 text-slate-100',
  2: 'border-orange-400/60 bg-orange-400/20 text-orange-100',
}

export default function Leaderboard({ entries, isDeveloperMode = false, onDeleteEntry, theme = 'dark' }) {
  const { i18n, t } = useTranslation()
  const language = i18n.language.startsWith('no') ? 'no' : 'en'
  const isLightTheme = theme === 'light'
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
    <section className={isLightTheme ? 'rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-xl shadow-slate-300/25' : 'rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-black/20'}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-lg font-semibold tracking-wide ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{t('leaderboard.title')}</h2>
        {isDeveloperMode && (
          <span className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
            {t('leaderboard.developerMode')}
          </span>
        )}
      </div>

      {hasEntries && (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className={isLightTheme ? 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none' : 'rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none'}
          >
            <option value="all">{t('leaderboard.allDifficulties')}</option>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {t(`difficulty.${key}.label`, { defaultValue: config.label })}
              </option>
            ))}
          </select>

          <select
            value={outcomeFilter}
            onChange={(event) => setOutcomeFilter(event.target.value)}
            className={isLightTheme ? 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none' : 'rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none'}
          >
            <option value="all">{t('leaderboard.allOutcomes')}</option>
            <option value="won">{t('leaderboard.wins')}</option>
            <option value="lost">{t('leaderboard.losses')}</option>
          </select>
        </div>
      )}

      {!hasEntries && (
        <p className={isLightTheme ? 'rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600' : 'rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400'}>
          {t('leaderboard.noRounds')}
        </p>
      )}

      {hasEntries && filteredEntries.length === 0 && (
        <p className={isLightTheme ? 'rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600' : 'rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400'}>
          {t('leaderboard.noMatches')}
        </p>
      )}

      {hasEntries && filteredEntries.length > 0 && (
        <div className="overflow-x-auto">
          <table className={isLightTheme ? 'min-w-full divide-y divide-slate-300 text-left text-sm' : 'min-w-full divide-y divide-slate-800 text-left text-sm'}>
            <thead className={isLightTheme ? 'text-xs uppercase tracking-wide text-slate-600' : 'text-xs uppercase tracking-wide text-slate-400'}>
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">{t('leaderboard.player')}</th>
                <th className="px-2 py-2">{t('leaderboard.result')}</th>
                <th className="px-2 py-2">{t('leaderboard.difficulty')}</th>
                <th className="px-2 py-2">{t('leaderboard.score')}</th>
                <th className="px-2 py-2">{t('leaderboard.mistakes')}</th>
                <th className="px-2 py-2">{t('leaderboard.date')}</th>
                {isDeveloperMode && <th className="px-2 py-2">X</th>}
              </tr>
            </thead>
            <tbody className={isLightTheme ? 'divide-y divide-slate-200 text-slate-800' : 'divide-y divide-slate-900 text-slate-200'}>
              {filteredEntries.map((entry, index) => (
                <tr key={entry.id} className={isLightTheme ? 'transition hover:bg-slate-100/80' : 'transition hover:bg-slate-900/60'}>
                  <td className={`px-2 py-2 font-semibold ${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}>
                    <span
                      className={[
                        'inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5',
                        MEDAL_BY_RANK[index] ?? (isLightTheme ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-700 bg-slate-900 text-slate-300'),
                      ].join(' ')}
                    >
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-2 py-2">{entry.username}</td>
                  <td className="px-2 py-2">
                    <span className={entry.outcome === 'won' ? 'text-emerald-300' : 'text-rose-300'}>
                      {entry.outcome === 'won' ? t('leaderboard.win') : t('leaderboard.loss')}
                    </span>
                  </td>
                  <td className="px-2 py-2">{t(`difficulty.${entry.difficulty}.label`, { defaultValue: DIFFICULTY_CONFIG[entry.difficulty]?.label || entry.difficulty })}</td>
                  <td className={`px-2 py-2 font-semibold ${isLightTheme ? 'text-cyan-700' : 'text-cyan-300'}`}>{entry.score}</td>
                  <td className="px-2 py-2">{entry.wrongGuesses}/{entry.maxWrongGuesses}</td>
                  <td className={`px-2 py-2 text-xs ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{formatTimestamp(entry.timestamp, language)}</td>
                  {isDeveloperMode && (
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        aria-label={`${t('leaderboard.deleteLabel')} ${entry.username}`}
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

