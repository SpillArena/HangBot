import { RESERVED_USERNAME_TERMS } from '../constants/reservedUsernameTerms'

const normalizeForComparison = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

const BLOCKLIST_LOWER = RESERVED_USERNAME_TERMS.map((term) => term.toLowerCase())
const BLOCKLIST_NORMALIZED = RESERVED_USERNAME_TERMS.map((term) =>
  normalizeForComparison(term),
)

export const isUsernameReserved = (username) => {
  if (typeof username !== 'string') return false

  const candidate = username.trim().toLowerCase()
  if (!candidate) return false

  const candidateNormalized = normalizeForComparison(candidate)

  const containsLower = BLOCKLIST_LOWER.some((term) => candidate.includes(term))
  if (containsLower) return true

  return BLOCKLIST_NORMALIZED.some(
    (term) => term.length > 1 && candidateNormalized.includes(term),
  )
}
