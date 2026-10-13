// Klassenvergleich: Paarungen, URLs und die aus den Klassendaten abgeleiteten Unterschiede
import type { ClassInfo, GameMode, Locale, Role } from './classInfo'
import { getClassList, getClassInfo, classRoles } from './classInfo'
import { racesForClass } from './races'

// Paare mit Suchvolumen (Ubersuggest, Oktober 2026) kommen in den Index, alle anderen sind noindex
export const indexedPairs: Record<GameMode, [string, string][]> = {
  retail: [['mage', 'warlock'], ['warrior', 'paladin']],
  forever: [['mage', 'warlock']]
}

// Feste Reihenfolge nach Klassenliste, damit es pro Paar nur eine URL gibt
export const orderedPair = (a: string, b: string, mode: GameMode): [string, string] => {
  const ids = getClassList(mode).map(c => c.id)
  return ids.indexOf(a) <= ids.indexOf(b) ? [a, b] : [b, a]
}

export const pairSlug = (a: string, b: string, mode: GameMode, locale: Locale) => {
  const [x, y] = orderedPair(a, b, mode)
  return `${getClassInfo(x, mode)!.slug[locale]}-vs-${getClassInfo(y, mode)!.slug[locale]}`
}

export const parsePairSlug = (slug: string, mode: GameMode, locale: Locale): [ClassInfo, ClassInfo] | null => {
  const [sa, sb] = slug.split('-vs-')
  const list = getClassList(mode)
  const a = list.find(c => c.slug[locale] === sa)
  const b = list.find(c => c.slug[locale] === sb)
  if (!a || !b || a.id === b.id) return null
  const [x, y] = orderedPair(a.id, b.id, mode)
  return x === a.id && y === b.id ? [a, b] : null
}

// Paar unabhängig von der Reihenfolge, z. B. für eine Umleitung von „hexenmeister-vs-magier“
export const parsePairSlugAnyOrder = (slug: string, mode: GameMode, locale: Locale): [ClassInfo, ClassInfo] | null => {
  const [sa, sb] = slug.split('-vs-')
  const list = getClassList(mode)
  const a = list.find(c => c.slug[locale] === sa)
  const b = list.find(c => c.slug[locale] === sb)
  return a && b && a.id !== b.id ? [a, b] : null
}

export const isIndexedPair = (a: string, b: string, mode: GameMode) =>
  indexedPairs[mode].some(([x, y]) => (x === a && y === b) || (x === b && y === a))

export const allPairs = (mode: GameMode): [string, string][] => {
  const ids = getClassList(mode).map(c => c.id)
  return ids.flatMap((a, i) => ids.slice(i + 1).map(b => [a, b] as [string, string]))
}

export const ranges = (c: ClassInfo) => [...new Set(c.specs.filter(s => s.role === 'dps').map(s => s.range))]

// Unterschiede als Fakten, die Texte entstehen in der Komponente per i18n
export interface CompareFacts {
  onlyRoles: { classId: string, roles: Role[] }[]
  sameRoles: boolean
  rangeA: string[]
  rangeB: string[]
  sameArmor: boolean
  easier: string | null
  betterSolo: string | null
  racesA: number
  racesB: number
}

export const compareFacts = (a: ClassInfo, b: ClassInfo, mode: GameMode): CompareFacts => {
  const ra = classRoles(a)
  const rb = classRoles(b)
  return {
    onlyRoles: [
      { classId: a.id, roles: ra.filter(r => !rb.includes(r)) },
      { classId: b.id, roles: rb.filter(r => !ra.includes(r)) }
    ].filter(x => x.roles.length),
    sameRoles: ra.length === rb.length && ra.every(r => rb.includes(r)),
    rangeA: ranges(a),
    rangeB: ranges(b),
    sameArmor: a.armor === b.armor,
    easier: a.difficulty === b.difficulty ? null : (a.difficulty < b.difficulty ? a.id : b.id),
    betterSolo: a.solo === b.solo ? null : (a.solo > b.solo ? a.id : b.id),
    racesA: racesForClass(a.id, mode).length,
    racesB: racesForClass(b.id, mode).length
  }
}
