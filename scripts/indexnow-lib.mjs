// IndexNow (Bing, Yandex, Seznam, Naver u. a.): meldet neue und geänderte URLs direkt an die Suchmaschinen.
// Reine Bibliothek ohne Top-Level-await und import.meta, damit Netlify sie in die Funktion
// netlify/functions/deploy-succeeded.mjs bündeln kann (das Bündel ist CommonJS).
// Kommandozeile: scripts/indexnow.mjs. Geänderte Seiten erkennt sie an `lastmod` in der Live-Sitemap.

export const SITE = 'https://findyourmain.com'
export const INDEXNOW_KEY = '27e0c321ae984682b3c31a39635a0e4a'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const tags = (xml, tag) => [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map(m => m[1].trim())

// Alle URLs mit lastmod aus dem Sitemap-Index und seinen Teil-Sitemaps
export const readSitemap = async (site = SITE) => {
  const index = await (await fetch(`${site}/sitemap_index.xml`)).text()
  const children = tags(index, 'loc')
  const entries = []
  for (const child of children) {
    const xml = await (await fetch(child)).text()
    for (const block of tags(xml, 'url')) {
      const loc = tags(block, 'loc')[0]
      if (loc) entries.push({ loc, lastmod: tags(block, 'lastmod')[0] })
    }
  }
  return entries
}

// Seiten, deren lastmod höchstens `days` Tage zurückliegt (Seiten ohne lastmod nur mit --all)
export const recentUrls = (entries, days) => {
  const since = Date.now() - days * 86400000
  return [...new Set(entries.filter(e => e.lastmod && Date.parse(e.lastmod) >= since).map(e => e.loc))]
}

export const submit = async (urlList, site = SITE) => {
  if (!urlList.length) return { status: 0, submitted: 0 }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(site).host, key: INDEXNOW_KEY, keyLocation: `${site}/${INDEXNOW_KEY}.txt`, urlList: urlList.slice(0, 10000) })
  })
  return { status: res.status, submitted: Math.min(urlList.length, 10000), body: await res.text() }
}
