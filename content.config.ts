import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'

// Klassenseiten: Daten (Specs, Rollen, Rüstung) kommen aus app/utils/classInfo.ts,
// im Markdown steht nur der redaktionelle Text.
const classSchema = (name: string, localePrefix = '') => z.object({
  classId: z.string(),
  sitemap: defineSitemapSchema({
    name,
    onUrl: localePrefix ? (url) => { url.loc = `/en${url.loc}` } : undefined
  })
})

const guideSchema = (name: string, localePrefix = '') => z.object({
  // Gemeinsamer Schlüssel, um DE- und EN-Version eines Ratgebers zu verknüpfen
  key: z.string(),
  // Reihenfolge in der Ratgeber-Übersicht
  order: z.number().default(99),
  date: z.string(),
  updated: z.string().optional(),
  classes: z.array(z.string()).optional(),
  sitemap: defineSitemapSchema({
    name,
    onUrl: localePrefix ? (url) => { url.loc = `/en${url.loc}` } : undefined
  })
})

// Textblöcke für bestehende Seiten (z. B. Startseite), ohne eigene Route
const blockSchema = z.object({
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional()
})

export default defineContentConfig({
  collections: {
    classes_de: defineCollection({
      type: 'page',
      source: { include: 'de/klassen/*.md', prefix: '/klassen' },
      schema: classSchema('classes_de')
    }),
    classes_en: defineCollection({
      type: 'page',
      source: { include: 'en/classes/*.md', prefix: '/classes' },
      schema: classSchema('classes_en', '/en')
    }),
    guides_de: defineCollection({
      type: 'page',
      source: { include: 'de/ratgeber/*.md', prefix: '/ratgeber' },
      schema: guideSchema('guides_de')
    }),
    guides_en: defineCollection({
      type: 'page',
      source: { include: 'en/guides/*.md', prefix: '/guides' },
      schema: guideSchema('guides_en', '/en')
    }),
    blocks_de: defineCollection({
      type: 'page',
      source: { include: 'de/blocks/*.md', prefix: '/' },
      schema: blockSchema
    }),
    blocks_en: defineCollection({
      type: 'page',
      source: { include: 'en/blocks/*.md', prefix: '/' },
      schema: blockSchema
    })
  }
})
