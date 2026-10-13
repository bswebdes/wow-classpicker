import { queryCollection } from '@nuxt/content/server'
import { classInfo } from '~~/app/utils/classInfo'
import { foreverClassInfo } from '~~/app/utils/foreverInfo'
import { indexedPairs, pairSlug } from '~~/app/utils/compare'

// Sitemap-Quelle für Inhaltsseiten: DE und EN haben unterschiedliche Slugs,
// deshalb werden die Sprachalternativen hier explizit gesetzt (inkl. lastmod).
interface Pair { de: string, en: string, lastmod?: string }

const entries = (pairs: Pair[]) => pairs.flatMap(({ de, en, lastmod }) => {
  const alternatives = [
    { hreflang: 'de-DE', href: de },
    { hreflang: 'en-US', href: en },
    { hreflang: 'x-default', href: de }
  ]
  return [
    { loc: de, lastmod, alternatives, _sitemap: 'de-DE' },
    { loc: en, lastmod, alternatives, _sitemap: 'en-US' }
  ]
})

export default defineSitemapEventHandler(async (event) => {
  const [classesDe, foreverDe, guidesDe, guidesEn] = await Promise.all([
    queryCollection(event, 'classes_de').select('path', 'updated', 'date').all(),
    queryCollection(event, 'forever_classes_de').select('path', 'updated', 'date').all(),
    queryCollection(event, 'guides_de').select('path', 'key', 'updated', 'date').all(),
    queryCollection(event, 'guides_en').select('path', 'key').all()
  ])
  const lastmodOf = (list: { path: string, updated?: string, date?: string }[], path: string) => {
    const doc = list.find(d => d.path === path)
    return doc?.updated || doc?.date
  }

  const pairs: Pair[] = [
    ...classInfo.map(c => ({
      de: `/klassen/${c.slug.de}`,
      en: `/en/classes/${c.slug.en}`,
      lastmod: lastmodOf(classesDe, `/klassen/${c.slug.de}`)
    })),
    ...foreverClassInfo.map(c => ({
      de: `/forever/klassen/${c.slug.de}`,
      en: `/en/forever/classes/${c.slug.en}`,
      lastmod: lastmodOf(foreverDe, `/forever/klassen/${c.slug.de}`)
    })),
    // Klassenvergleich: Übersicht und nur die Paare mit Suchvolumen (die übrigen sind noindex)
    { de: '/klassen/vergleich', en: '/en/classes/compare' },
    { de: '/forever/klassen/vergleich', en: '/en/forever/classes/compare' },
    ...indexedPairs.retail.map(([a, b]) => ({ de: `/klassen/vergleich/${pairSlug(a, b, 'retail', 'de')}`, en: `/en/classes/compare/${pairSlug(a, b, 'retail', 'en')}` })),
    ...indexedPairs.forever.map(([a, b]) => ({ de: `/forever/klassen/vergleich/${pairSlug(a, b, 'forever', 'de')}`, en: `/en/forever/classes/compare/${pairSlug(a, b, 'forever', 'en')}` })),
    ...guidesDe.flatMap((g) => {
      const en = guidesEn.find(e => e.key === g.key)
      return en ? [{ de: g.path, en: `/en${en.path}`, lastmod: g.updated || g.date }] : []
    })
  ]
  return entries(pairs)
})
