// Bilder für die Volksauswahl im Namensgenerator: Volks-Icons aus der Charaktererstellung (weiblich/männlich, 128 px)
// und die Heimat als Hintergrund (Blizzard-Volksseiten, hochkant fürs Handy und breit für Desktop).
// Himmelsgeborene haben kein offizielles Icon, dort ein Ausschnitt aus skyborne/factions.webp.
import type { NameGender } from './nameRules'

export const racePortrait = (id: string, gender: NameGender = 'f') => {
  if (id.startsWith('skyborne')) return '/images/race-icons/skyborne-m.webp'
  return `/images/race-icons/${id}-${gender}.webp`
}

// Völker mit eigener Heimat-Szene in public/images/race-scenes (<id>-tall.webp, <id>-wide.webp)
const ownScene = new Set(['human', 'dwarf', 'nightelf', 'gnome', 'draenei', 'worgen', 'orc', 'undead', 'tauren', 'troll', 'bloodelf', 'goblin',
  'voidelf', 'lightforged', 'darkiron', 'kultiran', 'mechagnome', 'nightborne', 'highmountain', 'maghar', 'zandalari', 'vulpera',
  // neutrale Völker (Blizzard-Seite „<volk>-alliance“): Pandaria, Dornogal, Dracheninseln, Harandar
  'pandaren', 'earthen', 'dracthyr', 'haranir'])
// Ohne Blizzard-Volksseite: passende Landschaft aus public/images/hero
const heroScene: Record<string, string> = { 'skyborne-alliance': 'skyborne', 'skyborne-horde': 'skyborne' }

export const raceScene = (id: string) => ownScene.has(id)
  ? { tall: `/images/race-scenes/${id}-tall.webp`, wide: `/images/race-scenes/${id}-wide.webp` }
  : { tall: `/images/hero/${heroScene[id] ?? 'dustwallow'}-800.webp`, wide: `/images/hero/${heroScene[id] ?? 'dustwallow'}.webp` }
