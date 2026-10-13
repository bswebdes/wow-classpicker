import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const GTM_ID = 'GTM-MSF6PT29'

// Google Tag Manager erst nach Einwilligung laden (Consent-Mode-Standard steht im <head>)
const loadGtm = () => {
  const w = window as unknown as { dataLayer: unknown[], gtag?: (...args: unknown[]) => void, __gtmLoaded?: boolean }
  if (w.__gtmLoaded) return
  w.__gtmLoaded = true
  w.gtag?.('consent', 'update', { analytics_storage: 'granted' })
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': Date.now(), 'event': 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
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
    if (preferences) achievements.load()
    else achievements.clearStorage()
    if (analytics) loadGtm()
  }

  CookieConsent.run({
    cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
      preferencesModal: { layout: 'box', equalWeightButtons: true }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      preferences: {},
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

  // Banner-Sprache mit der Seitensprache wechseln
  nuxtApp.hook('i18n:localeSwitched', ({ newLocale }: { newLocale: string }) => {
    CookieConsent.setLanguage(newLocale === 'en' ? 'en' : 'de', true)
  })

  return {
    provide: {
      showCookieSettings: () => CookieConsent.showPreferences()
    }
  }
})
