// Startvorrat für den Namensgenerator: aktive Namen aus der lokalen Datenbank nach server/assets/names-seed.json.
// Der Server übernimmt die Datei, wenn seine Datenbank leer ist (erster Start, neues Volume).
// Ablauf: Dev-Server mit ANTHROPIC_API_KEY starten, /_nitro/tasks/names:refill?maxNames=25000 aufrufen, dann pnpm names:export
import { DatabaseSync } from 'node:sqlite'
import { writeFileSync } from 'node:fs'

const db = new DatabaseSync(process.env.NAMES_DB_PATH || '.data/names.sqlite', { readOnly: true })
const rows = db.prepare('SELECT game, race, gender, style, lang, first, last FROM names WHERE retired = 0 ORDER BY id').all()
writeFileSync('server/assets/names-seed.json', JSON.stringify(rows.map(r => ({ ...r }))))
const byGame = Object.groupBy(rows, r => `${r.game}${r.lang ? `/${r.lang}` : ''}`)
console.log(`[names] ${rows.length} Namen exportiert:`, Object.fromEntries(Object.entries(byGame).map(([k, v]) => [k, v.length])))
