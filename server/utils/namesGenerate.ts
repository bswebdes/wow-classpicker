// Nachschub für den Namensvorrat über Claude Haiku 5.5 (Blindtest 29.10.2026: Haiku 4:1 vor Sonnet).
// Läuft nur im nächtlichen Job, nie auf Nutzeranfrage. Füllt jede Kombination auf TARGET auf,
// sobald sie unter REFILL_BELOW fällt; höchstens maxNames pro Lauf (Kostendeckel).
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { retailRaces } from '~~/app/utils/retailRaces'
import { foreverRaces } from '~~/app/utils/foreverInfo'
import { isValidNamePart, nameGenders, nameStyles, normalizeName, type NameStyle } from '~~/app/utils/nameRules'
import { activeCounts, applyReview, comboKey, insertNames, logRefill, recentNames, reportedNames, type NameCombo, type SeedName } from './namesDb'

const MODEL = 'claude-haiku-5-5'
const TARGET = 60
const REFILL_BELOW = 0.4
const PER_REQUEST = 25
const CONCURRENCY = 6

export const allCombos = (): NameCombo[] => [
  ...retailRaces.flatMap(r => nameGenders.flatMap(gender => nameStyles.map(style =>
    ({ game: 'retail' as const, race: r.id, gender, style, lang: '' as const })))),
  ...foreverRaces.flatMap(r => nameGenders.flatMap(gender => nameStyles.flatMap(style =>
    (['en', 'de'] as const).map(lang => ({ game: 'forever' as const, race: r.id, gender, style, lang })))))
]

const styleText: Record<NameStyle, string> = {
  epic: 'epic and heroic',
  dark: 'dark and mysterious',
  lore: 'lore-friendly, sounds like it truly belongs in Azeroth',
  funny: 'playful and witty, a clever pun or fun sound that fits WoW humour, but clean and family friendly (no innuendo)'
}

const raceName = (c: NameCombo) =>
  (c.game === 'forever' ? foreverRaces : retailRaces).find(r => r.id === c.race)?.name.en ?? c.race

const prompt = (c: NameCombo, avoid: string[]) => {
  const letters = 'ABCDEFGHIJKLMNOPRSTVWYZ'.split('').sort(() => Math.random() - 0.5).slice(0, 10).join(', ')
  const surname = c.game === 'forever'
    ? (c.lang === 'de'
        ? 'Give each a fantasy first name and a fitting GERMAN surname: one compound German word in the style of the German WoW translation (like Sturmhammer, Mondflüsterer, Eisenbart, Dämmerweber). Umlauts ä ö ü are fine, never use ß. The surname must be at most 12 letters, so prefer short compounds.'
        : 'Give each a first name and a fitting English surname, usually a compound word (like Duskweaver, Stormhammer, Ashgrove), at most 12 letters.')
      + ' Every surname must be different.'
    : 'First names only, set last to null. This is for retail WoW, where short and common names have been taken on most realms for 20 years: make them distinctive, mostly 6 to 12 letters, with unusual but pronounceable syllable combinations. Avoid real words and very common fantasy names (Luna, Aria, Kira, Nova, Raven, Shadow and the like).'
  return `Invent ${PER_REQUEST} original character names for ${c.game === 'forever' ? 'WoW Forever (Classic+, every character has a first name AND a surname)' : 'World of Warcraft retail (Midnight)'}.
Race: ${raceName(c)}. Gender: ${c.gender === 'f' ? 'female' : 'male'}. Style: ${styleText[c.style]}.
${surname}
Make them varied in length, sound and rhythm. Start the first names with different letters, mostly from: ${letters}.
Name rules: each name part 2-12 letters, letters only (accented letters like é or ö are allowed), no spaces, hyphens, apostrophes, numbers or symbols, first letter capital and the rest lowercase, no letter three times in a row.
Do not use existing lore characters or famous family names from Warcraft (Windrunner, Proudmoore, Stormrage and the like), names from Tolkien or other franchises, real celebrities, or anything offensive, including disguised spellings of swear words.${avoid.length ? `\nThese already exist, do not repeat them or their surnames: ${avoid.join(', ')}` : ''}`
}

const Schema = z.object({ names: z.array(z.object({ first: z.string(), last: z.string().nullable() })) })

const generate = async (client: Anthropic, c: NameCombo) => {
  const avoid = recentNames(c).map(n => n.last ? `${n.first} ${n.last}` : n.first)
  const r = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'low', format: zodOutputFormat(Schema) },
    messages: [{ role: 'user', content: prompt(c, avoid) }]
  })
  const rows: SeedName[] = (r.parsed_output?.names ?? []).flatMap((n) => {
    const first = normalizeName(n.first)
    const last = c.game === 'forever' ? normalizeName(n.last ?? '') : ''
    if (!isValidNamePart(first) || (c.game === 'forever' && !isValidNamePart(last))) return []
    return [{ ...c, first, last }]
  })
  return { rows, usage: r.usage }
}

// Läuft parallel mit begrenzter Zahl gleichzeitiger Anfragen
const pool = async <T>(items: T[], worker: (item: T) => Promise<void>) => {
  const queue = [...items]
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await worker(queue.shift()!)
  }))
}

export const refillNames = async ({ maxNames = 3000 }: { maxNames?: number } = {}) => {
  if (!process.env.ANTHROPIC_API_KEY) return { skipped: 'ANTHROPIC_API_KEY fehlt' }
  const counts = await activeCounts()
  // Leerste Kombinationen zuerst, damit ein gedeckelter Lauf die dringendsten auffüllt
  const jobs = allCombos()
    .map(c => ({ c, n: counts.get(comboKey(c)) ?? 0 }))
    .filter(j => j.n < TARGET * REFILL_BELOW)
    .sort((a, b) => a.n - b.n)
    .flatMap(j => Array.from({ length: Math.ceil((TARGET - j.n) / PER_REQUEST) }, () => j.c))
    .slice(0, Math.ceil(maxNames / PER_REQUEST))

  const client = new Anthropic()
  const stats = { requests: jobs.length, added: 0, input_tokens: 0, output_tokens: 0, errors: 0 }
  await pool(jobs, async (c) => {
    try {
      const { rows, usage } = await generate(client, c)
      stats.added += insertNames(rows)
      stats.input_tokens += usage.input_tokens
      stats.output_tokens += usage.output_tokens
    }
    catch (e) {
      stats.errors++
      console.error('[names] Nachschub fehlgeschlagen', comboKey(c), e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e)
    }
  })
  logRefill({ requested: jobs.length * PER_REQUEST, added: stats.added, input_tokens: stats.input_tokens, output_tokens: stats.output_tokens, note: stats.errors ? `${stats.errors} Fehler` : undefined })
  return stats
}

// Gemeldete Namen prüfen: Haiku entscheidet, welche wirklich unpassend sind; nur die fliegen raus
const ReviewSchema = z.object({ remove: z.array(z.number()) })

export const reviewReported = async () => {
  if (!process.env.ANTHROPIC_API_KEY) return { skipped: 'ANTHROPIC_API_KEY fehlt' }
  const list = reportedNames()
  if (!list.length) return { reviewed: 0, removed: 0 }
  const r = await new Anthropic().messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'low', format: zodOutputFormat(ReviewSchema) },
    messages: [{ role: 'user', content: `Visitors of a World of Warcraft name generator reported these suggested character names as unsuitable. Decide which ones really have to go: offensive, sexual or hateful content (also disguised or misspelled, in English or German), names of real people, existing major Warcraft lore characters or famous names from other franchises. Unusual, silly or simply disliked names are fine and stay.
Return only the ids that have to go.
${list.map(n => `${n.id}: ${n.last ? `${n.first} ${n.last}` : n.first}`).join('\n')}` }]
  })
  const ids = new Set(list.map(n => n.id))
  const remove = (r.parsed_output?.remove ?? []).filter(id => ids.has(id))
  applyReview(remove, list.map(n => n.id).filter(id => !remove.includes(id)))
  return { reviewed: list.length, removed: remove.length }
}
