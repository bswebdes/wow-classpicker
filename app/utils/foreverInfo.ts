// Daten für World of Warcraft: Forever (Start 4. November 2026, Stand Beta).
// Klassen nutzen Classic-Talentbäume, Völker-Klassen-Kombinationen laut Blizzard-Ankündigung.
import type { ClassInfo, Locale, Role, Range } from './classInfo'

// Neutrale Völker (z. B. Pandaren) wählen ihre Fraktion selbst
export type Faction = 'alliance' | 'horde' | 'neutral'

export interface RaceInfo {
  id: string
  faction: Faction
  name: Record<Locale, string>
  classes: string[]
  // Neue Kombinationen (Forever: gegenüber Classic, Retail: neu in Midnight)
  newClasses?: string[]
  // Angekündigt, aber noch nicht spielbar (nicht in classes enthalten)
  upcomingClasses?: string[]
}

const tree = (id: string, role: Role, range: Range, de: string, en: string) =>
  ({ id, role, range, name: { de, en } })

const icon = (file: string) => `/class-icons/ClassIcon_${file}.webp`

export const foreverClassInfo: ClassInfo[] = [
  {
    id: 'warrior', color: '#C69B6D', icon: icon('warrior'), armor: 'plate',
    slug: { de: 'krieger', en: 'warrior' }, difficulty: 4, solo: 2,
    specs: [
      tree('arms', 'dps', 'melee', 'Waffen', 'Arms'),
      tree('fury', 'dps', 'melee', 'Furor', 'Fury'),
      tree('protection', 'tank', 'melee', 'Schutz', 'Protection')
    ]
  },
  {
    id: 'paladin', color: '#F48CBA', icon: icon('paladin'), armor: 'plate',
    slug: { de: 'paladin', en: 'paladin' }, difficulty: 2, solo: 3,
    specs: [
      tree('holy', 'healer', 'melee', 'Heilig', 'Holy'),
      tree('protection', 'tank', 'melee', 'Schutz', 'Protection'),
      tree('retribution', 'dps', 'melee', 'Vergeltung', 'Retribution')
    ]
  },
  {
    id: 'hunter', color: '#AAD372', icon: icon('hunter'), armor: 'mail',
    slug: { de: 'jaeger', en: 'hunter' }, difficulty: 2, solo: 5,
    specs: [
      tree('beastmastery', 'dps', 'ranged', 'Tierherrschaft', 'Beast Mastery'),
      tree('marksmanship', 'dps', 'ranged', 'Treffsicherheit', 'Marksmanship'),
      tree('survival', 'dps', 'ranged', 'Überleben', 'Survival')
    ]
  },
  {
    id: 'rogue', color: '#FFF468', icon: icon('rogue'), armor: 'leather',
    slug: { de: 'schurke', en: 'rogue' }, difficulty: 3, solo: 3,
    specs: [
      tree('assassination', 'dps', 'melee', 'Meucheln', 'Assassination'),
      tree('combat', 'dps', 'melee', 'Kampf', 'Combat'),
      tree('subtlety', 'dps', 'melee', 'Täuschung', 'Subtlety')
    ]
  },
  {
    id: 'priest', color: '#FFFFFF', icon: icon('priest'), armor: 'cloth',
    slug: { de: 'priester', en: 'priest' }, difficulty: 3, solo: 3,
    specs: [
      tree('discipline', 'healer', 'ranged', 'Disziplin', 'Discipline'),
      tree('holy', 'healer', 'ranged', 'Heilig', 'Holy'),
      tree('shadow', 'dps', 'ranged', 'Schatten', 'Shadow')
    ]
  },
  {
    id: 'shaman', color: '#0070DD', icon: icon('shaman'), armor: 'mail',
    slug: { de: 'schamane', en: 'shaman' }, difficulty: 3, solo: 4,
    specs: [
      tree('elemental', 'dps', 'ranged', 'Elementar', 'Elemental'),
      tree('enhancement', 'dps', 'melee', 'Verstärkung', 'Enhancement'),
      tree('restoration', 'healer', 'ranged', 'Wiederherstellung', 'Restoration')
    ]
  },
  {
    id: 'mage', color: '#3FC7EB', icon: icon('mage'), armor: 'cloth',
    slug: { de: 'magier', en: 'mage' }, difficulty: 3, solo: 4,
    specs: [
      tree('arcane', 'dps', 'ranged', 'Arkan', 'Arcane'),
      tree('fire', 'dps', 'ranged', 'Feuer', 'Fire'),
      tree('frost', 'dps', 'ranged', 'Frost', 'Frost')
    ]
  },
  {
    id: 'warlock', color: '#8788EE', icon: icon('warlock'), armor: 'cloth',
    slug: { de: 'hexenmeister', en: 'warlock' }, difficulty: 3, solo: 5,
    specs: [
      tree('affliction', 'dps', 'ranged', 'Gebrechen', 'Affliction'),
      tree('demonology', 'dps', 'ranged', 'Dämonologie', 'Demonology'),
      tree('destruction', 'dps', 'ranged', 'Zerstörung', 'Destruction')
    ]
  },
  {
    id: 'druid', color: '#FF7C0A', icon: icon('druid'), armor: 'leather',
    slug: { de: 'druide', en: 'druid' }, difficulty: 4, solo: 4,
    specs: [
      tree('balance', 'dps', 'ranged', 'Gleichgewicht', 'Balance'),
      tree('feral-bear', 'tank', 'melee', 'Wilder Kampf (Bär)', 'Feral Combat (Bear)'),
      tree('feral-cat', 'dps', 'melee', 'Wilder Kampf (Katze)', 'Feral Combat (Cat)'),
      tree('restoration', 'healer', 'ranged', 'Wiederherstellung', 'Restoration')
    ]
  }
]

export const foreverRaces: RaceInfo[] = [
  { id: 'human', faction: 'alliance', name: { de: 'Mensch', en: 'Human' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'mage', 'warlock'], newClasses: ['hunter'] },
  { id: 'dwarf', faction: 'alliance', name: { de: 'Zwerg', en: 'Dwarf' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman'], newClasses: ['shaman'] },
  { id: 'nightelf', faction: 'alliance', name: { de: 'Nachtelf', en: 'Night Elf' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'druid'] },
  { id: 'gnome', faction: 'alliance', name: { de: 'Gnom', en: 'Gnome' }, classes: ['warrior', 'rogue', 'priest', 'mage', 'warlock'], newClasses: ['priest'] },
  { id: 'skyborne-alliance', faction: 'alliance', name: { de: 'Skyborne (High Order)', en: 'Skyborne (High Order)' }, classes: ['warrior', 'hunter', 'rogue', 'mage', 'druid'], newClasses: ['warrior', 'hunter', 'rogue', 'mage', 'druid'] },
  { id: 'orc', faction: 'horde', name: { de: 'Orc', en: 'Orc' }, classes: ['warrior', 'hunter', 'rogue', 'shaman', 'mage', 'warlock'], newClasses: ['mage'] },
  { id: 'undead', faction: 'horde', name: { de: 'Untoter', en: 'Undead' }, classes: ['warrior', 'paladin', 'rogue', 'priest', 'mage', 'warlock'], newClasses: ['paladin'] },
  { id: 'tauren', faction: 'horde', name: { de: 'Tauren', en: 'Tauren' }, classes: ['warrior', 'hunter', 'shaman', 'druid'] },
  { id: 'troll', faction: 'horde', name: { de: 'Troll', en: 'Troll' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock'], newClasses: ['warlock'] },
  { id: 'skyborne-horde', faction: 'horde', name: { de: 'Skyborne (Windshaper)', en: 'Skyborne (Windshaper)' }, classes: ['warrior', 'hunter', 'rogue', 'shaman', 'druid'], newClasses: ['warrior', 'hunter', 'rogue', 'shaman', 'druid'] }
]

