export const DIFFICULTY_CONFIG = {
  easy: {
    labelKey: 'difficulty.easy.label',
    descriptionKey: 'difficulty.easy.description',
    maxWrongGuesses: 8,
    multiplier: 1,
  },
  medium: {
    labelKey: 'difficulty.medium.label',
    descriptionKey: 'difficulty.medium.description',
    maxWrongGuesses: 7,
    multiplier: 1.35,
  },
  hard: {
    labelKey: 'difficulty.hard.label',
    descriptionKey: 'difficulty.hard.description',
    maxWrongGuesses: 6,
    multiplier: 1.7,
  },
  insane: {
    labelKey: 'difficulty.insane.label',
    descriptionKey: 'difficulty.insane.description',
    maxWrongGuesses: 5,
    multiplier: 2.1,
  },
  impossible: {
    labelKey: 'difficulty.impossible.label',
    descriptionKey: 'difficulty.impossible.description',
    maxWrongGuesses: 3,
    multiplier: 2.8,
  },
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const NORWEGIAN_ALPHABET_EXT = ['Æ', 'Ø', 'Å']
export const MAX_LEADERBOARD_ENTRIES = 15

