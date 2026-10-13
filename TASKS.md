# Tasks – WoW Class Picker

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
- [ ] **Eigenes Impressum und eigene Datenschutzerklärung** (aktuell verlinkt der Footer auf frysch.studio). Datenschutz muss Umami-Tracking und Netlify-Hosting abdecken
- [ ] Betreiber-Angabe auf der Über-uns-Seite final festlegen (aktuell „frysch.studio, das Webstudio von Benny Schey“)
- [ ] Lokal testen, dann pushen (Netlify deployt automatisch)
- [ ] Sitemap `/sitemap_index.xml` in der Google Search Console einreichen (alte Sitemap zeigte auf eine Vercel-Domain)

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
- [ ] Eigene Domain statt `netlify.app`-Subdomain (z. B. `classpicker.frysch.studio`)
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
