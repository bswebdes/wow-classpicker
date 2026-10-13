// Völker-Klassen-Kombinationen im aktuellen WoW (Midnight).
// Quelle: Warcraft Wiki, Vorlage „Class by race“ (abgerufen 13.10.2026), Paladin-Kombis für Patch 12.2 laut Wowhead (12.09.2026).
import type { RaceInfo } from './foreverInfo'

export const retailRaces: RaceInfo[] = [
  { id: 'dwarf', faction: 'alliance', name: { de: 'Zwerg', en: 'Dwarf' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'gnome', faction: 'alliance', name: { de: 'Gnom', en: 'Gnome' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'] },
  { id: 'human', faction: 'alliance', name: { de: 'Mensch', en: 'Human' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'] },
  { id: 'nightelf', faction: 'alliance', name: { de: 'Nachtelf', en: 'Night Elf' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk', 'druid', 'demonhunter'], upcomingClasses: ['paladin'] },
  { id: 'draenei', faction: 'alliance', name: { de: 'Draenei', en: 'Draenei' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'worgen', faction: 'alliance', name: { de: 'Worgen', en: 'Worgen' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk', 'druid'] },
  { id: 'lightforged', faction: 'alliance', name: { de: 'Lichtgeschmiedeter Draenei', en: 'Lightforged Draenei' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'] },
  { id: 'voidelf', faction: 'alliance', name: { de: 'Leerenelf', en: 'Void Elf' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk', 'demonhunter'], newClasses: ['demonhunter'] },
  { id: 'darkiron', faction: 'alliance', name: { de: 'Dunkeleisenzwerg', en: 'Dark Iron Dwarf' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'kultiran', faction: 'alliance', name: { de: 'Kul Tiraner', en: 'Kul Tiran' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk', 'druid'] },
  { id: 'mechagnome', faction: 'alliance', name: { de: 'Mechagnom', en: 'Mechagnome' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'] },
  { id: 'pandaren', faction: 'neutral', name: { de: 'Pandaren', en: 'Pandaren' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'dracthyr', faction: 'neutral', name: { de: 'Dracthyr', en: 'Dracthyr' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'mage', 'warlock', 'evoker'] },
  { id: 'earthen', faction: 'neutral', name: { de: 'Irdener', en: 'Earthen' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'haranir', faction: 'neutral', name: { de: 'Haranir', en: 'Haranir' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'monk', 'druid'], newClasses: ['warrior', 'hunter', 'rogue', 'priest', 'shaman', 'mage', 'warlock', 'monk', 'druid'] },
  { id: 'orc', faction: 'horde', name: { de: 'Orc', en: 'Orc' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'tauren', faction: 'horde', name: { de: 'Tauren', en: 'Tauren' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk', 'druid'] },
  { id: 'troll', faction: 'horde', name: { de: 'Troll', en: 'Troll' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk', 'druid'], upcomingClasses: ['paladin'] },
  { id: 'undead', faction: 'horde', name: { de: 'Untoter', en: 'Undead' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'], upcomingClasses: ['paladin'] },
  { id: 'bloodelf', faction: 'horde', name: { de: 'Blutelf', en: 'Blood Elf' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk', 'demonhunter'] },
  { id: 'goblin', faction: 'horde', name: { de: 'Goblin', en: 'Goblin' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'highmountain', faction: 'horde', name: { de: 'Hochbergtauren', en: 'Highmountain Tauren' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk', 'druid'] },
  { id: 'nightborne', faction: 'horde', name: { de: 'Nachtgeborener', en: 'Nightborne' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'mage', 'warlock', 'monk'] },
  { id: 'maghar', faction: 'horde', name: { de: "Mag'har-Orc", en: "Mag'har Orc" }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'vulpera', faction: 'horde', name: { de: 'Vulpera', en: 'Vulpera' }, classes: ['warrior', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk'] },
  { id: 'zandalari', faction: 'horde', name: { de: 'Zandalaritroll', en: 'Zandalari Troll' }, classes: ['warrior', 'paladin', 'hunter', 'rogue', 'priest', 'deathknight', 'shaman', 'mage', 'warlock', 'monk', 'druid'] }
]
