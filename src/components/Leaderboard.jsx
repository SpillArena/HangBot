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

const MEDAL_BY_RANK_DARK = {
  0: 'border-amber-300/60 bg-amber-300/20 text-amber-100',
  1: 'border-slate-300/60 bg-slate-300/20 text-slate-100',
  2: 'border-orange-400/60 bg-orange-400/20 text-orange-100',
}

const MEDAL_BY_RANK_LIGHT = {
  0: 'border-amber-400/70 bg-amber-100 text-amber-900',
  1: 'border-slate-400/70 bg-slate-100 text-slate-800',
  2: 'border-orange-400/70 bg-orange-100 text-orange-900',
}

export default function Leaderboard({
  entries,
  isDeveloperMode = false,
  onDeleteEntry,
  theme = 'dark',
}) {
  const { i18n, t } = useTranslation()
  const language = i18n.language.startsWith('no') ? 'no' : 'en'
  const isLightTheme = theme === 'light'
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [outcomeFilter, setOutcomeFilter] = useState('all')

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const difficultyMatches =
        difficultyFilter === 'all' || entry.difficulty === difficultyFilter
      const outcomeMatches =
        outcomeFilter === 'all' || entry.outcome === outcomeFilter

      return difficultyMatches && outcomeMatches
    })
  }, [entries, difficultyFilter, outcomeFilter])

  const hasEntries = entries.length > 0

  const sectionClass = isLightTheme
    ? 'rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-xl shadow-slate-300/25 sm:p-5'
    : 'rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-xl shadow-black/20 sm:p-5'

  const selectClass = isLightTheme
    ? 'w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none'
    : 'w-full min-w-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none'

  const emptyStateClass = isLightTheme
    ? 'rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600'
    : 'rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-sm text-slate-400'

  const mobileCardClass = isLightTheme
    ? 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm'
    : 'rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm'
  const medalByRank = isLightTheme ? MEDAL_BY_RANK_LIGHT : MEDAL_BY_RANK_DARK

  const getDifficultyLabel = (difficulty) =>
    t(DIFFICULTY_CONFIG[difficulty]?.labelKey ?? `difficulty.${difficulty}.label`, {
      defaultValue: difficulty,
    })

  return (
    <section className={sectionClass}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className={`text-lg font-semibold tracking-wide ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}
        >
          {t('leaderboard.title')}
        </h2>

        {isDeveloperMode && (
          <span className="w-fit rounded-lg border border-amber-400/35 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
            {t('leaderboard.developerMode')}
          </span>
        )}
      </div>

      {hasEntries && (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className={selectClass}
          >
            <option value="all">{t('leaderboard.allDifficulties')}</option>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {t(config.labelKey)}
              </option>
            ))}
          </select>

          <select
            value={outcomeFilter}
            onChange={(event) => setOutcomeFilter(event.target.value)}
            className={selectClass}
          >
            <option value="all">{t('leaderboard.allOutcomes')}</option>
            <option value="won">{t('leaderboard.wins')}</option>
            <option value="lost">{t('leaderboard.losses')}</option>
          </select>
        </div>
      )}

      {!hasEntries && <p className={emptyStateClass}>{t('leaderboard.noRounds')}</p>}

      {hasEntries && filteredEntries.length === 0 && (
        <p className={emptyStateClass}>{t('leaderboard.noMatches')}</p>
      )}

      {hasEntries && filteredEntries.length > 0 && (
        <>
          <div className="space-y-3 sm:hidden">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className={mobileCardClass}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          'inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                          medalByRank[index] ??
                            (isLightTheme
                              ? 'border-slate-300 bg-slate-100 text-slate-700'
                              : 'border-slate-700 bg-slate-900 text-slate-300'),
                        ].join(' ')}
                      >
                        #{index + 1}
                      </span>
                    </div>

                    <p
                      className={`mt-2 truncate font-semibold ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}
                    >
                      {entry.username}
                    </p>
                  </div>

                  {isDeveloperMode && (
                    <button
                      type="button"
                      aria-label={`${t('leaderboard.deleteLabel')} ${entry.username}`}
                      onClick={() => onDeleteEntry?.(entry.id)}
                      className="shrink-0 rounded border border-rose-500/60 bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-100"
                    >
                      X
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className={isLightTheme ? 'text-slate-500' : 'text-slate-400'}>
                      {t('leaderboard.result')}
                    </p>
                    <p
                      className={
                        entry.outcome === 'won'
                          ? 'font-medium text-emerald-500'
                          : 'font-medium text-rose-500'
                      }
                    >
                      {entry.outcome === 'won' ? t('leaderboard.win') : t('leaderboard.loss')}
                    </p>
                  </div>

                  <div>
                    <p className={isLightTheme ? 'text-slate-500' : 'text-slate-400'}>
                      {t('leaderboard.score')}
                    </p>
                    <p className={`font-semibold ${isLightTheme ? 'text-cyan-700' : 'text-cyan-300'}`}>
                      {entry.score}
                    </p>
                  </div>

                  <div>
                    <p className={isLightTheme ? 'text-slate-500' : 'text-slate-400'}>
                      {t('leaderboard.difficulty')}
                    </p>
                    <p className={`truncate ${isLightTheme ? 'text-slate-800' : 'text-slate-200'}`}>
                      {getDifficultyLabel(entry.difficulty)}
                    </p>
                  </div>

                  <div>
                    <p className={isLightTheme ? 'text-slate-500' : 'text-slate-400'}>
                      {t('leaderboard.mistakes')}
                    </p>
                    <p className={isLightTheme ? 'text-slate-800' : 'text-slate-200'}>
                      {entry.wrongGuesses}/{entry.maxWrongGuesses}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p
                    className={`text-xs break-words ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}
                  >
                    {formatTimestamp(entry.timestamp, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table
              className={`min-w-full table-auto divide-y text-left text-sm ${isLightTheme ? 'divide-slate-300' : 'divide-slate-800'}`}
            >
              <thead
                className={
                  isLightTheme
                    ? 'text-xs uppercase tracking-wide text-slate-600'
                    : 'text-xs uppercase tracking-wide text-slate-400'
                }
              >
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

              <tbody
                className={
                  isLightTheme
                    ? 'divide-y divide-slate-200 text-slate-800'
                    : 'divide-y divide-slate-900 text-slate-200'
                }
              >
                {filteredEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={isLightTheme ? 'transition hover:bg-slate-100/80' : 'transition hover:bg-slate-900/60'}
                  >
                    <td className={`px-2 py-2 font-semibold ${isLightTheme ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span
                        className={[
                          'inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5',
                          medalByRank[index] ??
                            (isLightTheme
                              ? 'border-slate-300 bg-slate-100 text-slate-700'
                              : 'border-slate-700 bg-slate-900 text-slate-300'),
                        ].join(' ')}
                      >
                        #{index + 1}
                      </span>
                    </td>

                    <td className="max-w-[140px] truncate px-2 py-2 md:max-w-[180px]">
                      {entry.username}
                    </td>

                    <td className="px-2 py-2">
                      <span className={entry.outcome === 'won' ? 'text-emerald-500' : 'text-rose-500'}>
                        {entry.outcome === 'won' ? t('leaderboard.win') : t('leaderboard.loss')}
                      </span>
                    </td>

                    <td className="px-2 py-2">{getDifficultyLabel(entry.difficulty)}</td>

                    <td className={`px-2 py-2 font-semibold ${isLightTheme ? 'text-cyan-700' : 'text-cyan-300'}`}>
                      {entry.score}
                    </td>

                    <td className="px-2 py-2">
                      {entry.wrongGuesses}/{entry.maxWrongGuesses}
                    </td>

                    <td className={`max-w-[160px] break-words px-2 py-2 text-xs ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>
                      {formatTimestamp(entry.timestamp, language)}
                    </td>

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
        </>
      )}
    </section>
  )
}