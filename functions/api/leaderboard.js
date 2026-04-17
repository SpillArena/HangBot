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

const getDb = (context) => context.env?.DB

const ensureTable = async (db) => {
  await db.prepare(createTableSql).run()
}

const listEntries = async (db) => {
  const result = await db.prepare(`
    SELECT id, username, difficulty, outcome, score, wrong_guesses, max_wrong_guesses, word_length, guessed_letters, word, timestamp
    FROM leaderboard
    ORDER BY score DESC, wrong_guesses ASC, timestamp DESC
    LIMIT 30
  `).all()

  const rows = Array.isArray(result.results) ? result.results : []
  return rows.map(toClientEntry)
}

export const onRequestGet = async (context) => {
  const db = getDb(context)
  if (!db) {
    return json({ ok: false, fallback: 'local', message: 'D1 binding DB is missing.' })
  }

  try {
    await ensureTable(db)
    const entries = await listEntries(db)
    return json({ ok: true, provider: 'd1', entries })
  } catch (error) {
    return json({ ok: false, fallback: 'local', message: `Failed to load leaderboard: ${error?.message ?? 'unknown error'}` })
  }
}

export const onRequestPost = async (context) => {
  const db = getDb(context)
  if (!db) {
    return json({ ok: false, fallback: 'local', message: 'D1 binding DB is missing.' })
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

    const entries = await listEntries(db)
    return json({ ok: true, provider: 'd1', entries })
  } catch (error) {
    return json({ ok: false, fallback: 'local', message: `Failed to save leaderboard entry: ${error?.message ?? 'unknown error'}` })
  }
}

export const onRequestDelete = async (context) => {
  const db = getDb(context)
  if (!db) {
    return json({ ok: false, fallback: 'local', message: 'D1 binding DB is missing.' })
  }

  try {
    const payload = await context.request.json()
    const entryId = payload?.id
    if (typeof entryId !== 'string' || entryId.length === 0) {
      return json({ ok: false, message: 'Missing entry id.' }, 400)
    }

    await ensureTable(db)
    await db.prepare('DELETE FROM leaderboard WHERE id = ?').bind(entryId).run()

    const entries = await listEntries(db)
    return json({ ok: true, provider: 'd1', entries })
  } catch (error) {
    return json({ ok: false, fallback: 'local', message: `Failed to delete leaderboard entry: ${error?.message ?? 'unknown error'}` })
  }
}
