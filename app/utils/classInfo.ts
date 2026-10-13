// Zentrale Klassendaten für Klassenseiten, Quiz und Zufallsgenerator.
// Spielwerte für den Arena-Kampf liegen weiterhin in composables/useBattle.ts.

export type Role = 'tank' | 'healer' | 'dps'
export type Range = 'melee' | 'ranged'
export type Armor = 'plate' | 'mail' | 'leather' | 'cloth'
export type Locale = 'de' | 'en'

export interface SpecInfo {
  id: string
  role: Role
  range: Range
  name: Record<Locale, string>
}

export interface ClassInfo {
  id: string
  color: string
  icon: string
  armor: Armor
  slug: Record<Locale, string>
  // Unsere Einschätzung, 1 (niedrig) bis 5 (hoch)
  difficulty: number
  solo: number
  specs: SpecInfo[]
}

const spec = (id: string, role: Role, range: Range, de: string, en: string): SpecInfo =>
  ({ id, role, range, name: { de, en } })

export const classInfo: ClassInfo[] = [
  {
    id: 'warrior', color: '#C69B6D', icon: '/class-icons/ClassIcon_warrior.webp', armor: 'plate',
    slug: { de: 'krieger', en: 'warrior' }, difficulty: 2, solo: 4,
    specs: [
      spec('arms', 'dps', 'melee', 'Waffen', 'Arms'),
      spec('fury', 'dps', 'melee', 'Furor', 'Fury'),
      spec('protection', 'tank', 'melee', 'Schutz', 'Protection')
    ]
  },
  {
    id: 'paladin', color: '#F48CBA', icon: '/class-icons/ClassIcon_paladin.webp', armor: 'plate',
    slug: { de: 'paladin', en: 'paladin' }, difficulty: 2, solo: 5,
    specs: [
      spec('holy', 'healer', 'melee', 'Heilig', 'Holy'),
      spec('protection', 'tank', 'melee', 'Schutz', 'Protection'),
      spec('retribution', 'dps', 'melee', 'Vergeltung', 'Retribution')
    ]
  },
  {
    id: 'hunter', color: '#AAD372', icon: '/class-icons/ClassIcon_hunter.webp', armor: 'mail',
    slug: { de: 'jaeger', en: 'hunter' }, difficulty: 1, solo: 5,
    specs: [
      spec('beastmastery', 'dps', 'ranged', 'Tierherrschaft', 'Beast Mastery'),
      spec('marksmanship', 'dps', 'ranged', 'Treffsicherheit', 'Marksmanship'),
      spec('survival', 'dps', 'melee', 'Überleben', 'Survival')
    ]
  },
  {
    id: 'rogue', color: '#FFF468', icon: '/class-icons/ClassIcon_rogue.webp', armor: 'leather',
    slug: { de: 'schurke', en: 'rogue' }, difficulty: 4, solo: 3,
    specs: [
      spec('assassination', 'dps', 'melee', 'Meucheln', 'Assassination'),
      spec('outlaw', 'dps', 'melee', 'Gesetzlosigkeit', 'Outlaw'),
      spec('subtlety', 'dps', 'melee', 'Täuschung', 'Subtlety')
    ]
  },
  {
    id: 'priest', color: '#FFFFFF', icon: '/class-icons/ClassIcon_priest.webp', armor: 'cloth',
    slug: { de: 'priester', en: 'priest' }, difficulty: 3, solo: 2,
    specs: [
      spec('discipline', 'healer', 'ranged', 'Disziplin', 'Discipline'),
      spec('holy', 'healer', 'ranged', 'Heilig', 'Holy'),
      spec('shadow', 'dps', 'ranged', 'Schatten', 'Shadow')
    ]
  },
  {
    id: 'deathknight', color: '#C41E3A', icon: '/class-icons/ClassIcon_deathknight.webp', armor: 'plate',
    slug: { de: 'todesritter', en: 'death-knight' }, difficulty: 2, solo: 5,
    specs: [
      spec('blood', 'tank', 'melee', 'Blut', 'Blood'),
      spec('frost', 'dps', 'melee', 'Frost', 'Frost'),
      spec('unholy', 'dps', 'melee', 'Unheilig', 'Unholy')
    ]
  },
  {
    id: 'shaman', color: '#0070DD', icon: '/class-icons/ClassIcon_shaman.webp', armor: 'mail',
    slug: { de: 'schamane', en: 'shaman' }, difficulty: 3, solo: 3,
    specs: [
      spec('elemental', 'dps', 'ranged', 'Elementar', 'Elemental'),
      spec('enhancement', 'dps', 'melee', 'Verstärkung', 'Enhancement'),
      spec('restoration', 'healer', 'ranged', 'Wiederherstellung', 'Restoration')
    ]
  },
  {
    id: 'mage', color: '#3FC7EB', icon: '/class-icons/ClassIcon_mage.webp', armor: 'cloth',
    slug: { de: 'magier', en: 'mage' }, difficulty: 3, solo: 3,
    specs: [
      spec('arcane', 'dps', 'ranged', 'Arkan', 'Arcane'),
      spec('fire', 'dps', 'ranged', 'Feuer', 'Fire'),
      spec('frost', 'dps', 'ranged', 'Frost', 'Frost')
    ]
  },
  {
    id: 'warlock', color: '#8788EE', icon: '/class-icons/ClassIcon_warlock.webp', armor: 'cloth',
    slug: { de: 'hexenmeister', en: 'warlock' }, difficulty: 3, solo: 4,
    specs: [
      spec('affliction', 'dps', 'ranged', 'Gebrechen', 'Affliction'),
      spec('demonology', 'dps', 'ranged', 'Dämonologie', 'Demonology'),
      spec('destruction', 'dps', 'ranged', 'Zerstörung', 'Destruction')
    ]
  },
  {
    id: 'monk', color: '#00FF98', icon: '/class-icons/ClassIcon_monk.webp', armor: 'leather',
    slug: { de: 'moench', en: 'monk' }, difficulty: 4, solo: 4,
    specs: [
      spec('brewmaster', 'tank', 'melee', 'Braumeister', 'Brewmaster'),
      spec('mistweaver', 'healer', 'melee', 'Nebelwirker', 'Mistweaver'),
      spec('windwalker', 'dps', 'melee', 'Windläufer', 'Windwalker')
    ]
  },
  {
    id: 'druid', color: '#FF7C0A', icon: '/class-icons/ClassIcon_druid.webp', armor: 'leather',
    slug: { de: 'druide', en: 'druid' }, difficulty: 4, solo: 4,
    specs: [
      spec('balance', 'dps', 'ranged', 'Gleichgewicht', 'Balance'),
      spec('feral', 'dps', 'melee', 'Wildheit', 'Feral'),
      spec('guardian', 'tank', 'melee', 'Wächter', 'Guardian'),
      spec('restoration', 'healer', 'ranged', 'Wiederherstellung', 'Restoration')
    ]
  },
  {
    id: 'demonhunter', color: '#A330C9', icon: '/class-icons/ClassIcon_demon_hunter.webp', armor: 'leather',
    slug: { de: 'daemonenjaeger', en: 'demon-hunter' }, difficulty: 2, solo: 4,
    specs: [
      spec('havoc', 'dps', 'melee', 'Verwüstung', 'Havoc'),
      spec('vengeance', 'tank', 'melee', 'Rachsucht', 'Vengeance'),
      spec('devourer', 'dps', 'ranged', 'Verschlinger', 'Devourer')
    ]
  },
  {
    id: 'evoker', color: '#33937F', icon: '/class-icons/ClassIcon_evoker.webp', armor: 'mail',
    slug: { de: 'rufer', en: 'evoker' }, difficulty: 3, solo: 3,
    specs: [
      spec('devastation', 'dps', 'ranged', 'Verheerung', 'Devastation'),
      spec('preservation', 'healer', 'ranged', 'Bewahrung', 'Preservation'),
      spec('augmentation', 'dps', 'ranged', 'Verstärkung', 'Augmentation')
    ]
  }
]

export const getClassInfo = (id: string) => classInfo.find(c => c.id === id)

export const getClassBySlug = (slug: string, locale: Locale) =>
  classInfo.find(c => c.slug[locale] === slug)

export const classRoles = (c: ClassInfo): Role[] =>
  (['tank', 'healer', 'dps'] as Role[]).filter(r => c.specs.some(s => s.role === r))
