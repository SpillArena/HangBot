import { useCallback, useEffect, useState } from 'react'
import HangmanGame from './components/HangmanGame'
import StartScreen from './components/StartScreen'
import {
  addLeaderboardEntry,
  loadLeaderboard,
  loadRememberedUsername,
  removeLeaderboardEntry,
  rememberUsername,
} from './utils/leaderboardStorage'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [username, setUsername] = useState(() => loadRememberedUsername())
  const [difficulty, setDifficulty] = useState('medium')
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard())
  const [lastResult, setLastResult] = useState(null)
  const [isDeveloperMode, setIsDeveloperMode] = useState(false)

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

  const handleRoundFinished = useCallback((entry) => {
    setLastResult(entry)
    setLeaderboard((previousEntries) => addLeaderboardEntry(previousEntries, entry))
  }, [])

  const handleDeleteLeaderboardEntry = useCallback((entryId) => {
    setLeaderboard((previousEntries) => removeLeaderboardEntry(previousEntries, entryId))
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

