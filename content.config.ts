import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const faqSchema = z.array(z.object({ q: z.string(), a: z.string() })).optional()

// Klassenseiten: Daten (Specs, Rollen, Rüstung) kommen aus app/utils/classInfo.ts
// bzw. foreverInfo.ts, im Markdown steht nur der redaktionelle Text.
const classSchema = z.object({
  classId: z.string(),
  // Kurzantwort, die oben auf der Seite steht (Antwort zuerst für Leser und KI-Suche)
  summary: z.string().optional(),
  date: z.string().optional(),
  updated: z.string().optional(),
  // Redaktionelle Fragen, ergänzen die aus den Klassendaten erzeugten FAQ
  faq: faqSchema
})

// Spec-Seiten (nur Retail): /klassen/<klasse>/<spec>
const specSchema = z.object({
  classId: z.string(),
  specId: z.string(),
  // Gebräuchlicher Name der Spec, z. B. „Vergelter-Paladin“ (für OG-Bild und Breadcrumb-Text)
  name: z.string(),
  summary: z.string(),
  faq: faqSchema,
  date: z.string(),
  updated: z.string().optional()
})

const guideSchema = z.object({
  // Gemeinsamer Schlüssel, um DE- und EN-Version eines Ratgebers zu verknüpfen
  key: z.string(),
  // Reihenfolge in der Ratgeber-Übersicht
  order: z.number().default(99),
  game: z.enum(['retail', 'forever']).default('retail'),
  summary: z.string().optional(),
  faq: faqSchema,
  date: z.string(),
  updated: z.string().optional(),
  classes: z.array(z.string()).optional(),
  // Hauptbild (Datei in public/images/hero ohne Endung) mit Alt-Text, auch als OG-Bild genutzt
  image: z.string().optional(),
  imageAlt: z.string().optional()
})

// Textblöcke für bestehende Seiten (z. B. Startseite), ohne eigene Route
const blockSchema = z.object({
  faq: faqSchema
})

export default defineContentConfig({
  collections: {
    classes_de: defineCollection({
      type: 'page',
      source: { include: 'de/klassen/*.md', prefix: '/klassen' },
      schema: classSchema
    }),
    classes_en: defineCollection({
      type: 'page',
      source: { include: 'en/classes/*.md', prefix: '/classes' },
      schema: classSchema
    }),
    specs_de: defineCollection({
      type: 'page',
      source: { include: 'de/klassen/*/*.md', prefix: '/klassen' },
      schema: specSchema
    }),
    specs_en: defineCollection({
      type: 'page',
      source: { include: 'en/classes/*/*.md', prefix: '/classes' },
      schema: specSchema
    }),
    forever_classes_de: defineCollection({
      type: 'page',
      source: { include: 'de/forever/klassen/*.md', prefix: '/forever/klassen' },
      schema: classSchema
    }),
    forever_classes_en: defineCollection({
      type: 'page',
      source: { include: 'en/forever/classes/*.md', prefix: '/forever/classes' },
      schema: classSchema
    }),
    guides_de: defineCollection({
      type: 'page',
      source: { include: 'de/ratgeber/*.md', prefix: '/ratgeber' },
      schema: guideSchema
    }),
    guides_en: defineCollection({
      type: 'page',
      source: { include: 'en/guides/*.md', prefix: '/guides' },
      schema: guideSchema
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
