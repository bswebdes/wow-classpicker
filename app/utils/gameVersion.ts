// Spielstand, auf dem die Inhalte der Seite beruhen. Bei jedem Patch hier anpassen
// (und Spec-Seiten mit scripts/expand-spells.mjs gegen die aktuellen Fähigkeitsnamen prüfen).
import type { GameMode } from './classInfo'

export const gameVersion = {
  // Patch 12.1.5 „The Promise of Tomorrow“, live seit 13./14.10.2026
  retail: { patch: '12.1.5', checked: '2026-10-14' },
  // Beta-Stand, Start am 4.11.2026; danach auf 'live' und Patch umstellen
  forever: { status: 'beta' as 'beta' | 'live', launch: '2026-11-04', patch: '', checked: '2026-10-14' }
}

export const versionLabel = (mode: GameMode, locale: string) => {
  if (mode === 'retail') return `Patch ${gameVersion.retail.patch}`
  const f = gameVersion.forever
  if (f.status === 'live') return `Patch ${f.patch}`
  const date = new Date(f.launch).toLocaleDateString(locale === 'en' ? 'en-US' : 'de-DE', { day: 'numeric', month: locale === 'en' ? 'short' : 'numeric' })
  return locale === 'en' ? `Beta · launch ${date}` : `Beta · Start ${date}`
}
