# Tasks – Find Your Main (WoW Class Picker)

Stand: 13.10.2026 · Branch `chore/upgrade-nuxt4` (nicht gepusht)

## ✅ Erledigt

### Technik
- [x] Upgrade auf Nuxt 4, Tailwind CSS 4, @nuxtjs/i18n 10, Quellcode in `app/`
- [x] `.nuxt/` aus Git entfernt, `.gitignore` ergänzt
- [x] Nuxt Content für Klassenseiten, Ratgeber und Textblöcke (DE/EN)
- [x] Seiten werden vorgerendert, Node 24 für Netlify in `netlify.toml`
- [x] Schriften selbst gehostet (`@nuxt/fonts`), keine Google-Fonts-Requests mehr
- [x] Spiellogos über `@nuxt/image` als kleine WebP-Dateien, Originale nicht ausgeliefert
- [x] Hartcodierte deutsche Kampftexte in i18n verschoben
- [x] Umami-Tracking entfernt. Events (`battle_start`, `battle_victory`, `battle_reset`, `quiz_start`, `quiz_complete`, `random_roll`) laufen über `trackEvent()` in den `dataLayer` und sind für GTM/GA4 vorbereitet

### Design
- [x] Classic-WoW-Look: Goldrahmen, Ingame-Buttons, Tooltip-Boxen, Pergament für Texte
- [x] Arena als Unit-Frames, Kampflog als Chatfenster, Damage-Meter, Sieg als Erfolg
- [x] Header mit eigenem Wappen und Logo-Reitern für Retail / Forever
- [x] Mobile Ansicht geprüft (kompakter Header, scrollbare Navigation)

### Inhalte & Tools
- [x] Retail: 13 Klassenseiten, Klassenübersicht, Quiz, Zufallsgenerator
- [x] Forever: 9 Klassenseiten, Völker-Klassen-Matrix (56 Kombinationen), Quiz, Zufall mit Volk und Fraktion
- [x] 8 Ratgeber: Klassenwahl, Anfänger, Solo, Tanks, Heiler, Klassenfarben, Forever-Klassenwahl, Forever-Völker
- [x] Über-uns-Seite mit Quellen und Bewertungsmethode
- [x] Arena übernimmt Klassen per `?classes=` (aus Quiz, Klassenseiten, Ratgebern)

### SEO & GEO
- [x] Keyword-Recherche mit Ubersuggest (`docs/seo-recherche.md`)
- [x] Sitemap mit `lastmod` und Sprachalternativen, `robots.txt` mit Content Signals
- [x] hreflang/Canonical auf allen Seiten, auch bei unterschiedlichen Slugs je Sprache
- [x] Schema.org: WebPage/FAQPage, Article, Breadcrumb, ItemList, SoftwareApplication, VideoGame-Bezug
- [x] OG-Bild pro Seite (automatisch generiert)
- [x] `llms.txt`, `llms-full.txt` und Markdown-Version jeder Seite
- [x] „Kurz gesagt“-Box und FAQs auf Klassen- und Ratgeberseiten

## 🔲 Offen

### Muss vor dem Go-live
- [ ] **Domain `findyourmain.com`** (Marke „Find Your Main“)
  - [x] Domain ausgewählt, Marke im Projekt umgestellt (Logo, Seitenname, Schema.org, OG-Bilder, Texte)
  - [x] `siteUrl` in `nuxt.config.ts` auf `https://findyourmain.com` umgestellt
  - [x] 301-Weiterleitungen in `netlify.toml` (alte `netlify.app`-Adresse und `www` auf die Hauptdomain)
  - [x] Domain registrieren
  - [x] DNS auf Netlify, Primary Domain eingetragen, HTTPS aktiv
  - [ ] Google Search Console: Domain-Property per DNS bestätigen, Adressänderung von der alten Property melden, Sitemap einreichen
- [ ] **Cookie-Banner mit Google Tag Manager und GA4** (Setup wie auf frysch.studio)
  - vanilla-cookieconsent v3, Opt-in, Cookie `cc_cookie`, schwebender Button zum erneuten Öffnen der Einstellungen
  - GTM erst nach Einwilligung laden, Dienste-Beschreibung (GA4, Anbieter, Cookies `_ga`/`_ga_*`, Laufzeit) als Konfiguration
  - Google Consent Mode v2 (Standard: alles `denied`, Update bei Zustimmung)
  - Banner-Texte DE/EN, Design passend zum Classic-Look
  - In GTM die vorhandenen `dataLayer`-Events als GA4-Events anlegen
- [x] **Eigenes Impressum und eigene Datenschutzerklärung** (`/impressum`, `/datenschutz`, EN als Übersetzung) für eine private, nicht kommerzielle Seite: nur Name, Anschrift, E-Mail `findyourmain@pm.me`, frysch.studio nur als Ersteller, `noindex`, nicht in der Sitemap
  - [ ] Anschrift prüfen: Im Impressum steht aktuell die Adresse aus dem frysch.studio-Impressum (Hofstelle 10, Gemmingen). Falls privat eine andere gilt, austauschen
  - [ ] Datenschutz um Cookie-Banner, Google Tag Manager und GA4 erweitern, sobald diese eingebaut sind (Textbausteine von frysch.studio übernehmen)
- [x] Über-uns-Seite: privates Fanprojekt von Benny, Kontakt findyourmain@pm.me
- [x] Go-live auf findyourmain.com (13.10.2026)
- [x] URLs ohne Schrägstrich am Ende direkt ausliefern (`autoSubfolderIndex: false`), sonst leitet Netlify jede Seite um
- [ ] `www.findyourmain.com`: HTTPS-Zertifikat in Netlify prüfen (DNS stimmt, Zertifikat war beim Go-live noch nicht aktiv)

### UX & Design
- [x] Logo-Reiter Retail/Forever: beide Logos gleich hoch (feste Höhe statt fester Breite)
- [x] Arena: Kampflog erst einblenden, wenn der Kampf startet
- [x] Siegerauswertung: Podium Platz 1–3, Sieger hervorgehoben, Kampfstatistik (Schaden, Heilung, Krits, Ausweichen, Kills, Runden) und Auszeichnungen
- [x] Nach dem Kampf: Haupt-CTA zur Klassenseite des Siegers, Links zu Platz 2 und 3, „Nochmal kämpfen“ zweitrangig, Auswertung schließbar
- [x] Echte Fähigkeitsnamen (DE/EN, per Wowhead-Spell-ID geprüft), Forever-Arena mit Classic-Fähigkeiten statt Retail-Fähigkeiten
- [x] Falsche deutsche Fähigkeitsnamen in den Klassentexten korrigiert (z. B. Abbitte, Paralyse, Teufelsrausch, Blutsauger)
- [ ] Noch per Wowhead prüfen (wurde gedrosselt): Chaosblitz, Augenstrahl, Staffelung, Wiedergeburt, Rufer-Fähigkeiten (Emporschwingen, Schweben, Feueratem, Desintegration), Classic-Priester (Gedankenkontrolle, Psychischer Schrei, Schattengestalt), Windzorn
- [x] Zufallsklasse im Loot-Stil: Beutefenster mit Qualität und Wurf (1–100), „Bedarf!“, Verlauf der letzten Würfe, Link zur Klassenseite
- [x] Klassen-Quiz im Quest-Stil: Quest-Angebot mit Questzielen, Fragen als Dialog-Optionen, Ergebnis als „Quest abgeschlossen“ mit Belohnungen (Top 3) zur Klassenseite
- [x] Questgeber „Thalgrim Eichenhorn <Lehrmeister aller Klassen>“ (eigene Figur, kein Blizzard-Charakter) mit RP-Questtext, Belohnungen, Kommentar vor jeder Frage und zum Ergebnis
- [x] Quest ablehnen: drei immer frechere Reaktionen, danach Weg zum Zufallsgenerator; „Quest angenommen/abgeschlossen“-Einblendung wie im Spiel
- [x] Name bleibt nach außen „Klassen-Quiz“ (Suchbegriff „wow class quiz“), die Quest ist die Darstellung im Fenster
- [ ] Idee: Thalgrim auch an anderen Stellen auftauchen lassen (z. B. Tipps auf Klassenseiten, 404-Seite)

### Zeitkritisch
- [ ] Nach dem Forever-Start am 4.11.2026: Forever-Fakten prüfen (Meilenstein-Talente, Skyborne-Fraktionen „High Order“/„Windshaper“, Talentbaum-Namen), `updated`-Datum setzen

### Fachlich
- [ ] Forever-Arena: eigene Classic-Fähigkeiten statt Retail-Fähigkeiten (z. B. hat der Paladin aktuell „Zornige Vergeltung“, gab es in Classic nicht)
- [ ] Bewertungen (Einstieg, Solo) und Quiz-Gewichtung gegenlesen (`app/utils/classInfo.ts`, `foreverInfo.ts`, `quiz.ts`)
- [ ] Deutschen Namen der Skyborne-Fraktionen klären, falls Blizzard einen veröffentlicht

## 💡 Ideen / Ausbau

### SEO-Inhalte (nach Suchvolumen)
- [ ] PvP-Ratgeber „Beste Klasse für PvP“ (US 880 Suchen, SD 23, größtes offenes Keyword)
- [ ] Retail-Völker und Klassen-Kombinationen („wow class race combos“ US 170, „wow klassen und rassen“ DE 140)
- [ ] „Welche Klasse levelt am schnellsten“ (Forever + Retail)
- [ ] Ratgeber pro Rolle für Forever (Tank, Heiler)
- [ ] Spezialisierungs-Seiten (z. B. „Verschlinger Dämonenjäger“), sobald die Klassenseiten ranken

### GEO / KI-Sichtbarkeit
- [ ] Ubersuggest AI Search Visibility für die Marke einrichten (Brand-Slot ist aktuell für frysch.studio belegt)
- [ ] Prüfen, ob ChatGPT/Perplexity die Seite bei „welche WoW Klasse passt zu mir“ nennen

### Reichweite
- [ ] Quiz-Ergebnis teilbar machen (eigene URL + OG-Bild mit Top 3)
- [ ] Arena-Sieger teilbar machen („Mein Main für Forever ist …“)
- [ ] In Communitys teilen: r/wow, r/wownoob, r/classicwow, Discord, Gilden-Seiten

### Features
- [ ] Klassen-Vergleich (zwei Klassen nebeneinander)
- [ ] Arena-Modi: 1 gegen 1, Turnier-Baum
- [ ] Sound-Effekte im Kampf (optional, standardmäßig aus)
- [ ] „Reduzierte Bewegung“ respektieren (Intro-Animationen und Wackeln abschalten)

### Technik
- [ ] Original-Logos (15 MB) aus dem Git-Repo nehmen oder verkleinert ablegen
- [ ] Verbleibende `npm audit`-Meldungen beobachten (nur Dev-/Build-Tooling)
- [ ] Automatischer SEO-Check im Build (Titel-/Beschreibungslängen, H1, hreflang)
