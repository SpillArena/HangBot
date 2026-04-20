import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HangmanGame from './components/HangmanGame'
import StartScreen from './components/StartScreen'
import {
  loadLeaderboard,
  loadLeaderboardWithFallback,
  loadRememberedUsername,
  addLeaderboardEntryWithFallback,
  removeLeaderboardEntryWithFallback,
  rememberUsername,
} from './utils/leaderboardStorage'

const ARENA_PRIMARY_URL = 'https://spillarena.no'
const ARENA_FALLBACK_URL = 'https://spillarena.pages.dev'
const THEME_STORAGE_KEY = 'hangbot.theme.v1'

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const { t } = useTranslation()
  const [screen, setScreen] = useState('start')
  const [username, setUsername] = useState(() => loadRememberedUsername())
  const [difficulty, setDifficulty] = useState('medium')
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard())
  const [lastResult, setLastResult] = useState(null)
  const [isDeveloperMode, setIsDeveloperMode] = useState(false)
  const [theme, setTheme] = useState(() => getInitialTheme())
  const [arenaUrl, setArenaUrl] = useState(ARENA_PRIMARY_URL)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 2500)

    const resolveArenaUrl = async () => {
      try {
        await fetch(ARENA_PRIMARY_URL, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        })
      } catch {
        if (!cancelled) {
          setArenaUrl(ARENA_FALLBACK_URL)
        }
      } finally {
        window.clearTimeout(timeoutId)
      }
    }

    resolveArenaUrl()

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const hydrateLeaderboard = async () => {
      const entries = await loadLeaderboardWithFallback()
      if (!cancelled) {
        setLeaderboard(entries)
      }
    }

    hydrateLeaderboard()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        setIsDeveloperMode((previousValue) => !previousValue)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleStart = useCallback((nextUsername, nextDifficulty) => {
    setUsername(nextUsername)
    setDifficulty(nextDifficulty)
    rememberUsername(nextUsername)
    setScreen('game')
  }, [])

  const handleRoundFinished = useCallback(async (entry) => {
    setLastResult(entry)
    const entries = await addLeaderboardEntryWithFallback(entry)
    setLeaderboard(entries)
  }, [])

  const handleDeleteLeaderboardEntry = useCallback(async (entryId) => {
    const entries = await removeLeaderboardEntryWithFallback(entryId)
    setLeaderboard(entries)
  }, [])

  const handleToggleTheme = useCallback(() => {
    setTheme((previousTheme) => (previousTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  const arenaButtonClassName =
  theme === "light"
    ? "z-50 inline-flex items-center rounded-full border border-rose-500/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-900 shadow-lg shadow-black/10 backdrop-blur transition hover:border-rose-400 hover:bg-white/85 hover:text-rose-950"
    : "z-50 inline-flex items-center rounded-full border border-rose-500/60 bg-slate-950/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200 shadow-lg shadow-black/25 transition hover:border-rose-400 hover:bg-slate-900/90 hover:text-rose-100";

  return (
    <div className="min-h-screen text-[var(--app-fg)] flex flex-col items-start justify-start gap-0 py-10 px-4">
      <div className="mx-auto w-full max-w-7xl px-8">
        {screen === 'game' ? (
          <a
          href={arenaUrl}
          className={arenaButtonClassName}
        >
          {t('game.backToLobby')}
          </a>
        ) : (
          <a
          href={arenaUrl}
          className={arenaButtonClassName}
        >
          {t('start.backToArena')}
          </a>
        )}  

        
      </div>
      {screen === 'start' ? (
        <StartScreen
          defaultUsername={username}
          isDeveloperMode={isDeveloperMode}
          leaderboard={leaderboard}
          lastResult={lastResult}
          onDeleteLeaderboardEntry={handleDeleteLeaderboardEntry}
          onStart={handleStart}
          onToggleTheme={handleToggleTheme}
          theme={theme}
        />
      ) : (
        <HangmanGame
          difficulty={difficulty}
          onBackToLobby={() => setScreen('start')}
          onRoundFinished={handleRoundFinished}
          theme={theme}
          username={username}
        />
      )}
    </div>
  )
}

