// Erfolge werden immer im Arbeitsspeicher gezählt. Dauerhaft gespeichert (localStorage)
// wird nur, wenn im Cookie-Banner die Kategorie „Erfolge speichern“ erlaubt ist.
export const ACHIEVEMENT_STORAGE_KEY = 'fym_achievements'

interface AchievementState {
  unlocked: Record<string, string>
  counters: Record<string, number>
  sets: Record<string, string[]>
}

export const useConsentState = () => useState('consent', () => ({ preferences: false, analytics: false }))

export const useAchievements = () => {
  const state = useState<AchievementState>('achievements', () => ({ unlocked: {}, counters: {}, sets: {} }))
  const queue = useState<string[]>('achievement-queue', () => [])
  const consent = useConsentState()

  const save = () => {
    if (import.meta.server || !consent.value.preferences) return
    try {
      localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(state.value))
    } catch { /* Speicher voll oder gesperrt: dann eben nur für diesen Besuch */ }
  }

  // Gespeicherten Stand übernehmen (nach Einwilligung), Erfolge dieses Besuchs bleiben erhalten
  const load = () => {
    if (import.meta.server) return
    try {
      const stored = JSON.parse(localStorage.getItem(ACHIEVEMENT_STORAGE_KEY) || 'null') as AchievementState | null
      if (stored) {
        state.value = {
          unlocked: { ...stored.unlocked, ...state.value.unlocked },
          counters: Object.fromEntries([...new Set([...Object.keys(stored.counters || {}), ...Object.keys(state.value.counters)])]
            .map(k => [k, Math.max(stored.counters?.[k] || 0, state.value.counters[k] || 0)])),
          sets: Object.fromEntries([...new Set([...Object.keys(stored.sets || {}), ...Object.keys(state.value.sets)])]
            .map(k => [k, [...new Set([...(stored.sets?.[k] || []), ...(state.value.sets[k] || [])])]]))
        }
      }
    } catch { /* kaputter Eintrag: ignorieren */ }
    save()
  }

  const clearStorage = () => {
    if (import.meta.server) return
    try { localStorage.removeItem(ACHIEVEMENT_STORAGE_KEY) } catch { /* egal */ }
  }

  const unlock = (id: string) => {
    if (state.value.unlocked[id] || !achievementDefs.some(a => a.id === id)) return
    state.value.unlocked = { ...state.value.unlocked, [id]: new Date().toISOString() }
    queue.value = [...queue.value, id]
    save()
    trackEvent('achievement_unlocked', { achievement_id: id })
  }

  const increment = (counter: string, amount = 1) => {
    state.value.counters = { ...state.value.counters, [counter]: (state.value.counters[counter] || 0) + amount }
    save()
    return state.value.counters[counter]
  }

  // Fügt einen Wert zu einer Menge hinzu (z. B. besuchte Klassenseiten) und liefert die Größe
  const addToSet = (set: string, value: string) => {
    const current = state.value.sets[set] || []
    if (!current.includes(value)) {
      state.value.sets = { ...state.value.sets, [set]: [...current, value] }
      save()
    }
    return (state.value.sets[set] || []).length
  }

  const points = computed(() => achievementDefs.filter(a => state.value.unlocked[a.id]).reduce((sum, a) => sum + a.points, 0))

  return { state, queue, unlock, increment, addToSet, load, clearStorage, points }
}
