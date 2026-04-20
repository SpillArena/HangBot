import { MAX_LEADERBOARD_ENTRIES } from '../constants/gameConfig'

const LEADERBOARD_STORAGE_KEY = 'hangbot.leaderboard.v1'
const USERNAME_STORAGE_KEY = 'hangbot.username.v1'
const LEADERBOARD_API_PATH = '/api/leaderboard'

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

const getUsernameKey = (username) => username.trim().toLowerCase()

const dedupeByBestUsername = (entries) => {
  const bestByUsername = new Map()

  for (const entry of entries) {
    const usernameKey = getUsernameKey(entry.username)
    const currentBestEntry = bestByUsername.get(usernameKey)

    if (!currentBestEntry || compareEntries(entry, currentBestEntry) < 0) {
      bestByUsername.set(usernameKey, entry)
    }
  }

  return [...bestByUsername.values()]
}

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

  return dedupeByBestUsername([...dedupedById.values()])
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

const requestCloudLeaderboard = async (method, payload) => {
  const response = await fetch(LEADERBOARD_API_PATH, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Leaderboard cloud request failed with status ${response.status}`)
  }

  const data = await response.json()
  if (!data?.ok || !Array.isArray(data.entries)) {
    throw new Error(data?.message || 'Leaderboard cloud request returned an invalid payload')
  }

  if (data?.provider !== 'd1') {
    throw new Error('D1 provider not active')
  }

  return normalizeEntries(data.entries)
}

const withCloudFallback = async (operation, fallbackOperation) => {
  try {
    return await operation()
  } catch (error) {
    // Keep the app working and expose reason in browser console for diagnostics.
    console.warn(`Leaderboard fallback to local storage: ${error?.message || 'unknown reason'}`)
    return fallbackOperation()
  }
}

export const loadLeaderboardWithFallback = async () => {
  return withCloudFallback(
    async () => {
      const cloudEntries = await requestCloudLeaderboard('GET')
      saveLeaderboard(cloudEntries)
      return cloudEntries
    },
    () => loadLeaderboard(),
  )
}

export const addLeaderboardEntryWithFallback = async (newEntry) => {
  return withCloudFallback(
    async () => {
      const cloudEntries = await requestCloudLeaderboard('POST', newEntry)
      saveLeaderboard(cloudEntries)
      return cloudEntries
    },
    () => addLeaderboardEntry(loadLeaderboard(), newEntry),
  )
}

export const removeLeaderboardEntryWithFallback = async (entryId) => {
  return withCloudFallback(
    async () => {
      const cloudEntries = await requestCloudLeaderboard('DELETE', { id: entryId })
      saveLeaderboard(cloudEntries)
      return cloudEntries
    },
    () => removeLeaderboardEntry(loadLeaderboard(), entryId),
  )
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

