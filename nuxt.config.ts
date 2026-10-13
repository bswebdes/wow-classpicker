// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://findyourmain.com'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-13',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'google-site-verification', content: 'LqBug-yqynPB2aX7EkNZrC9F-AzC-3HsbplFBhov7b8' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ],
      script: [
        {
          // Google Consent Mode v2: alles verweigert, bis im Cookie-Banner zugestimmt wird
          innerHTML: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'denied',personalization_storage:'denied',security_storage:'granted',wait_for_update:500});"
        }
      ]
    }
  },

  // Runtime Config für einfache Pflege
  runtimeConfig: {
    public: {
      siteName: 'Find Your Main',
      siteDescription: 'WoW Class Picker für Midnight und WoW Forever.',
      language: 'de'
    }
  },

  // Reihenfolge wichtig: @nuxtjs/sitemap muss vor @nuxt/content geladen werden
  modules: ['@nuxtjs/i18n', '@nuxt/fonts', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-schema-org', 'nuxt-og-image', 'nuxt-ai-ready', '@nuxt/image', '@nuxt/content'],

  site: {
    url: siteUrl,
    name: 'Find Your Main',
    defaultLocale: 'de'
  },

  // Schriften werden beim Build heruntergeladen und selbst ausgeliefert (keine Google-Requests)
  fonts: {
    families: [
      { name: 'Cinzel', provider: 'google', weights: [600, 700, 900] },
      { name: 'Alegreya Sans', provider: 'google', weights: [400, 500, 700], styles: ['normal', 'italic'] }
    ]
  },

  // Bilder aus app/assets/images werden beim Build verkleinert und als WebP ausgeliefert,
  // die großen Originale landen nicht im Deployment
  image: {
    dir: 'assets/images',
    provider: 'ipx',
    format: ['webp'],
    quality: 80,
    densities: [1, 2]
  },

  hooks: {
    // Original-Logos (mehrere MB) nicht mit ausliefern, Nuxt Image erzeugt beim Build die kleinen Varianten
    'nitro:init'(nitro) {
      nitro.options.publicAssets = nitro.options.publicAssets.filter(asset => !asset.dir.replace(/\\/g, '/').endsWith('/assets/images'))
    }
  },

  // llms.txt, Markdown-Versionen der Seiten und Content Signals für KI-Suchsysteme
  aiReady: {
    // Markdown aus der gerenderten Seite erzeugen, damit Kurzantwort, Klassendaten und FAQ enthalten sind
    contentSource: false,
    llmsTxt: {
      notes: [
        'Find Your Main is a WoW class picker that helps players choose a class in World of Warcraft. It covers retail WoW (Midnight, 13 classes, 40 specializations) and WoW Forever (Classic+, launching 4 November 2026, 9 classes, 10 races, 56 race-class combinations).',
        'Tools: an arena battle simulator, a class quiz and a random class generator. Content: one page per class for each game, plus guides on beginner classes, solo classes, tanks, healers and class colors.',
        'German is the default language; English pages live under /en. Ratings for difficulty and solo play are editorial assessments, not DPS rankings.'
      ]
    }
  },

  sitemap: {
    // Inhaltsseiten mit lastmod und Sprachalternativen (unterschiedliche Slugs je Sprache)
    sources: ['/api/__sitemap__/urls'],
    // Rechtstexte und Erfolge nicht in die Sitemap
    exclude: ['/impressum', '/datenschutz', '/en/imprint', '/en/privacy', '/erfolge', '/en/achievements']
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Find Your Main',
      alternateName: 'WoW Class Picker',
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`
    }
  },

  // Seiten werden beim Build vorgerendert (statisch auf Netlify ausgeliefert)
  nitro: {
    prerender: {
      // Seiten als /klassen/magier.html statt /klassen/magier/index.html schreiben,
      // sonst leitet Netlify jede URL auf eine Variante mit Schrägstrich am Ende um
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/', '/en', '/forever', '/en/forever', '/robots.txt', '/sitemap_index.xml', '/llms.txt']
    }
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    customRoutes: 'meta',
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', files: ['de.json', 'de-site.json'] },
      { code: 'en', language: 'en-US', name: 'English', files: ['en.json', 'en-site.json'] }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
