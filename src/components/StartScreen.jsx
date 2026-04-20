import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'
import Leaderboard from './Leaderboard'

export default function StartScreen({
  defaultUsername,
  isDeveloperMode,
  leaderboard,
  lastResult,
  onDeleteLeaderboardEntry,
  onStart,
  onToggleTheme,
  theme,
}) {
  const { i18n, t } = useTranslation()
  const language = i18n.language.startsWith('no') ? 'no' : 'en'
  const isLightTheme = theme === 'light'
  const panelClassName = isLightTheme
    ? 'rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-xl shadow-slate-300/25'
    : 'rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 shadow-xl shadow-black/20'
  const inputClassName = isLightTheme
    ? 'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none'
    : 'w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none'
  const mutedTextClassName = isLightTheme ? 'text-slate-700' : 'text-slate-300'
  const subtleTextClassName = isLightTheme ? 'text-slate-600' : 'text-slate-400'
  const [username, setUsername] = useState(defaultUsername)
  const [difficulty, setDifficulty] = useState('medium')
  const [error, setError] = useState('')
  const bestEntry = useMemo(() => leaderboard[0] ?? null, [leaderboard])

  const handleStart = (event) => {
    event.preventDefault()
    const trimmed = username.trim()

    if (trimmed.length < 2) {
      setError(t('start.usernameError'))
      return
    }

    setError('')
    onStart(trimmed, difficulty)
  }

  const handleToggleLanguage = () => {
    i18n.changeLanguage(language === 'en' ? 'no' : 'en')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className={isLightTheme ? 'rounded-2xl border border-cyan-300/45 bg-white/80 p-6 shadow-xl shadow-slate-300/25' : 'rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-xl shadow-black/20'}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="mb-2 text-3xl font-bold uppercase tracking-[0.2em] text-cyan-300 md:text-4xl">HangBot</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={isLightTheme
                ? 'inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700'
                : 'inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-100'}
              aria-label={t('start.themeLabel')}
              title={`${t('start.themeLabel')}: ${isLightTheme ? t('start.light') : t('start.dark')}`}
            >
              <span aria-hidden="true">{isLightTheme ? '☀' : '🌙'}</span>
              <span>{isLightTheme ? t('start.light') : t('start.dark')}</span>
            </button>
            <button
              type="button"
              onClick={handleToggleLanguage}
              className={isLightTheme
                ? 'inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800 transition hover:border-cyan-500 hover:text-cyan-700'
                : 'inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-100'}
              aria-label={t('start.languageLabel')}
              title={`${t('start.languageLabel')}: ${language === 'en' ? t('start.english') : t('start.norwegian')}`}
            >
              <span aria-hidden="true">🌐</span>
              <span>{language === 'en' ? 'EN' : 'NO'}</span>
            </button>
          </div>
        </div>
        <p className={`mt-3 max-w-3xl text-sm md:text-base ${mutedTextClassName}`}>
          {t('start.appDescription')}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <section className={panelClassName}>
          <h2 className={`text-lg font-semibold ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>{t('start.startRound')}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleStart}>
            <div className="space-y-2">
              <label htmlFor="username" className={`text-sm ${mutedTextClassName}`}>{t('start.username')}</label>
              <input
                id="username"
                type="text"
                value={username}
                maxLength={24}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. emil"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="difficulty" className={`text-sm ${mutedTextClassName}`}>{t('start.difficulty')}</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className={inputClassName}
              >
                {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {t(`difficulty.${key}.label`, { defaultValue: config.label })} — {t(`difficulty.${key}.description`, { defaultValue: config.description })}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-cyan-300"
            >
              {t('start.launch')}
            </button>
          </form>

          <div className={`mt-5 space-y-3 text-sm ${mutedTextClassName}`}>
            <p>{t('start.botBehavior')}</p>
            <ul className={`space-y-2 text-xs ${subtleTextClassName}`}>
              <li>{t('start.bulletOne')}</li>
              <li>{t('start.bulletTwo')}</li>
              <li>{t('start.bulletThree')}</li>
            </ul>
          </div>

          {bestEntry && (
            <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {t('start.topScore')} <span className="font-semibold">{bestEntry.score}</span> {t('start.by')} <span className="font-semibold">{bestEntry.username}</span>
            </div>
          )}

          {lastResult && (
            <div className={isLightTheme ? 'mt-3 rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-700' : 'mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-300'}>
              {t('start.lastRound')} {lastResult.outcome === 'won' ? t('start.win') : t('start.loss')} • {lastResult.score} pts • {lastResult.wordLength} {t('start.letters')}
            </div>
          )}
        </section>

        <Leaderboard
          entries={leaderboard}
          isDeveloperMode={isDeveloperMode}
          onDeleteEntry={onDeleteLeaderboardEntry}
          theme={theme}
        />
      </div>
    </main>
  )
}

