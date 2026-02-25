// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  app: {
    head: {
      title: 'WoW Midnight Class Picker - Dein Klassen-Zufallsgenerator',
      htmlAttrs: {
        lang: 'de'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Welche Klasse sollst du in WoW: Midnight spielen? Lass den WoW Class Picker entscheiden! Der ultimative Zufallsgenerator für World of Warcraft.' },
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

  modules: ['@nuxtjs/tailwindcss']
})