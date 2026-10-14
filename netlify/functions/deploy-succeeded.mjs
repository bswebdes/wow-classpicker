// Netlify ruft diese Funktion nach jedem erfolgreichen Deploy auf (Name = Ereignis).
// Nur Produktions-Deploys melden ihre kürzlich geänderten URLs per IndexNow.
import { readSitemap, recentUrls, submit } from '../../scripts/indexnow-lib.mjs'

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}')
  if (payload?.context !== 'production') {
    return { statusCode: 200, body: `IndexNow übersprungen (Kontext: ${payload?.context})` }
  }
  try {
    const urls = recentUrls(await readSitemap(), 3)
    const r = await submit(urls)
    console.log(`[indexnow] ${r.submitted} URLs gemeldet, Antwort ${r.status}`)
    return { statusCode: 200, body: `IndexNow: ${r.submitted} URLs, Status ${r.status}` }
  }
  catch (e) {
    // Ein Fehler hier darf den Deploy nicht beeinflussen, nur protokollieren
    console.error('[indexnow] fehlgeschlagen', e)
    return { statusCode: 200, body: 'IndexNow fehlgeschlagen' }
  }
}
