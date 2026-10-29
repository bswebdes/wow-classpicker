// Namensgenerator: zufällige Namen aus dem Vorrat (nie live KI). Parameter: game, race, gender, style, lang, exclude
// (schon gezeigte IDs, kommagetrennt), first (eigener Vorname → passende Nachnamen, nur Forever).
import { foreverRaces } from '~~/app/utils/foreverInfo'
import { retailRaces } from '~~/app/utils/retailRaces'
import { isValidNamePart, nameGenders, nameStyles, normalizeName } from '~~/app/utils/nameRules'
import type { NameGame } from '../utils/namesDb'

const one = <T extends string>(value: unknown, allowed: readonly T[]) =>
  allowed.includes(value as T) ? value as T : undefined

export default defineEventHandler(async (event) => {
  rateLimit(event, 'names-get', 60)
  const q = getQuery(event)
  const game = one(q.game, ['retail', 'forever'] as const) ?? 'retail'
  const races = (game === 'forever' ? foreverRaces : retailRaces).map(r => r.id)
  const filter = {
    game: game as NameGame,
    race: one(q.race, races),
    gender: one(q.gender, nameGenders),
    style: one(q.style, nameStyles),
    lang: game === 'forever' ? (one(q.lang, ['en', 'de'] as const) ?? 'en') : '' as const
  }
  setResponseHeader(event, 'Cache-Control', 'no-store')

  if (game === 'forever' && typeof q.first === 'string') {
    const first = normalizeName(q.first)
    if (!isValidNamePart(first)) throw createError({ statusCode: 400, statusMessage: 'invalid first name' })
    return { surnames: await pickSurnames(filter, first) }
  }

  const exclude = String(q.exclude ?? '').split(',').map(Number).filter(n => Number.isInteger(n) && n > 0).slice(-300)
  return { names: await pickNames(filter, exclude) }
})
