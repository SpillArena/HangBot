export const DIFFICULTY_CONFIG = {
  easy: {
    labelKey: 'difficulty.easy.label',
    descriptionKey: 'difficulty.easy.description',
    maxWrongGuesses: 8,
    multiplier: 1,
    roundDurationSeconds: 180,
  },
  medium: {
    labelKey: 'difficulty.medium.label',
    descriptionKey: 'difficulty.medium.description',
    maxWrongGuesses: 7,
    multiplier: 1.35,
    roundDurationSeconds: 150,
  },
  hard: {
    labelKey: 'difficulty.hard.label',
    descriptionKey: 'difficulty.hard.description',
    maxWrongGuesses: 6,
    multiplier: 1.7,
    roundDurationSeconds: 120,
  },
  insane: {
    labelKey: 'difficulty.insane.label',
    descriptionKey: 'difficulty.insane.description',
    maxWrongGuesses: 5,
    multiplier: 2.1,
    roundDurationSeconds: 90,
  },
  impossible: {
    labelKey: 'difficulty.impossible.label',
    descriptionKey: 'difficulty.impossible.description',
    maxWrongGuesses: 3,
    multiplier: 2.8,
    roundDurationSeconds: 60,
  },
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const NORWEGIAN_ALPHABET_EXT = ['Æ', 'Ø', 'Å']
export const MAX_LEADERBOARD_ENTRIES = 15

