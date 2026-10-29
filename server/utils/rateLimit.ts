import type { H3Event } from 'h3'

// Einfache Begrenzung pro IP und Zeitfenster, nur im Arbeitsspeicher (nichts wird gespeichert oder protokolliert).
// Abgelaufene Einträge werden regelmäßig entfernt.
const hits = new Map<string, { n: number, until: number }>()
let calls = 0

export const rateLimit = (event: H3Event, bucket: string, max: number, windowMs = 60_000) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `${bucket}:${ip}`
  const now = Date.now()
  if (++calls % 500 === 0) for (const [k, v] of hits) if (v.until < now) hits.delete(k)
  const entry = hits.get(key)
  if (!entry || entry.until < now) {
    hits.set(key, { n: 1, until: now + windowMs })
    return
  }
  if (++entry.n > max) throw createError({ statusCode: 429, statusMessage: 'too many requests' })
}
