// Schickt ein Ereignis an Saysmo (cookiefrei, t.saysmo.com): einzige Statistik, kein Google Analytics, läuft ohne Einwilligung
export const trackEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (import.meta.server) return
  const w = window as unknown as {
    saysmo?: { track: (name: string, data?: Record<string, string | number | boolean>) => void } }
  // Nur einfache Werte, Objekte als Text
  try {
    const daten: Record<string, string | number | boolean> = {}
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue
      daten[k] = typeof v === 'object' ? JSON.stringify(v) : (v as string | number | boolean)
    }
    w.saysmo?.track(event.slice(0, 50), daten)
  } catch { /* Statistik darf nie stören */ }
}
