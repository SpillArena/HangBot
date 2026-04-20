const createTableSql = `
CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  outcome TEXT NOT NULL,
  score INTEGER NOT NULL,
  wrong_guesses INTEGER NOT NULL,
  max_wrong_guesses INTEGER NOT NULL,
  word_length INTEGER NOT NULL,
  guessed_letters INTEGER NOT NULL,
  word TEXT NOT NULL,
  timestamp TEXT NOT NULL
)
`

const toClientEntry = (row) => ({
    id: row.id,
    username: row.username,
    difficulty: row.difficulty,
    outcome: row.outcome,
    score: Number(row.score),
    wrongGuesses: Number(row.wrong_guesses),
    maxWrongGuesses: Number(row.max_wrong_guesses),
    wordLength: Number(row.word_length),
    guessedLetters: Number(row.guessed_letters),
    word: row.word,
    timestamp: row.timestamp,
})

const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
    status,
    headers: {
        'content-type': 'application/json; charset=utf-8',
    },
})

const D1_BINDING_CANDIDATES = ['DB', 'LEADERBOARD_DB']
const MAX_LEADERBOARD_ENTRIES = 15

const compareEntries = (a, b) => (
    b.score - a.score
    || (a.wrongGuesses - b.wrongGuesses)
    || (Date.parse(b.timestamp) - Date.parse(a.timestamp))
)

const getUsernameKey = (username) => username.trim().toLowerCase()

const normalizeEntries = (entries) => {
    const dedupedById = new Map()
    for (const entry of entries) {
        dedupedById.set(entry.id, entry)
    }

    const bestByUsername = new Map()
    for (const entry of dedupedById.values()) {
        const usernameKey = getUsernameKey(entry.username)
        const currentBestEntry = bestByUsername.get(usernameKey)
        if (!currentBestEntry || compareEntries(entry, currentBestEntry) < 0) {
            bestByUsername.set(usernameKey, entry)
        }
    }

    return [...bestByUsername.values()]
        .sort(compareEntries)
        .slice(0, MAX_LEADERBOARD_ENTRIES)
}

const getDb = (context) => {
    for (const bindingName of D1_BINDING_CANDIDATES) {
        const db = context.env?.[bindingName]
        if (db) {
            return db
        }
    }

    return null
}

const missingBindingPayload = () => ({
    ok: false,
    fallback: 'local',
    message: `D1 binding is missing. Expected one of: ${D1_BINDING_CANDIDATES.join(', ')}`,
})

const ensureTable = async (db) => {
    const tableExists = await db
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leaderboard'")
        .first()

    if (!tableExists) {
        await db.prepare(createTableSql.trim()).run()
    }
}

const listAllEntries = async (db) => {
    const result = await db.prepare(`
    SELECT id, username, difficulty, outcome, score, wrong_guesses, max_wrong_guesses, word_length, guessed_letters, word, timestamp
    FROM leaderboard
  `).all()

    const rows = Array.isArray(result.results) ? result.results : []
    return rows.map(toClientEntry)
}

const listEntries = async (db) => {
    const allEntries = await listAllEntries(db)
    return normalizeEntries(allEntries)
}

const pruneEntries = async (db) => {
    const allEntries = await listAllEntries(db)
    const normalizedEntries = normalizeEntries(allEntries)
    const normalizedEntryIds = new Set(normalizedEntries.map((entry) => entry.id))
    const redundantEntryIds = allEntries
        .filter((entry) => !normalizedEntryIds.has(entry.id))
        .map((entry) => entry.id)

    for (const entryId of redundantEntryIds) {
        await db.prepare('DELETE FROM leaderboard WHERE id = ?').bind(entryId).run()
    }

    return normalizedEntries
}

export const onRequestGet = async (context) => {
    const db = getDb(context)
    if (!db) {
        return json(missingBindingPayload())
    }

    try {
        await ensureTable(db)
        const entries = await pruneEntries(db)
        return json({ ok: true, provider: 'd1', entries })
    } catch (error) {
        return json({ ok: false, fallback: 'local', message: `Failed to load leaderboard: ${error?.message ?? 'unknown error'}` })
    }
}

export const onRequestPost = async (context) => {
    const db = getDb(context)
    if (!db) {
        return json(missingBindingPayload())
    }

    try {
        const payload = await context.request.json()
        if (!payload || typeof payload.id !== 'string') {
            return json({ ok: false, message: 'Invalid payload.' }, 400)
        }

        await ensureTable(db)

        await db.prepare(`
      INSERT OR REPLACE INTO leaderboard (
        id, username, difficulty, outcome, score, wrong_guesses, max_wrong_guesses, word_length, guessed_letters, word, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
            payload.id,
            payload.username,
            payload.difficulty,
            payload.outcome,
            payload.score,
            payload.wrongGuesses,
            payload.maxWrongGuesses,
            payload.wordLength,
            payload.guessedLetters,
            payload.word,
            payload.timestamp,
        ).run()

        const entries = await pruneEntries(db)
        return json({ ok: true, provider: 'd1', entries })
    } catch (error) {
        return json({ ok: false, fallback: 'local', message: `Failed to save leaderboard entry: ${error?.message ?? 'unknown error'}` })
    }
}

export const onRequestDelete = async (context) => {
    const db = getDb(context)
    if (!db) {
        return json(missingBindingPayload())
    }

    try {
        const payload = await context.request.json()
        const entryId = payload?.id
        if (typeof entryId !== 'string' || entryId.length === 0) {
            return json({ ok: false, message: 'Missing entry id.' }, 400)
        }

        await ensureTable(db)
        await db.prepare('DELETE FROM leaderboard WHERE id = ?').bind(entryId).run()

        const entries = await pruneEntries(db)
        return json({ ok: true, provider: 'd1', entries })
    } catch (error) {
        return json({ ok: false, fallback: 'local', message: `Failed to delete leaderboard entry: ${error?.message ?? 'unknown error'}` })
    }
}
