// Schreibt ein Ereignis in den dataLayer. Ohne Google Tag Manager passiert damit nichts,
// GTM wird erst nach Einwilligung geladen und verarbeitet dann auch zuvor gesammelte Einträge.
export const trackEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (import.meta.server) return
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}
