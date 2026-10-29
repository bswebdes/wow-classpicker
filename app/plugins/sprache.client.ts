// Beim allerersten Besuch der Startseite: Browser ohne Deutsch → englische Startseite.
// Deutsch (auch de-AT, de-CH) bleibt auf DE. Läuft nur im Browser: beim Vorrendern gibt es keine
// Browsersprache, dort muss „/“ die deutsche Startseite bleiben (sonst fehlt sie für Google).
// i18n setzt sein Sprach-Cookie schon beim Laden, darum ein eigener Merker; der Sprachumschalter hat danach Vorrang.
// Bots und Messwerkzeuge nie umleiten: Googlebot rendert mit Englisch und ohne localStorage,
// sah „/“ also immer als Weiterleitung auf /en (ebenso PageSpeed/Lighthouse beim Messen).
const MERKER = 'fym_sprache_erkannt'
const BOT = /bot|crawl|spider|slurp|lighthouse|inspectiontool|pagespeed|headless/i

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    if (navigator.webdriver || BOT.test(navigator.userAgent)) return
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
