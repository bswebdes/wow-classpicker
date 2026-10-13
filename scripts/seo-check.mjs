// SEO-Check nach dem Build: prüft alle vorgerenderten Seiten in .output/public.
// Fehler brechen den Build ab (z. B. fehlende H1 oder kaputte hreflang-Links),
// Warnungen (z. B. zu lange Titel) werden nur ausgegeben.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = '.output/public'
const site = 'https://findyourmain.com'
// Deutsche Titel sind länger, Google kürzt nach Pixelbreite (etwa 60–70 Zeichen)
const limits = { title: [25, 70], description: [70, 165] }

if (!existsSync(root)) {
  console.error('[seo-check] .output/public fehlt, zuerst bauen.')
  process.exit(1)
}

const htmlFiles = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name)
  if (statSync(path).isDirectory()) return name.startsWith('_') ? [] : htmlFiles(path)
  return name.endsWith('.html') && !['200.html', '404.html'].includes(name) ? [path] : []
})

// https://findyourmain.com/en/guides/x -> .output/public/en/guides/x.html
const fileForUrl = (url) => {
  const path = url.replace(site, '').replace(/\/$/, '')
  return path ? join(root, `${path}.html`) : join(root, 'index.html')
}

const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const attr = (html, regex) => decode(html.match(regex)?.[1] ?? '')

const sitemapUrls = new Set(readdirSync(join(root, '__sitemap__'))
  .filter(name => name.endsWith('.xml'))
  .flatMap(name => [...readFileSync(join(root, '__sitemap__', name), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])))

const errors = []
const warnings = []

for (const file of htmlFiles(root)) {
  const html = readFileSync(file, 'utf8')
  const page = `/${relative(root, file).replace(/\.html$/, '').replace(/^index$/, '')}`
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html)

  const title = attr(html, /<title>([^<]*)<\/title>/)
  const description = attr(html, /<meta name="description" content="([^"]*)"/)
  const h1Count = (html.match(/<h1[\s>]/g) || []).length
  const canonical = attr(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/)
  const alternates = [...html.matchAll(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"[^>]*hreflang="([^"]*)"/g)].map(m => ({ href: m[1], lang: m[2] }))

  if (!title) errors.push(`${page}: <title> fehlt`)
  if (h1Count !== 1) errors.push(`${page}: ${h1Count} H1-Überschriften statt genau einer`)

  // noindex-Seiten (Impressum, Teilen-Seiten …) brauchen keine Snippet-Optimierung
  if (noindex) {
    if (sitemapUrls.has(`${site}${page === '/' ? '' : page}`)) warnings.push(`${page}: noindex, steht aber in der Sitemap`)
    continue
  }

  if (title && (title.length < limits.title[0] || title.length > limits.title[1])) warnings.push(`${page}: Titel hat ${title.length} Zeichen (Ziel ${limits.title.join('–')}): ${title}`)

  if (!description) errors.push(`${page}: Meta-Beschreibung fehlt`)
  else if (description.length < limits.description[0] || description.length > limits.description[1]) warnings.push(`${page}: Beschreibung hat ${description.length} Zeichen (Ziel ${limits.description.join('–')})`)

  if (!ogImage) errors.push(`${page}: og:image fehlt`)
  else if (ogImage.startsWith(site) && !existsSync(join(root, ogImage.replace(site, '')))) errors.push(`${page}: OG-Bild nicht erzeugt: ${ogImage}`)

  if (!canonical) errors.push(`${page}: Canonical fehlt`)
  for (const lang of ['de', 'en', 'x-default']) {
    if (!alternates.some(a => a.lang === lang)) errors.push(`${page}: hreflang „${lang}“ fehlt`)
  }
  for (const { href, lang } of alternates) {
    if (href.startsWith(site) && !existsSync(fileForUrl(href))) errors.push(`${page}: hreflang „${lang}“ zeigt auf eine Seite, die es nicht gibt: ${href}`)
  }
}

const pages = htmlFiles(root).length
for (const w of warnings) console.warn(`[seo-check] Warnung: ${w}`)
for (const e of errors) console.error(`[seo-check] Fehler: ${e}`)
console.log(`[seo-check] ${pages} Seiten geprüft: ${errors.length} Fehler, ${warnings.length} Warnungen`)
process.exit(errors.length ? 1 : 0)
