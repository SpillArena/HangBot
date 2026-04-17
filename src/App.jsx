import { useCallback, useEffect, useState } from 'react'
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

export default function App() {
  const [screen, setScreen] = useState('start')
  const [username, setUsername] = useState(() => loadRememberedUsername())
  const [difficulty, setDifficulty] = useState('medium')
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard())
  const [lastResult, setLastResult] = useState(null)
  const [isDeveloperMode, setIsDeveloperMode] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

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

  return (
    <div className="min-h-screen text-slate-100">
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
          username={username}
        />
      )}
    </div>
  )
}

