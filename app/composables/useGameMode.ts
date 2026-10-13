import type { GameMode } from '~/utils/classInfo'

// Seiten, die es in beiden Modi gibt. Retail-Routen heißen wie die Basis,
// Forever-Routen liegen unter pages/forever/ ("forever", "forever-klassen", ...).
export const modeRoutes = ['index', 'klassen', 'klassen-slug', 'klassen-vergleich', 'quiz', 'zufall'] as const
export type ModeRoute = typeof modeRoutes[number]

export const routeNameFor = (base: ModeRoute, mode: GameMode) =>
  mode === 'forever' ? (base === 'index' ? 'forever' : `forever-${base}`) : base

export const useGameMode = () => {
  const route = useRoute()
  const getRouteBaseName = useRouteBaseName()

  const baseName = computed(() => String(getRouteBaseName(route) || ''))
  const mode = computed<GameMode>(() => baseName.value === 'forever' || baseName.value.startsWith('forever-') ? 'forever' : 'retail')

  // Name der Route ohne Modus-Präfix, z. B. "klassen-slug"
  const modeBase = computed<ModeRoute | null>(() => {
    const name = mode.value === 'forever'
      ? (baseName.value === 'forever' ? 'index' : baseName.value.replace(/^forever-/, ''))
      : baseName.value
    return (modeRoutes as readonly string[]).includes(name) ? name as ModeRoute : null
  })

  const classes = computed(() => getClassList(mode.value))

  return { mode, modeBase, classes, routeName: (base: ModeRoute) => routeNameFor(base, mode.value) }
}
