import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

// Früher gesetzte Google-Analytics-Cookies löschen (GA4 ist seit 25.10.2026 raus)
const eraseOldGaCookies = () => {
  for (const name of document.cookie.split(';').map(c => c.split('=')[0]!.trim()).filter(n => /^_ga/.test(n))) {
    for (const domain of ['', `; domain=${window.location.hostname}`, `; domain=.${window.location.hostname.replace(/^www\./, '')}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`
    }
  }
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
  eraseOldGaCookies()
  const i18n = nuxtApp.$i18n as { locale: { value: string }, t: (key: string) => string }
  const localePath = useLocalePath()
  const consent = useConsentState()
  const achievements = useAchievements()

  const applyConsent = () => {
    const preferences = CookieConsent.acceptedCategory('preferences')
    consent.value = { preferences }
    if (preferences) achievements.load()
    else achievements.clearStorage()
    if (CookieConsent.acceptedCategory('external')) loadWowhead()
    // Widerruf: bereits geladenes Wowhead-Script nur durch Neuladen wieder los
    else if ((window as unknown as { __whLoaded?: boolean }).__whLoaded) window.location.reload()
  }

  CookieConsent.run({
    // Revision erhöhen, wenn Kategorien dazukommen oder wegfallen: Bestehende Besucher werden dann erneut gefragt
    // (2 = Statistik/Google Analytics raus, 25.10.2026)
    revision: 2,
    cookie: { name: 'cc_cookie', expiresAfterDays: 182 },
    guiOptions: {
      consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
      preferencesModal: { layout: 'box', equalWeightButtons: true }
    },
    categories: {
      necessary: { enabled: true, readOnly: true },
      preferences: {},
      external: {}
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
