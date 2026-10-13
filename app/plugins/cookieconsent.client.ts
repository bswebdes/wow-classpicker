import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const GTM_ID = 'GTM-MSF6PT29'

// Google Tag Manager erst nach Einwilligung laden (Consent-Mode-Standard steht im <head>)
// Nur auf der echten Domain messen: lokal (Dev-Server, Vorschau) und auf Testadressen wird GTM nie geladen
const isProductionHost = () => window.location.hostname === 'findyourmain.com'

const loadGtm = () => {
  const w = window as unknown as { dataLayer: unknown[], gtag?: (...args: unknown[]) => void, __gtmLoaded?: boolean }
  if (w.__gtmLoaded) return
  if (!isProductionHost()) {
    console.info('[GTM] nicht geladen: nur auf findyourmain.com aktiv')
    return
  }
  w.__gtmLoaded = true
  w.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': Date.now(), 'event': 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

// Wowhead-Tooltips erst nach Einwilligung laden
const loadWowhead = () => {
  const w = window as unknown as { whTooltips?: object, __whLoaded?: boolean }
  if (w.__whLoaded) return
  w.__whLoaded = true
  w.whTooltips = { colorLinks: false, iconizeLinks: false, renameLinks: false }
  const script = document.createElement('script')
  script.src = 'https://wow.zamimg.com/js/tooltips.js'
  script.async = true
  document.head.appendChild(script)
}

// Nach Seitenwechseln neue Wowhead-Links erkennen
const refreshWowhead = () => {
  const w = window as unknown as { $WowheadPower?: { refreshLinks?: () => void } }
  w.$WowheadPower?.refreshLinks?.()
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as { locale: { value: string }, t: (key: string) => string }
  const localePath = useLocalePath()
  const consent = useConsentState()
  const achievements = useAchievements()

  const applyConsent = () => {
    const preferences = CookieConsent.acceptedCategory('preferences')
    const analytics = CookieConsent.acceptedCategory('analytics')
    consent.value = { preferences, analytics }
    ;(window as unknown as { __fymAnalytics?: boolean }).__fymAnalytics = analytics
    if (preferences) achievements.load()
    else achievements.clearStorage()
    if (analytics) loadGtm()
    if (CookieConsent.acceptedCategory('external')) loadWowhead()
    // Widerruf: bereits geladenes Wowhead-Script nur durch Neuladen wieder los
    else if ((window as unknown as { __whLoaded?: boolean }).__whLoaded) window.location.reload()
  }

  CookieConsent.run({
    // Revision erhöhen, wenn neue Kategorien dazukommen: Bestehende Besucher werden dann erneut gefragt
    revision: 1,
    cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
      preferencesModal: { layout: 'box', equalWeightButtons: true }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      preferences: {},
      external: {},
      analytics: {
        autoClear: { cookies: [{ name: /^_ga/ }] }
      }
    },
    language: {
      default: i18n.locale.value === 'en' ? 'en' : 'de',
      translations: consentTranslations({
        de: localePath('datenschutz', 'de'),
        en: localePath('datenschutz', 'en')
      })
    },
    onConsent: applyConsent,
    onChange: applyConsent
  })

  nuxtApp.hook('page:finish', () => setTimeout(refreshWowhead, 300))

  // Banner-Sprache mit der Seitensprache wechseln
  nuxtApp.hook('i18n:localeSwitched', ({ oldLocale, newLocale }: { oldLocale: string, newLocale: string }) => {
    CookieConsent.setLanguage(newLocale === 'en' ? 'en' : 'de', true)
    trackEvent('language_switch', { from_language: oldLocale, to_language: newLocale })
  })

  return {
    provide: {
      showCookieSettings: () => CookieConsent.showPreferences()
    }
  }
})
