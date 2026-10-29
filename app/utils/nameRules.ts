// Namensgenerator: Regeln, Stile und Varianten. Wird im Browser (Regel-Check, Varianten) und auf dem Server
// (Prüfung der KI-Namen) genutzt. Regeln nach Blizzard: je Namensteil 2–12 Buchstaben, Akzente erlaubt,
// keine Leer-, Sonder- oder Satzzeichen, nur der erste Buchstabe groß, kein Buchstabe dreimal hintereinander.
export const nameStyles = ['epic', 'dark', 'lore', 'funny'] as const
export type NameStyle = typeof nameStyles[number]
export const nameGenders = ['f', 'm'] as const
export type NameGender = typeof nameGenders[number]
export type SurnameLang = 'en' | 'de'

export type NameProblem = 'length' | 'letters' | 'case' | 'triple' | 'blocked'

// Lore-Figuren, Tolkien und Wörter, die nicht als Vorschlag erscheinen sollen (Vergleich in Kleinbuchstaben)
const blocked = new Set([
  'thrall', 'jaina', 'arthas', 'sylvanas', 'illidan', 'tyrande', 'malfurion', 'anduin', 'varian', 'uther', 'lothar', 'medivh',
  'khadgar', 'garrosh', 'vol\'jin', 'voljin', 'baine', 'cairne', 'rexxar', 'kael', 'kaelthas', 'alleria', 'vereesa', 'magni',
  'muradin', 'genn', 'velen', 'tirion', 'bolvar', 'alexstrasza', 'ysera', 'nozdormu', 'deathwing', 'neltharion', 'sargeras',
  'kiljaeden', 'archimonde', 'azshara', 'xalatath', 'thalyssra', 'lorthemar', 'liadrin', 'chromie', 'wrathion', 'gandalf',
  'legolas', 'aragorn', 'frodo', 'bilbo', 'gimli', 'galadriel', 'elrond', 'sauron', 'saruman', 'arwen', 'thorin',
  'windrunner', 'sunstrider', 'proudmoore', 'wrynn', 'stormrage', 'bronzebeard', 'hellscream', 'shadowsong', 'whisperwind',
  'lightbringer', 'menethil', 'greymane', 'oakenshield', 'baggins', 'ashbringer', 'doomhammer', 'bloodhoof', 'highmountain',
  'arsch', 'sex', 'hure', 'dick'
])
// Teilwörter, die in keinem Namen vorkommen dürfen (auch in Varianten mit Akzenten). Nur eindeutige Wörter,
// sonst fallen harmlose Namen raus (z. B. „arsch“ in Marschall)
const blockedParts = ['fuck', 'shit', 'cunt', 'pussy', 'nigg', 'nazi', 'hitler', 'porn', 'fick', 'fotze', 'wichs', 'schwanz', 'kacke', 'nutte']

const plain = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export const nameProblems = (part: string): NameProblem[] => {
  const out: NameProblem[] = []
  const letters = [...part]
  if (letters.length < 2 || letters.length > 12) out.push('length')
  if (!/^\p{L}+$/u.test(part) || part.includes('ß')) out.push('letters')
  else if (!/^\p{Lu}\p{Ll}*$/u.test(part)) out.push('case')
  if (/(\p{L})\1\1/u.test(part.toLowerCase())) out.push('triple')
  const p = plain(part)
  if (blocked.has(p) || blockedParts.some(b => p.includes(b))) out.push('blocked')
  return out
}

export const isValidNamePart = (part: string) => nameProblems(part).length === 0

// Schreibweise wie im Spiel: erster Buchstabe groß, Rest klein
export const normalizeName = (s: string) => {
  const t = s.trim().toLowerCase()
  return t ? t[0]!.toUpperCase() + t.slice(1) : t
}

// Abwandlungen für vergebene Retail-Namen, ohne KI: Akzent, y statt i, doppelter Konsonant, angehängter Vokal
export const nameVariants = (name: string, max = 4): string[] => {
  const n = normalizeName(name)
  const accents: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }
  const out = new Set<string>()
  // Akzent auf dem letzten Vokal (wirkt natürlicher als auf dem ersten)
  const lastVowel = [...n].map((c, i) => [c, i] as const).reverse().find(([c, i]) => i > 0 && accents[c])
  if (lastVowel) out.add(n.slice(0, lastVowel[1]) + accents[lastVowel[0]] + n.slice(lastVowel[1] + 1))
  if (/i/.test(n.slice(1))) out.add(n[0] + n.slice(1).replace('i', 'y'))
  // Konsonant zwischen zwei Vokalen verdoppeln (Velindra → Vellindra), nie am Wortanfang (sonst „Chhuvaka“)
  const cons = n.match(/(?<=[aeiouy])[lnrst](?=[aeiouy])/)
  if (cons?.index !== undefined) {
    const i = cons.index
    out.add(n.slice(0, i) + n[i] + n.slice(i))
  }
  if (/[^aeiou]$/.test(n)) out.add(n + 'a')
  else if (!n.endsWith('e')) out.add(n + 'e')
  if (/^[AEIOU]/.test(n)) out.add(n.replace(/^./, c => ({ A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' })[c] || c))
  return [...out].filter(v => v !== n && isValidNamePart(v)).slice(0, max)
}
