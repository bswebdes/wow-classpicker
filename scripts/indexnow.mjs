// IndexNow manuell: pnpm indexnow [--all] [--days=3] [--dry]
// Nach jedem Produktions-Deploy läuft die Meldung automatisch (netlify/functions/deploy-succeeded.mjs).
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
