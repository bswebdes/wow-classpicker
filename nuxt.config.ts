// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://wow-classpicker.netlify.app'

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
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Press+Start+2P&display=swap' }
      ],
      script: [
        {
          src: 'https://stats.frysch.studio/script.js',
          defer: true,
          'data-website-id': 'f2e035dd-e124-4dcc-8d4b-728a20d74205'
        }
      ]
    }
  },

  // Runtime Config für einfache Pflege
  runtimeConfig: {
    public: {
      siteName: 'WoW Midnight Class Picker',
      siteDescription: 'Der ultimative Class Picker für WoW Midnight.',
      language: 'de'
    }
  },

  // Reihenfolge wichtig: @nuxtjs/sitemap muss vor @nuxt/content geladen werden
  modules: ['@nuxtjs/i18n', '@nuxtjs/robots', '@nuxtjs/sitemap', 'nuxt-schema-org', 'nuxt-og-image', '@nuxt/content'],

  site: {
    url: siteUrl,
    name: 'WoW Midnight Class Picker',
    defaultLocale: 'de'
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'WoW Midnight Class Picker'
    }
  },

  // Seiten werden beim Build vorgerendert (statisch auf Netlify ausgeliefert)
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/robots.txt', '/sitemap_index.xml']
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
