// Beim allerersten Besuch der Startseite: Browser ohne Deutsch → englische Startseite.
// Deutsch (auch de-AT, de-CH) bleibt auf DE. Läuft nur im Browser: beim Vorrendern gibt es keine
// Browsersprache, dort muss „/“ die deutsche Startseite bleiben (sonst fehlt sie für Google).
// i18n setzt sein Sprach-Cookie schon beim Laden, darum ein eigener Merker; der Sprachumschalter hat danach Vorrang.
const MERKER = 'fym_sprache_erkannt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    try {
      if (localStorage.getItem(MERKER)) return
      localStorage.setItem(MERKER, '1')
    } catch {
      return
    }
    if (useRoute().path !== '/') return
    const sprachen = navigator.languages?.length ? navigator.languages : [navigator.language]
    if (!sprachen.some(s => s?.toLowerCase().startsWith('de'))) navigateTo('/en', { replace: true })
  })
})
