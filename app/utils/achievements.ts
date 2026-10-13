// Erfolge: kleine Belohnungen fürs Herumstöbern. Namen und Texte stehen in i18n unter achievements.list.<id>
export interface AchievementDef {
  id: string
  points: number
  icon: string
  // versteckte Erfolge zeigen ihre Beschreibung erst, wenn sie errungen sind
  secret?: boolean
}

export const achievementDefs: AchievementDef[] = [
  { id: 'first_steps', points: 5, icon: '/class-icons/ClassIcon_hunter.webp' },
  { id: 'class_tourist', points: 10, icon: '/class-icons/ClassIcon_mage.webp' },
  { id: 'all_classes', points: 25, icon: '/class-icons/ClassIcon_druid.webp' },
  { id: 'quest_done', points: 10, icon: '/class-icons/ClassIcon_paladin.webp' },
  { id: 'murloc', points: 10, icon: '/class-icons/ClassIcon_shaman.webp', secret: true },
  { id: 'arena_win', points: 10, icon: '/class-icons/ClassIcon_warrior.webp' },
  { id: 'battle_royale', points: 15, icon: '/class-icons/ClassIcon_deathknight.webp' },
  { id: 'gambler', points: 10, icon: '/class-icons/ClassIcon_rogue.webp' },
  { id: 'forever', points: 10, icon: '/class-icons/ClassIcon_priest.webp' },
  { id: 'polyglot', points: 5, icon: '/class-icons/ClassIcon_evoker.webp' },
  { id: 'reader', points: 10, icon: '/class-icons/ClassIcon_monk.webp' },
  { id: 'fine_print', points: 5, icon: '/class-icons/ClassIcon_warlock.webp', secret: true },
  { id: 'night_owl', points: 5, icon: '/class-icons/ClassIcon_demon_hunter.webp', secret: true },
  { id: 'mirror_match', points: 10, icon: '/class-icons/ClassIcon_mage.webp', secret: true },
  { id: 'comparer', points: 10, icon: '/class-icons/ClassIcon_paladin.webp' },
  { id: 'herald', points: 10, icon: '/class-icons/ClassIcon_warrior.webp' },
  { id: 'color_theory', points: 5, icon: '/class-icons/ClassIcon_priest.webp' },
  { id: 'forever_quest', points: 10, icon: '/class-icons/ClassIcon_hunter.webp' },
  { id: 'named_champion', points: 10, icon: '/class-icons/ClassIcon_rogue.webp' },
  { id: 'bookworm', points: 15, icon: '/class-icons/ClassIcon_monk.webp' }
]

export const achievementTotalPoints = achievementDefs.reduce((sum, a) => sum + a.points, 0)

// Schwellen für zählbare Erfolge
export const achievementThresholds = {
  pages: 2,
  classPages: 5,
  guides: 3,
  guidesMany: 10,
  comparisons: 3,
  rolls: 10,
  declines: 3
}
