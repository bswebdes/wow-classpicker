// Schickt ein Ereignis an Umami (immer, cookiefrei) und in den dataLayer, dort aber erst nach Einwilligung in „Statistik“.
// So werden keine Ereignisse von vor der Einwilligung nachträglich an Google gesendet.
export const trackEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (import.meta.server) return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[], __fymAnalytics?: boolean,
    umami?: { track: (name: string, data?: Record<string, string | number | boolean>) => void } }
  // Umami (cookiefrei, analyse.frysch.studio) zählt immer, auch ohne Einwilligung – nur einfache Werte, Objekte als Text
  try {
    const daten: Record<string, string | number | boolean> = {}
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === '') continue
      daten[k] = typeof v === 'object' ? JSON.stringify(v) : (v as string | number | boolean)
    }
    w.umami?.track(event.slice(0, 50), daten)
  } catch { /* Statistik darf nie stören */ }
  if (!w.__fymAnalytics) return
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}
