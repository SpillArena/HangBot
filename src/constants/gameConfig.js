export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Easy',
    maxWrongGuesses: 8,
    multiplier: 1,
    description: 'More attempts and direct hints.',
  },
  medium: {
    label: 'Medium',
    maxWrongGuesses: 7,
    multiplier: 1.35,
    description: 'Balanced challenge and score gain.',
  },
  hard: {
    label: 'Hard',
    maxWrongGuesses: 6,
    multiplier: 1.7,
    description: 'Fewer attempts and tougher words.',
  },
  insane: {
    label: 'Insane',
    maxWrongGuesses: 5,
    multiplier: 2.1,
    description: 'Longer, tougher dictionary words.',
  },
  impossible: {
    label: 'Impossible',
    maxWrongGuesses: 3,
    multiplier: 2.8,
    description: 'The longest, toughest dictionary words with only 3 attempts.',
  },
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const NORWEGIAN_ALPHABET_EXT = ['Æ', 'Ø', 'Å']
export const MAX_LEADERBOARD_ENTRIES = 15

