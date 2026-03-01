// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

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

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],

  i18n: {
    baseUrl: 'https://classpicker.frysch.studio', // Empfohlen für SEO (Metatags wie og:url)
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})