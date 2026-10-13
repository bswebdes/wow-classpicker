import type { GameMode } from '~/utils/classInfo'

// Link auf die Teilen-Seite „Mein Main“ inkl. Ergebnis in der URL
export const useShareLink = () => {
  const localePath = useLocalePath()
  const { locale } = useI18n()
  return (classId: string, mode: GameMode, query: Record<string, string>) => {
    const info = getClassInfo(classId, mode)
    if (!info || !import.meta.client) return ''
    const path = localePath({ name: mode === 'forever' ? 'forever-mein-main-slug' : 'mein-main-slug', params: { slug: info.slug[locale.value as 'de' | 'en'] } })
    return `${window.location.origin}${path}?${new URLSearchParams(query).toString()}`
  }
}
