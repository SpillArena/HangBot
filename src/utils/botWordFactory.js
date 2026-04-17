const WORD_BANK = {
  easy: [
    { word: 'PLANET', hint: 'A massive object orbiting a star.', category: 'Space' },
    { word: 'PUZZLE', hint: 'Something solved piece by piece.', category: 'Game' },
    { word: 'GARDEN', hint: 'A place where flowers and vegetables grow.', category: 'Nature' },
    { word: 'ROCKET', hint: 'Launches into the sky with fuel.', category: 'Space' },
    { word: 'ISLAND', hint: 'Land surrounded by water.', category: 'Geography' },
    { word: 'BUTTON', hint: 'Press it to trigger an action.', category: 'Technology' },
    { word: 'STREAM', hint: 'A small flow of water.', category: 'Nature' },
    { word: 'MARKET', hint: 'A place where people buy and sell.', category: 'Daily Life' },
    { word: 'VOYAGE', hint: 'A long journey, often by sea.', category: 'Travel' },
    { word: 'GUITAR', hint: 'A string instrument.', category: 'Music' },
  ],
  medium: [
    { word: 'ALGORITHM', hint: 'A step-by-step procedure used in computing.', category: 'Programming' },
    { word: 'BLUEPRINT', hint: 'A detailed technical plan.', category: 'Engineering' },
    { word: 'TREASURE', hint: 'Valuable items hidden or protected.', category: 'Adventure' },
    { word: 'PARADOX', hint: 'A statement that seems self-contradictory.', category: 'Logic' },
    { word: 'HORIZON', hint: 'Where the earth seems to meet the sky.', category: 'Nature' },
    { word: 'SYMPHONY', hint: 'A large orchestral composition.', category: 'Music' },
    { word: 'ASTRONAUT', hint: 'A human trained to travel in space.', category: 'Space' },
    { word: 'KEYBOARD', hint: 'Input device with letters and symbols.', category: 'Technology' },
    { word: 'MARATHON', hint: 'A 42.195 km race.', category: 'Sports' },
    { word: 'JOURNAL', hint: 'A record of daily events or thoughts.', category: 'Writing' },
  ],
  hard: [
    { word: 'QUANTUM', hint: 'Physics scale where particles behave probabilistically.', category: 'Science' },
    { word: 'MNEMONIC', hint: 'Memory technique using patterns or phrases.', category: 'Learning' },
    { word: 'SYNTHESIS', hint: 'Combining parts to create something new.', category: 'Science' },
    { word: 'CATALYST', hint: 'Speeds up a reaction without being consumed.', category: 'Chemistry' },
    { word: 'POLYMORPH', hint: 'A form that can take multiple shapes.', category: 'Programming' },
    { word: 'CRYPTIC', hint: 'Mysterious and hard to understand.', category: 'Language' },
    { word: 'VORTEX', hint: 'A whirling mass of fluid or air.', category: 'Physics' },
    { word: 'ECLIPTIC', hint: 'Path of the Sun across the sky.', category: 'Astronomy' },
    { word: 'NANOBOTS', hint: 'Tiny robots imagined for precise tasks.', category: 'Futurism' },
    { word: 'HYPERION', hint: 'One of Saturn’s moons.', category: 'Space' },
  ],
  insane: [
    { word: 'SCHISMATIC', hint: 'Related to a split within a group.', category: 'Language' },
    { word: 'XENOLITH', hint: 'Rock fragment enclosed in another rock.', category: 'Geology' },
    { word: 'ZEITGEIST', hint: 'Defining spirit of an era.', category: 'Culture' },
    { word: 'LYSERGIC', hint: 'Associated with certain complex compounds.', category: 'Chemistry' },
    { word: 'JUKEBOX', hint: 'Machine that plays selected songs.', category: 'Music' },
    { word: 'VAPORIZE', hint: 'To turn into vapor.', category: 'Science' },
    { word: 'PYROCLAST', hint: 'Volcanic rock ejected during an eruption.', category: 'Geology' },
    { word: 'QUIXOTIC', hint: 'Unrealistic and idealistic.', category: 'Language' },
    { word: 'BIFURCATE', hint: 'To divide into two branches.', category: 'Math' },
    { word: 'AZIMUTHAL', hint: 'Direction angle in a horizontal plane.', category: 'Navigation' },
  ],
}

const WORD_BANK_NO = {
  easy: [
    { word: 'SJØEN', hint: 'Stor vannflate med saltvann.', category: 'Natur' },
    { word: 'MÅNEN', hint: 'Jordens naturlige satellitt.', category: 'Rom' },
    { word: 'BØLGE', hint: 'Bevegelse i vann som ruller inn mot land.', category: 'Natur' },
    { word: 'KJØTT', hint: 'Matvare fra dyr.', category: 'Hverdag' },
    { word: 'RØDME', hint: 'Farge i ansiktet etter kulde eller sjenanse.', category: 'Hverdag' },
    { word: 'TØMMER', hint: 'Bearbeidet trevirke brukt i bygging.', category: 'Bygg' },
    { word: 'LÆRER', hint: 'Person som underviser.', category: 'Skole' },
    { word: 'SØPPEL', hint: 'Avfall som kastes.', category: 'Hverdag' },
  ],
  medium: [
    { word: 'KJØKKEN', hint: 'Rommet der man lager mat.', category: 'Hjem' },
    { word: 'SKJØNNHET', hint: 'Det som oppleves vakkert.', category: 'Språk' },
    { word: 'FØLELSE', hint: 'Indre emosjonell tilstand.', category: 'Psykologi' },
    { word: 'NØKKELEN', hint: 'Brukes for å låse opp dører.', category: 'Hverdag' },
    { word: 'HÅNDTAK', hint: 'Del man griper i på dør eller verktøy.', category: 'Hverdag' },
    { word: 'LÆREREN', hint: 'Bestemt form av en som underviser.', category: 'Skole' },
  ],
  hard: [
    { word: 'KJØLESKAP', hint: 'Hvitevare som holder mat kald.', category: 'Hjem' },
    { word: 'FØDSELSDAG', hint: 'Dagen man feirer når man er født.', category: 'Hverdag' },
    { word: 'NØDVENDIG', hint: 'Noe som er strengt påkrevd.', category: 'Språk' },
    { word: 'KJØRETØY', hint: 'Transportmiddel på hjul.', category: 'Transport' },
    { word: 'MÅLESTOKK', hint: 'Standard for å sammenligne kvalitet eller nivå.', category: 'Begrep' },
    { word: 'HØYTTALER', hint: 'Enhet som spiller av lyd.', category: 'Teknologi' },
  ],
  insane: [
    { word: 'KJÆRLIGHET', hint: 'Dyp følelse av nærhet og omsorg.', category: 'Følelser' },
    { word: 'UTILBØRLIG', hint: 'Noe som er upassende eller uakseptabelt.', category: 'Språk' },
    { word: 'BØLGELENGDE', hint: 'Avstand mellom to topper i en bølge.', category: 'Fysikk' },
    { word: 'DØGNRYTME', hint: 'Kroppens naturlige 24-timers syklus.', category: 'Biologi' },
    { word: 'SJØSTJERNE', hint: 'Sjødyr med flere armer.', category: 'Natur' },
    { word: 'MÅNEDSKORT', hint: 'Billett gyldig i en hel måned.', category: 'Transport' },
  ],
}

const BOT_INTROS = {
  en: [
    'HangBot online. I forged a fresh challenge.',
    'New encrypted word generated by HangBot.',
    'Bot protocol complete. Mystery word is locked in.',
    'HangBot spun up a new lexical trap.',
    'A new puzzle escaped from HangBot\'s language core.',
  ],
  no: [
    'HangBot er online. Jeg smidde en ny utfordring.',
    'Nytt kryptert ord generert av HangBot.',
    'Bot-protokoll fullfort. Skjult ord er last.',
    'HangBot startet en ny leksikalsk felle.',
    'En ny utfordring rømte fra HangBots sprakkjerne.',
  ],
}

const SOURCE_TEXT = {
  api: {
    en: 'live dictionary API',
    no: 'direkte ordbok-API',
  },
  bank: {
    en: 'local word bank backup',
    no: 'lokal norsk ordbank',
  },
}

const DATAMUSE_ENDPOINT = 'https://api.datamuse.com/words'

const WORD_LENGTH_BY_DIFFICULTY = {
  easy: [5, 6],
  medium: [7, 9],
  hard: [8, 10],
  insane: [9, 11],
}

const PART_OF_SPEECH_CATEGORY = {
  n: 'Noun',
  v: 'Verb',
  adj: 'Adjective',
  adv: 'Adverb',
}

const normalizeLanguage = (language) => {
  if (typeof language !== 'string') {
    return 'en'
  }

  return language.toLowerCase().startsWith('no') ? 'no' : 'en'
}

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)]

const randomIntInRange = ([min, max]) => Math.floor(Math.random() * ((max - min) + 1)) + min

const normalizeAlphaWord = (word) => {
  const trimmed = word.trim()
  if (!/^[A-Za-zÆØÅæøå]+$/.test(trimmed)) {
    return ''
  }

  return trimmed.toUpperCase()
}

const createLengthPattern = (difficulty) => {
  const range = WORD_LENGTH_BY_DIFFICULTY[difficulty] ?? WORD_LENGTH_BY_DIFFICULTY.medium
  return '?'.repeat(randomIntInRange(range))
}

const definitionToHint = (definitions) => {
  const raw = definitions?.[0]
  if (!raw) {
    return null
  }

  const [, definition] = raw.split('\t')
  if (!definition) {
    return null
  }

  const cleaned = definition.replace(/\s+/g, ' ').trim()
  if (!cleaned) {
    return null
  }

  return cleaned[0].toUpperCase() + cleaned.slice(1)
}

const tagsToCategory = (tags) => {
  const maybePos = tags?.find((tag) => PART_OF_SPEECH_CATEGORY[tag])
  return maybePos ? PART_OF_SPEECH_CATEGORY[maybePos] : 'Dictionary'
}

const createApiHint = (word) => `Dictionary-sourced challenge. Word length: ${word.length}.`

const createFallbackEntry = (difficulty, language = 'en') => {
  const normalizedDifficulty = WORD_BANK[difficulty] ? difficulty : 'medium'
  const wordBank = normalizeLanguage(language) === 'no' ? WORD_BANK_NO : WORD_BANK

  return {
    ...pickRandom(wordBank[normalizedDifficulty]),
    origin: 'bank',
  }
}

const fetchApiEntry = async (difficulty) => {
  const pattern = createLengthPattern(difficulty)
  const params = new URLSearchParams({
    sp: pattern,
    max: '80',
    md: 'd,p',
  })

  const response = await fetch(`${DATAMUSE_ENDPOINT}?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Datamuse request failed with status ${response.status}`)
  }

  const payload = await response.json()
  const candidates = Array.isArray(payload)
    ? payload
      .map((entry) => ({
        ...entry,
        cleanWord: normalizeAlphaWord(entry.word ?? ''),
      }))
      // Require a strict alphabetical token and a dictionary definition.
      .filter((entry) => entry.cleanWord.length >= 4 && Array.isArray(entry.defs) && entry.defs.length > 0)
    : []

  if (candidates.length === 0) {
    throw new Error('Datamuse returned no valid candidates')
  }

  const selected = pickRandom(candidates)
  return {
    word: selected.cleanWord,
    hint: definitionToHint(selected.defs) ?? createApiHint(selected.cleanWord),
    category: tagsToCategory(selected.tags),
    origin: 'api',
  }
}

export const generateBotWord = async (difficulty = 'medium', language = 'en') => {
  const normalizedDifficulty = WORD_BANK[difficulty] ? difficulty : 'medium'
  const normalizedLanguage = normalizeLanguage(language)

  let entry
  if (normalizedLanguage === 'no') {
    // In Norwegian mode, always use the Norwegian word bank.
    entry = createFallbackEntry(normalizedDifficulty, normalizedLanguage)
  } else {
    try {
      // Use the free Datamuse dictionary API for dynamic words when online.
      entry = await fetchApiEntry(normalizedDifficulty)
    } catch {
      entry = createFallbackEntry(normalizedDifficulty, normalizedLanguage)
    }
  }

  const sourceText = SOURCE_TEXT[entry.origin === 'api' ? 'api' : 'bank'][normalizedLanguage]
  const intros = BOT_INTROS[normalizedLanguage] ?? BOT_INTROS.en

  return {
    ...entry,
    difficulty: normalizedDifficulty,
    introMessage: pickRandom(intros),
    sourceText,
  }
}

