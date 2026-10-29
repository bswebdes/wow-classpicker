// Namensvorrat in SQLite (node:sqlite, in Node 24 eingebaut). Nutzer lesen nur hier, die KI füllt nachts nach
// (server/tasks/names/refill.ts). Datei unter NAMES_DB_PATH, auf dem Server ein Docker-Volume.
// Ist die Datenbank leer, wird der Startvorrat aus server/assets/names-seed.json übernommen.
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { NameGender, NameStyle, SurnameLang } from '~~/app/utils/nameRules'

export type NameGame = 'retail' | 'forever'
export interface NameCombo { game: NameGame, race: string, gender: NameGender, style: NameStyle, lang: SurnameLang | '' }
export interface NameRow { id: number, first: string, last: string }
export interface SeedName extends NameCombo { first: string, last: string }

// Ab so vielen Kopien gilt ein Name als wahrscheinlich vergeben; Forever-Namen sind regionweit einzigartig
const RETIRE_COPIES: Record<NameGame, number> = { forever: 3, retail: 5 }
// Meldungen entfernen nie direkt: ab so vielen Meldungen prüft der nächtliche Job den Name (reviewed = 1: schon als ok geprüft)
export const REVIEW_REPORTS = { new: 2, reviewed: 5 }
// Ein Nachname darf höchstens so oft vorkommen, sonst sehen alle dieselben Nachnamen
export const MAX_SURNAME_USES = 2

let db: DatabaseSync | undefined
let seeding: Promise<void> | undefined

const open = () => {
  if (db) return db
  const path = resolve(process.env.NAMES_DB_PATH || '.data/names.sqlite')
  mkdirSync(dirname(path), { recursive: true })
  db = new DatabaseSync(path)
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS names (
      id INTEGER PRIMARY KEY,
      game TEXT NOT NULL, race TEXT NOT NULL, gender TEXT NOT NULL, style TEXT NOT NULL, lang TEXT NOT NULL DEFAULT '',
      first TEXT NOT NULL, last TEXT NOT NULL DEFAULT '',
      copies INTEGER NOT NULL DEFAULT 0, reports INTEGER NOT NULL DEFAULT 0, retired INTEGER NOT NULL DEFAULT 0,
      reviewed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (game, first, last)
    );
    CREATE INDEX IF NOT EXISTS names_combo ON names (game, race, gender, style, lang, retired);
    CREATE INDEX IF NOT EXISTS names_last ON names (game, lang, last);
    CREATE TABLE IF NOT EXISTS refills (
      id INTEGER PRIMARY KEY, started_at TEXT NOT NULL DEFAULT (datetime('now')),
      requested INTEGER, added INTEGER, input_tokens INTEGER, output_tokens INTEGER, note TEXT
    );
  `)
  // Spalte kam nach den ersten Testläufen dazu
  const cols = (db.prepare('PRAGMA table_info(names)').all() as { name: string }[]).map(c => c.name)
  if (!cols.includes('reviewed')) db.exec('ALTER TABLE names ADD COLUMN reviewed INTEGER NOT NULL DEFAULT 0')
  return db
}

// Startvorrat beim ersten Zugriff übernehmen (nur wenn die Tabelle leer ist)
const ensureSeeded = async () => {
  const d = open()
  if ((d.prepare('SELECT count(*) AS n FROM names').get() as { n: number }).n > 0) return d
  seeding ||= (async () => {
    const seed = await useStorage('assets:server').getItem<SeedName[]>('names-seed.json')
    if (seed?.length) insertNames(seed)
  })()
  await seeding
  return d
}

export const insertNames = (rows: SeedName[]) => {
  const d = open()
  const surnameUses = d.prepare('SELECT count(*) AS n FROM names WHERE game = ? AND lang = ? AND last = ?')
  const insert = d.prepare(`INSERT OR IGNORE INTO names (game, race, gender, style, lang, first, last) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  let added = 0
  d.exec('BEGIN')
  try {
    for (const r of rows) {
      if (r.last && (surnameUses.get(r.game, r.lang, r.last) as { n: number }).n >= MAX_SURNAME_USES) continue
      added += Number(insert.run(r.game, r.race, r.gender, r.style, r.lang, r.first, r.last).changes)
    }
    d.exec('COMMIT')
  }
  catch (e) {
    d.exec('ROLLBACK')
    throw e
  }
  return added
}

type Filter = Partial<Omit<NameCombo, 'game'>> & { game: NameGame }
const where = (f: Filter) => {
  const parts = ['game = ?']
  const args: string[] = [f.game]
  for (const key of ['race', 'gender', 'style'] as const) {
    if (f[key]) { parts.push(`${key} = ?`); args.push(f[key]!) }
  }
  parts.push('lang = ?')
  args.push(f.lang ?? '')
  return { sql: parts.join(' AND '), args }
}

// Zufällige Namen; schon gezeigte (exclude) nur, wenn sonst nichts mehr da ist.
// Notfallnetz: erst ausgemusterte derselben Auswahl, dann derselbe Filter ohne Stil.
export const pickNames = async (f: Filter, exclude: number[], limit = 10): Promise<NameRow[]> => {
  const d = await ensureSeeded()
  const out: NameRow[] = []
  const seen = new Set(exclude)
  const take = (filter: Filter, retired: boolean) => {
    const w = where(filter)
    const skip = [...seen].slice(-300)
    const notIn = skip.length ? ` AND id NOT IN (${skip.map(() => '?').join(',')})` : ''
    const rows = d.prepare(`SELECT id, first, last FROM names WHERE ${w.sql} AND retired = ?${notIn} ORDER BY random() LIMIT ?`)
      .all(...w.args, retired ? 1 : 0, ...skip, limit - out.length) as unknown as NameRow[]
    for (const r of rows) { out.push(r); seen.add(r.id) }
  }
  take(f, false)
  if (out.length < limit) take(f, true)
  if (out.length < limit && f.style) take({ ...f, style: undefined }, false)
  return out
}

// Nachnamen zu einem eigenen Vornamen: aus dem Forever-Vorrat, ohne Kombinationen, die es schon gibt
export const pickSurnames = async (f: Filter, first: string, limit = 10): Promise<string[]> => {
  const d = await ensureSeeded()
  const w = where({ ...f, gender: undefined })
  const rows = d.prepare(`SELECT DISTINCT last FROM names WHERE ${w.sql} AND retired = 0 AND last != '' ORDER BY random() LIMIT ?`)
    .all(...w.args, limit * 3) as { last: string }[]
  const taken = d.prepare('SELECT 1 FROM names WHERE game = ? AND first = ? AND last = ?')
  return rows.map(r => r.last).filter(l => !taken.get(f.game, first, l)).slice(0, limit)
}

export const markName = async (id: number, action: 'copy' | 'report') => {
  const d = await ensureSeeded()
  const row = d.prepare('SELECT game FROM names WHERE id = ?').get(id) as { game: NameGame } | undefined
  if (!row) return false
  if (action === 'copy') {
    d.prepare('UPDATE names SET copies = copies + 1, retired = CASE WHEN copies + 1 >= ? THEN 1 ELSE retired END WHERE id = ?')
      .run(RETIRE_COPIES[row.game], id)
  }
  else d.prepare('UPDATE names SET reports = reports + 1 WHERE id = ?').run(id)
  return true
}

// Gemeldete Namen, die geprüft werden müssen (für den nächtlichen Job)
export const reportedNames = (limit = 200) => open().prepare(
  `SELECT id, game, race, first, last FROM names WHERE retired = 0
   AND reports >= CASE WHEN reviewed = 1 THEN ? ELSE ? END ORDER BY reports DESC LIMIT ?`
).all(REVIEW_REPORTS.reviewed, REVIEW_REPORTS.new, limit) as unknown as (NameRow & { game: NameGame, race: string })[]

// Ergebnis der Prüfung: unpassende raus, die übrigen als geprüft markieren und Zähler zurücksetzen
export const applyReview = (remove: number[], keep: number[]) => {
  const d = open()
  const out = d.prepare('UPDATE names SET retired = 1 WHERE id = ?')
  const ok = d.prepare('UPDATE names SET reviewed = 1, reports = 0 WHERE id = ?')
  d.exec('BEGIN')
  for (const id of remove) out.run(id)
  for (const id of keep) ok.run(id)
  d.exec('COMMIT')
}

// Aktive Namen je Kombination, für den Nachfüll-Job
export const activeCounts = async () => {
  const d = await ensureSeeded()
  const rows = d.prepare(`SELECT game, race, gender, style, lang, count(*) AS n FROM names WHERE retired = 0 GROUP BY game, race, gender, style, lang`).all() as unknown as (NameCombo & { n: number })[]
  return new Map(rows.map(r => [comboKey(r), r.n]))
}

export const recentNames = (c: NameCombo, limit = 60) => (open().prepare(
  `SELECT first, last FROM names WHERE game = ? AND race = ? AND gender = ? AND style = ? AND lang = ? ORDER BY id DESC LIMIT ?`
).all(c.game, c.race, c.gender, c.style, c.lang, limit) as { first: string, last: string }[])

export const logRefill = (r: { requested: number, added: number, input_tokens: number, output_tokens: number, note?: string }) =>
  open().prepare('INSERT INTO refills (requested, added, input_tokens, output_tokens, note) VALUES (?, ?, ?, ?, ?)')
    .run(r.requested, r.added, r.input_tokens, r.output_tokens, r.note ?? null)

export const comboKey = (c: NameCombo) => [c.game, c.race, c.gender, c.style, c.lang].join('|')
