import type { GameMode } from '~/utils/classInfo'

interface FaqItem { q: string, a: string }

interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  // Text im generierten OG-Bild, fällt auf den Title zurück
  ogTitle?: MaybeRefOrGetter<string | undefined>
  ogSubtitle?: MaybeRefOrGetter<string | undefined>
  // Klassen-IDs, deren Icons im OG-Bild erscheinen
  classes?: MaybeRefOrGetter<string[] | undefined>
  // Hauptbild (public/images/hero/<name>.webp) als Hintergrund im OG-Bild
  image?: string
  // Klassen-Artwork (public/images/classes/<id>.webp) rechts im OG-Bild
  art?: string
  // Spiel, um das es auf der Seite geht (für Schema.org "about")
  mode?: GameMode
  // Schema.org-Typ der Seite
  pageType?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'FAQPage'
  faq?: MaybeRefOrGetter<FaqItem[] | undefined>
  dateModified?: MaybeRefOrGetter<string | undefined>
}

// Entitäten für Suchmaschinen und KI-Systeme: Worum geht es auf der Seite?
export const gameEntity = (mode: GameMode = 'retail') => mode === 'forever'
  ? {
      '@type': 'VideoGame',
      'name': 'World of Warcraft: Forever',
      'gamePlatform': 'PC',
      'publisher': { '@type': 'Organization', 'name': 'Blizzard Entertainment' },
      'isBasedOn': { '@type': 'VideoGame', 'name': 'World of Warcraft', 'sameAs': ['https://www.wikidata.org/wiki/Q131007'] }
    }
  : {
      '@type': 'VideoGame',
      'name': 'World of Warcraft',
      'alternateName': 'World of Warcraft: Midnight',
      'gamePlatform': 'PC',
      'publisher': { '@type': 'Organization', 'name': 'Blizzard Entertainment' },
      'sameAs': [
        'https://www.wikidata.org/wiki/Q131007',
        'https://en.wikipedia.org/wiki/World_of_Warcraft',
        'https://de.wikipedia.org/wiki/World_of_Warcraft'
      ]
    }

export const usePageSeo = (options: PageSeoOptions) => {
  useSeoMeta({
    title: () => toValue(options.title),
    ogTitle: () => toValue(options.title),
    description: () => toValue(options.description),
    ogDescription: () => toValue(options.description),
    twitterCard: 'summary_large_image'
  })

  // Payload- (_payload.json) und Markdown-Renderings (.md für KI-Systeme) brauchen kein OG-Bild.
  // Ohne diese Abfrage erzeugt jeder dieser Durchläufe ein eigenes, nirgends verlinktes Bild
  // (vorher 1.140 statt rund 450 OG-Bilder pro Build)
  const renderPath = import.meta.server ? (useRequestEvent()?.path || '') : ''
  const internalRender = /\/_payload\.json|\.md(\?|$)/.test(renderPath)

  if (!internalRender) defineOgImage('ClassPicker', {
    title: toValue(options.ogTitle) || toValue(options.title),
    subtitle: toValue(options.ogSubtitle) || toValue(options.description),
    classes: toValue(options.classes) || [],
    mode: options.mode || 'retail',
    image: options.image ? `/images/hero/${options.image}.webp` : '',
    art: options.art ? `/images/classes/${options.art}.webp` : ''
  })

  const faq = toValue(options.faq) || []
  useSchemaOrg([
    defineWebPage({
      '@type': faq.length ? ['WebPage', 'FAQPage'] : (options.pageType || 'WebPage'),
      'about': gameEntity(options.mode),
      ...(toValue(options.dateModified) ? { dateModified: toValue(options.dateModified) } : {})
    }),
    ...faq.map(item => defineQuestion({ name: item.q, acceptedAnswer: item.a }))
  ])
}
