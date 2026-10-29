// IndexNow manuell: pnpm indexnow [--all] [--days=3] [--dry]
// Seit dem Umzug auf den eigenen Server (27.10.2026) gibt es keine automatische Meldung mehr
// (netlify/functions/deploy-succeeded.mjs lief nur auf Netlify): nach jedem Deploy in Dokploy von Hand starten.
import { readSitemap, recentUrls, submit } from './indexnow-lib.mjs'

const args = process.argv.slice(2)
const days = Number(args.find(a => a.startsWith('--days='))?.split('=')[1] || 3)
const entries = await readSitemap()
const urls = args.includes('--all') ? [...new Set(entries.map(e => e.loc))] : recentUrls(entries, days)
console.log(`[indexnow] ${urls.length} von ${entries.length} URLs ${args.includes('--all') ? '(alle)' : `(lastmod ≤ ${days} Tage)`}`)
if (args.includes('--dry')) {
  urls.slice(0, 20).forEach(u => console.log('  ', u))
  if (urls.length > 20) console.log(`   … und ${urls.length - 20} weitere`)
}
else {
  const r = await submit(urls)
  console.log(`[indexnow] Antwort ${r.status}${r.body ? `: ${r.body}` : ''}`)
}
