// Texte für den Cookie-Banner (vanilla-cookieconsent), DE und EN
export const consentTranslations = (privacyPath: { de: string, en: string }) => ({
  de: {
    consentModal: {
      title: 'Kurz zu Cookies',
      description: `Diese Seite funktioniert auch ohne Tracking. Wenn du magst, kannst du erlauben, dass deine Erfolge gespeichert werden, Wowhead-Tooltips angezeigt werden und ich mit Google Analytics pseudonymisiert sehe, welche Seiten genutzt werden. Mehr in der <a href="${privacyPath.de}">Datenschutzerklärung</a>.`,
      acceptAllBtn: 'Alle erlauben',
      acceptNecessaryBtn: 'Nur notwendige',
      showPreferencesBtn: 'Einstellungen'
    },
    preferencesModal: {
      title: 'Cookie-Einstellungen',
      acceptAllBtn: 'Alle erlauben',
      acceptNecessaryBtn: 'Nur notwendige',
      savePreferencesBtn: 'Auswahl speichern',
      closeIconLabel: 'Schließen',
      sections: [
        {
          title: 'Notwendig',
          description: 'Speichert deine Sprache und deine Auswahl in diesem Banner. Ohne geht es nicht.',
          linkedCategory: 'necessary'
        },
        {
          title: 'Erfolge speichern',
          description: 'Speichert deine errungenen Erfolge im lokalen Speicher deines Browsers, damit sie beim nächsten Besuch noch da sind. Ohne Zustimmung gelten sie nur für den aktuellen Besuch. Es wird nichts an einen Server übertragen.',
          linkedCategory: 'preferences'
        },
        {
          title: 'Statistik',
          description: 'Google Tag Manager und Google Analytics 4 zeigen mir pseudonymisiert, welche Seiten und Funktionen genutzt werden. Anbieter: Google Ireland Ltd., Irland. Daten können in die USA übertragen werden (EU-US Data Privacy Framework). Cookies: _ga, _ga_* (2 Jahre).',
          linkedCategory: 'analytics'
        },
        {
          title: 'Wowhead-Tooltips',
          description: 'Zeigt beim Überfahren von Fähigkeiten die Original-Tooltips von Wowhead. Dafür wird ein Script von Wowhead (ZAM Network LLC, USA) geladen und deine IP-Adresse an Wowhead übertragen. Ohne Zustimmung bleiben es einfache Links zu Wowhead.',
          linkedCategory: 'external'
        },
        {
          title: 'Mehr Informationen',
          description: `Alles Weitere steht in der <a href="${privacyPath.de}">Datenschutzerklärung</a>.`
        }
      ]
    }
  },
  en: {
    consentModal: {
      title: 'A quick word on cookies',
      description: `This site also works without tracking. If you like, you can allow your achievements to be saved, Wowhead tooltips to be shown and let me see in pseudonymous form with Google Analytics which pages are used. More in the <a href="${privacyPath.en}">privacy policy</a>.`,
      acceptAllBtn: 'Allow all',
      acceptNecessaryBtn: 'Necessary only',
      showPreferencesBtn: 'Settings'
    },
    preferencesModal: {
      title: 'Cookie settings',
      acceptAllBtn: 'Allow all',
      acceptNecessaryBtn: 'Necessary only',
      savePreferencesBtn: 'Save selection',
      closeIconLabel: 'Close',
      sections: [
        {
          title: 'Necessary',
          description: 'Stores your language and your choice in this banner. The site needs these.',
          linkedCategory: 'necessary'
        },
        {
          title: 'Save achievements',
          description: 'Stores your earned achievements in your browser\'s local storage so they are still there next time. Without consent they only last for the current visit. Nothing is sent to a server.',
          linkedCategory: 'preferences'
        },
        {
          title: 'Statistics',
          description: 'Google Tag Manager and Google Analytics 4 show me in pseudonymous form which pages and features are used. Provider: Google Ireland Ltd., Ireland. Data may be transferred to the USA (EU-US Data Privacy Framework). Cookies: _ga, _ga_* (2 years).',
          linkedCategory: 'analytics'
        },
        {
          title: 'Wowhead tooltips',
          description: 'Shows the original Wowhead tooltips when you hover over abilities. This loads a script from Wowhead (ZAM Network LLC, USA) and transfers your IP address to Wowhead. Without consent, they stay plain links to Wowhead.',
          linkedCategory: 'external'
        },
        {
          title: 'More information',
          description: `Everything else is in the <a href="${privacyPath.en}">privacy policy</a>.`
        }
      ]
    }
  }
})
