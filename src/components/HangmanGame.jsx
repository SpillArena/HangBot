import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'
import { generateBotWord } from '../utils/botWordFactory'

const BASE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const NORWEGIAN_ALPHABET_EXT = ['Æ', 'Ø', 'Å']

const HANGMAN_STAGES = [
  ` +---+
 |   |
     |
     |
     |
     |
========`,
  ` +---+
 |   |
 O   |
     |
     |
     |
========`,
  ` +---+
 |   |
 O   |
 |   |
     |
     |
========`,
  ` +---+
 |   |
 O   |
/|   |
     |
     |
========`,
  ` +---+
 |   |
 O   |
/|\\  |
     |
     |
========`,
  ` +---+
 |   |
 O   |
/|\\  |
/    |
     |
========`,
  ` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
========`,
]

const createRoundId = () => (
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `round-${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const calculateRoundScore = ({
  difficulty,
  guessedLetters,
  status,
  word,
  wrongGuesses,
}) => {
  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.medium
  const uniqueLetterCount = new Set(word.split('')).size

  if (status === 'won') {
    const baseScore = (word.length * 45) + (uniqueLetterCount * 85)
    const precisionBonus = (config.maxWrongGuesses - wrongGuesses) * 65
    return Math.max(0, Math.round((baseScore + precisionBonus) * config.multiplier))
  }

  const discoveredLetters = new Set(guessedLetters.filter((letter) => word.includes(letter))).size
  const fallbackScore = (discoveredLetters * 35) + (word.length * 10)
  return Math.max(0, Math.round(fallbackScore * config.multiplier))
}

const createRound = async (difficulty, language) => {
  const generated = await generateBotWord(difficulty, language)

  return {
    roundId: createRoundId(),
    difficulty: generated.difficulty,
    word: generated.word,
    hint: generated.hint,
    category: generated.category,
    introMessage: generated.introMessage,
    sourceText: generated.sourceText,
    guessedLetters: [],
    wrongGuesses: 0,
    status: 'playing',
    finalScore: null,
  }
}

const formatElapsedTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function HangmanGame({
  difficulty,
  onBackToLobby,
  onRoundFinished,
  theme = 'dark',
  username,
}) {
  const { i18n, t } = useTranslation()
  const language = i18n.language.startsWith('no') ? 'no' : 'en'
  const isLightTheme = theme === 'light'
  const gameAlphabet = useMemo(
    () => (language === 'no' ? [...BASE_ALPHABET, ...NORWEGIAN_ALPHABET_EXT] : BASE_ALPHABET),
    [language],
  )
  const [round, setRound] = useState(null)
  const [isLoadingRound, setIsLoadingRound] = useState(true)
  const [roundSeconds, setRoundSeconds] = useState(0)
  const reportedRoundIdsRef = useRef(new Set())

  const loadRound = useCallback(async (nextDifficulty) => {
    setIsLoadingRound(true)
    setRoundSeconds(0)
    const nextRound = await createRound(nextDifficulty, language)
    setRound(nextRound)
    setIsLoadingRound(false)
  }, [language])

  useEffect(() => {
    let cancelled = false

    const initializeRound = async () => {
      const nextRound = await createRound(difficulty, language)
      if (cancelled) {
        return
      }

      setRound(nextRound)
      setRoundSeconds(0)
      setIsLoadingRound(false)
    }

    initializeRound()
    return () => {
      cancelled = true
    }
  }, [difficulty, language])

  const roundId = round?.roundId ?? null
  const roundStatus = round?.status ?? 'playing'

  useEffect(() => {
    if (!roundId || isLoadingRound || roundStatus !== 'playing') {
      return
    }

    const timerId = window.setInterval(() => {
      setRoundSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [isLoadingRound, roundId, roundStatus])

  const activeDifficulty = round?.difficulty ?? difficulty
  const config = DIFFICULTY_CONFIG[activeDifficulty] ?? DIFFICULTY_CONFIG.medium
  const localizedDifficultyLabel = t(`difficulty.${activeDifficulty}.label`, { defaultValue: config.label })
  const uniqueLetters = useMemo(() => (round ? [...new Set(round.word.split(''))] : []), [round])
  const guessedSet = useMemo(() => new Set(round?.guessedLetters ?? []), [round?.guessedLetters])
  const wrongLetters = useMemo(
    () => (round ? round.guessedLetters.filter((letter) => !round.word.includes(letter)) : []),
    [round],
  )

  const maskedWord = useMemo(
    () => (round ? round.word.split('').map((letter) => (guessedSet.has(letter) ? letter : '•')).join(' ') : ''),
    [guessedSet, round],
  )

  const attemptsLeft = Math.max(config.maxWrongGuesses - (round?.wrongGuesses ?? 0), 0)
  const shellClassName = isLightTheme
    ? 'mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 text-slate-900 md:px-8'
    : 'mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 text-slate-100 md:px-8'
  const panelClassName = isLightTheme
    ? 'rounded-2xl border border-slate-200/90 bg-white/80 shadow-xl shadow-slate-300/25'
    : 'rounded-2xl border border-slate-800/80 bg-slate-950/70 shadow-xl shadow-black/20'

  const startNextRound = useCallback(() => {
    loadRound(difficulty)
  }, [difficulty, loadRound])

  const handleGuess = useCallback((rawLetter) => {
    if (!round || isLoadingRound) {
      return
    }

    const letter = rawLetter.toUpperCase()
    if (!gameAlphabet.includes(letter)) {
      return
    }

    setRound((prevRound) => {
      if (!prevRound || prevRound.status !== 'playing' || prevRound.guessedLetters.includes(letter)) {
        return prevRound
      }

      const nextGuessedLetters = [...prevRound.guessedLetters, letter]
      const wrongDelta = prevRound.word.includes(letter) ? 0 : 1
      const nextWrongGuesses = prevRound.wrongGuesses + wrongDelta
      const nextUniqueLetters = [...new Set(prevRound.word.split(''))]
      const solved = nextUniqueLetters.every((wordLetter) => nextGuessedLetters.includes(wordLetter))
      const difficultyConfig = DIFFICULTY_CONFIG[prevRound.difficulty] ?? DIFFICULTY_CONFIG.medium
      const lost = nextWrongGuesses >= difficultyConfig.maxWrongGuesses
      const nextStatus = solved ? 'won' : lost ? 'lost' : 'playing'

      return {
        ...prevRound,
        guessedLetters: nextGuessedLetters,
        wrongGuesses: nextWrongGuesses,
        status: nextStatus,
        finalScore: nextStatus === 'playing'
          ? null
          : calculateRoundScore({
            difficulty: prevRound.difficulty,
            guessedLetters: nextGuessedLetters,
            status: nextStatus,
            word: prevRound.word,
            wrongGuesses: nextWrongGuesses,
          }),
      }
    })
  }, [gameAlphabet, isLoadingRound, round])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!round || isLoadingRound) {
        return
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }

      const normalizedKey = typeof event.key === 'string' ? event.key.toUpperCase() : ''
      if (gameAlphabet.includes(normalizedKey)) {
        event.preventDefault()
        handleGuess(normalizedKey)
        return
      }

      if (event.key === 'Enter' && round.status !== 'playing') {
        event.preventDefault()
        startNextRound()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameAlphabet, handleGuess, isLoadingRound, round, startNextRound])

  useEffect(() => {
    if (!round) {
      return
    }

    if (round.status === 'playing' || typeof onRoundFinished !== 'function') {
      return
    }

    if (reportedRoundIdsRef.current.has(round.roundId)) {
      return
    }
    reportedRoundIdsRef.current.add(round.roundId)

    onRoundFinished({
      id: round.roundId,
      username,
      difficulty: round.difficulty,
      outcome: round.status,
      score: round.finalScore ?? 0,
      wrongGuesses: round.wrongGuesses,
      maxWrongGuesses: config.maxWrongGuesses,
      wordLength: round.word.length,
      guessedLetters: round.guessedLetters.length,
      word: round.word,
      timestamp: new Date().toISOString(),
    })
  }, [config.maxWrongGuesses, onRoundFinished, round, username])

  const stageIndex = Math.min(
    HANGMAN_STAGES.length - 1,
    Math.round((((round?.wrongGuesses ?? 0) / config.maxWrongGuesses) * (HANGMAN_STAGES.length - 1))),
  )

  if (!round) {
    return (
      <main className={shellClassName}>
        <section className={`${panelClassName} p-6 text-center`}>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">HangBot</p>
          <p className={`mt-3 text-sm ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}>
            {isLoadingRound ? t('game.generatingRound') : t('game.unableInitRound')}
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={startNextRound}
              className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:bg-cyan-300"
            >
              {t('game.tryAgain')}
            </button>
            <button
              type="button"
              onClick={onBackToLobby}
              className="rounded-lg border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-100"
            >
              {t('game.backToLobby')}
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className={shellClassName}>
      <header className={`${panelClassName} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">{t('game.player')}</p>
          <h1 className={`text-xl font-semibold ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>{username}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide">
          <span className={isLightTheme ? 'rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700' : 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300'}>
            {t('game.difficulty')}: {localizedDifficultyLabel}
          </span>
          <span className={isLightTheme ? 'rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700' : 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300'}>
            {t('game.timer')}: {formatElapsedTime(roundSeconds)}
          </span>
          <span className={isLightTheme ? 'rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700' : 'rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-300'}>
            {t('game.attemptsLeft')}: {attemptsLeft}
          </span>
          {isLoadingRound && (
            <span className="rounded-full border border-cyan-500/60 bg-cyan-500/10 px-3 py-1 text-cyan-200">
              {t('game.loadingWord')}
            </span>
          )}

        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className={`${panelClassName} p-4`}>
          <p className={`mb-1 text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{t('game.botTransmission')}</p>
          <ul className={`space-y-1 text-sm ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}>
            <li>{round.introMessage}</li>
            <li>{t('game.category')}: {round.category}</li>
            <li>{t('game.source')}: {round.sourceText}</li>
          </ul>

          <div className={isLightTheme ? 'mt-3 rounded-xl border border-slate-300 bg-slate-50 p-3' : 'mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3'}>
            <p className={`text-xs uppercase tracking-wide ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{t('game.hint')}</p>
            <p className={`mt-1 text-sm ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}>{round.hint}</p>
          </div>

          <div className={isLightTheme ? 'mt-3 rounded-xl border border-slate-300 bg-slate-50 p-3' : 'mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3'}>
            <p className={`text-xs uppercase tracking-wide ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{t('game.wrongLetters')}</p>
            <p className="mt-1 min-h-6 font-mono text-sm text-rose-200">
              {wrongLetters.length > 0 ? wrongLetters.join(', ') : t('game.none')}
            </p>
          </div>

          <pre className={isLightTheme ? 'mt-4 overflow-auto rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-700' : 'mt-4 overflow-auto rounded-xl border border-slate-800 bg-slate-900 px-3 py-3 text-xs text-slate-200'}>
            {HANGMAN_STAGES[stageIndex]}
          </pre>
        </aside>

        <div className={`${panelClassName} p-5`}>
          <div className={isLightTheme ? 'rounded-xl border border-slate-300 bg-slate-50 px-4 py-5' : 'rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-5'}>
            <p className={`mb-2 text-xs uppercase tracking-[0.2em] ${isLightTheme ? 'text-slate-500' : 'text-slate-400'}`}>{t('game.mysteryWord')}</p>
            <p className={`break-words font-mono text-2xl font-semibold tracking-[0.35em] sm:text-3xl ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
              {maskedWord}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-9 md:grid-cols-13">
            {gameAlphabet.map((letter) => {
              const hasGuessed = guessedSet.has(letter)
              const isHit = hasGuessed && round.word.includes(letter)
              const isMiss = hasGuessed && !round.word.includes(letter)

              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleGuess(letter)}
                  disabled={hasGuessed || round.status !== 'playing' || isLoadingRound}
                  className={[
                    'rounded-lg border px-2 py-2 text-sm font-semibold transition',
                    hasGuessed ? 'cursor-not-allowed' : 'hover:border-cyan-400 hover:text-cyan-100',
                    isHit ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200' : '',
                    isMiss ? 'border-rose-400/40 bg-rose-500/20 text-rose-200' : '',
                    !hasGuessed ? (isLightTheme ? 'border-slate-300 bg-white text-slate-800 hover:border-cyan-500 hover:text-cyan-700' : 'border-slate-700 bg-slate-900 text-slate-200') : '',
                  ].join(' ')}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          <div className={isLightTheme ? 'mt-4 rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-600' : 'mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400'}>
            {t('game.keyboardTip', { alphabetLabel: language === 'no' ? 'A-Å' : 'A-Z' })}
          </div>

          {round.status !== 'playing' && (
            <div className={`mt-5 rounded-xl border p-4 ${round.status === 'won' ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-rose-400/40 bg-rose-500/10'}`}>
              <h2 className="text-lg font-bold text-white">
                {round.status === 'won' ? t('game.roundWon') : t('game.roundLost')}
              </h2>
              <p className={`mt-1 text-sm ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}>
                {t('game.correctWord')}: <span className="font-mono font-semibold">{round.word}</span>
              </p>
              <p className={`mt-1 text-sm ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}>
                {t('game.score')}: <span className="font-semibold text-cyan-200">{round.finalScore ?? 0}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startNextRound}
                  className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:bg-cyan-300"
                >
                  {t('game.newWord')}
                </button>
                <button
                  type="button"
                  onClick={onBackToLobby}
                  className={isLightTheme ? 'rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700' : 'rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200'}
                >
                  {t('game.returnLobby')}
                </button>
              </div>
            </div>
          )}

          {round.status === 'playing' && uniqueLetters.length <= 5 && (
            <div className="mt-5 rounded-xl border border-amber-400/35 bg-amber-500/10 p-3 text-xs text-amber-200">
              {t('game.lowUniqueLetterWord')}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

