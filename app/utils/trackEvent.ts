// Schreibt ein Ereignis in den dataLayer, aber erst nach Einwilligung in „Statistik“.
// So werden keine Ereignisse von vor der Einwilligung nachträglich an Google gesendet.
export const trackEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (import.meta.server) return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[], __fymAnalytics?: boolean }
  if (!w.__fymAnalytics) return
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}
