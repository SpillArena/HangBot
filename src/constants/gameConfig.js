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
    description: 'Longest, toughest dictionary words.',
  },
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
export const MAX_LEADERBOARD_ENTRIES = 15

