// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  app: {
    head: {
      title: 'Midnight Class Picker',
      htmlAttrs: {
        lang: 'de'
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'description', content: 'Lass das Schicksal entscheiden welche Klasse du in Midnight spielst! Der ultimative Midnight Class Picker.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Press+Start+2P&display=swap' }
      ]
    }
  },

  // Runtime Config für einfache Pflege
  runtimeConfig: {
    public: {
      siteName: 'Midnight Class Picker',
      siteDescription: 'Der ultimative Class Picker für Midnight.',
      language: 'de'
    }
  },

  modules: ['@nuxtjs/tailwindcss']
})