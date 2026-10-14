// Ersetzt Platzhalter wie [[12294]] in Inhaltsdateien durch Wowhead-Links mit dem
// offiziellen Fähigkeitsnamen in der Sprache der Datei (Namen kommen von der Wowhead-Tooltip-API).
// Aufruf: node scripts/expand-spells.mjs content/de/klassen/paladin/vergeltung.md ...
import { readFile, writeFile } from 'node:fs/promises'

const cache = new Map()
const spellName = async (id, locale) => {
  const key = `${locale}-${id}`
  if (!cache.has(key)) {
    const res = await fetch(`https://nether.wowhead.com/tooltip/spell/${id}${locale === 'de' ? '?locale=3' : ''}`)
    const data = await res.json()
    if (!data.name) throw new Error(`Spell ${id} nicht gefunden`)
    cache.set(key, data.name)
  }
  return cache.get(key)
}

for (const file of process.argv.slice(2)) {
  const locale = file.includes('/de/') ? 'de' : 'en'
  let text = await readFile(file, 'utf8')
  const ids = [...new Set([...text.matchAll(/\[\[(\d+)\]\]/g)].map(m => m[1]))]
  for (const id of ids) {
    const name = await spellName(id, locale)
    const url = `https://www.wowhead.com/${locale === 'de' ? 'de/' : ''}spell=${id}`
    text = text.replaceAll(`[[${id}]]`, `[**${name}**](${url}){target="_blank" rel="noopener"}`)
  }
  await writeFile(file, text)
  console.log(`${file}: ${ids.length} Fähigkeiten`)
}
