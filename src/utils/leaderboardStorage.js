import { MAX_LEADERBOARD_ENTRIES } from '../constants/gameConfig'

const LEADERBOARD_STORAGE_KEY = 'hangbot.leaderboard.v1'
const USERNAME_STORAGE_KEY = 'hangbot.username.v1'

const isValidEntry = (entry) => {
  if (!entry || typeof entry !== 'object') {
    return false
  }

  return typeof entry.id === 'string'
    && typeof entry.username === 'string'
    && typeof entry.difficulty === 'string'
    && typeof entry.outcome === 'string'
    && typeof entry.score === 'number'
    && typeof entry.wrongGuesses === 'number'
    && typeof entry.maxWrongGuesses === 'number'
    && typeof entry.wordLength === 'number'
    && typeof entry.timestamp === 'string'
}

const compareEntries = (a, b) => (
  b.score - a.score
  || (a.wrongGuesses - b.wrongGuesses)
  || (Date.parse(b.timestamp) - Date.parse(a.timestamp))
)

const normalizeEntries = (entries) => {
  if (!Array.isArray(entries)) {
    return []
  }

  const dedupedById = new Map()
  for (const entry of entries) {
    if (isValidEntry(entry)) {
      dedupedById.set(entry.id, entry)
    }
  }

  return [...dedupedById.values()]
    .sort(compareEntries)
    .slice(0, MAX_LEADERBOARD_ENTRIES)
}

export const loadLeaderboard = () => {
  try {
    const rawValue = localStorage.getItem(LEADERBOARD_STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    return normalizeEntries(JSON.parse(rawValue))
  } catch {
    return []
  }
}

export const saveLeaderboard = (entries) => {
  const normalizedEntries = normalizeEntries(entries)
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(normalizedEntries))
  return normalizedEntries
}

export const addLeaderboardEntry = (entries, newEntry) => {
  const nextEntries = saveLeaderboard([newEntry, ...entries])
  return nextEntries
}

export const removeLeaderboardEntry = (entries, entryId) => {
  const nextEntries = entries.filter((entry) => entry.id !== entryId)
  return saveLeaderboard(nextEntries)
}

export const clearLeaderboard = () => {
  localStorage.removeItem(LEADERBOARD_STORAGE_KEY)
}

export const loadRememberedUsername = () => {
  return localStorage.getItem(USERNAME_STORAGE_KEY) || ''
}

export const rememberUsername = (username) => {
  localStorage.setItem(USERNAME_STORAGE_KEY, username)
}

