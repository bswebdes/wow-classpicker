# Tasks – Find Your Main (WoW Class Picker)

Stand: 13.10.2026 · live auf [findyourmain.com](https://findyourmain.com), Branch `master` (Push deployt automatisch)

## 🔲 Offen

### Zeitkritisch
- [ ] Nach dem Forever-Start am 4.11.2026: Forever-Fakten prüfen (Meilenstein-Talente, Skyborne-Fraktionen „High Order“/„Windshaper“, Talentbaum-Namen), `updated`-Datum setzen
- [ ] Ebenfalls nach dem Start: Übernimmt Forever die Classic-Klassenquests (Haltungen, Totems, Dämonen, Reittiere)? Lore-Abschnitte der Forever-Klassenseiten anpassen
- [ ] Ebenfalls nach dem Start: Stimmt die Classic-Annahme im Ratgeber „WoW Forever schnell leveln“ (schnellste Klassen, Reittier-Stufe, Erste Hilfe)? Hinweis-Kasten danach anpassen
- [ ] Deutschen Namen der Skyborne-Fraktionen klären, sobald Blizzard einen veröffentlicht
- [ ] Mit Patch 12.2: Paladin für Nachtelf, Troll und Untote von `upcomingClasses` nach `classes` verschieben (`app/utils/retailRaces.ts`), Ratgeber „Klassen & Völker“ anpassen

### SEO-Inhalte (nach Suchvolumen)
- [ ] Ratgeber pro Rolle für Forever (Tank, Heiler)
- [ ] Spezialisierungs-Seiten (z. B. „Verschlinger Dämonenjäger“), sobald die Klassenseiten ranken

### Reichweite
- [ ] In Communitys teilen: r/wow, r/wownoob, r/classicwow, Discord, Gilden-Seiten

### Features & Ideen
- [ ] Klassen-Vergleich (zwei Klassen nebeneinander)
- [ ] Arena-Modi: 1 gegen 1, Turnier-Baum
- [ ] Sound-Effekte im Kampf (optional, standardmäßig aus)
- [ ] Thalgrim auch an anderen Stellen auftauchen lassen (z. B. Tipps auf Klassenseiten, 404-Seite), ggf. im Quest-Text als Zwerg erkennbar machen („bei meinem Bart“)
- [ ] Weitere Erfolge: Forever-Quiz abschließen, alle Völker-Kombis gewürfelt, Arena-Sieg mit einem selbst benannten Kämpfer

### Technik
- [ ] `npm audit` beobachten: 24 Meldungen (node-forge, braces/micromatch, simple-git) stecken nur im Build- und Dev-Werkzeug von Nuxt, ohne passenden Fix für Nuxt 4. Bei Nuxt-Updates erneut prüfen

## ✅ Erledigt

### Go-live & Recht
- [x] Domain `findyourmain.com` (Marke „Find Your Main“): registriert, DNS auf Netlify, HTTPS inkl. `www`, 301 von `netlify.app` und `www`, Search Console mit Sitemap, live seit 13.10.2026
- [x] Eigenes Impressum und eigene Datenschutzerklärung für eine private, nicht kommerzielle Seite (`findyourmain@pm.me`, frysch.studio nur als Ersteller, `noindex`, nicht in der Sitemap)
- [x] Über-uns-Seite: privates Fanprojekt von Benny, Quellen und Bewertungsmethode

### Tracking & Einwilligung
- [x] Cookie-Banner (vanilla-cookieconsent v3, Opt-in) mit Kategorien Notwendig / Erfolge speichern / Wowhead-Tooltips / Statistik
- [x] Google Consent Mode v2, GTM `GTM-MSF6PT29` erst nach Zustimmung, GA4 eingerichtet nach `docs/gtm-ga4-setup.md` inkl. „Erweiterung 1“ (Ereignis `share`)
- [x] Events nur nach Einwilligung: `battle_start/victory/reset`, `quiz_start/decline/complete`, `random_roll`, `result_class_click`, `achievement_unlocked`, `mode_switch`, `language_switch`, `faq_open`, `share`

### Technik
- [x] Nuxt 4, Tailwind CSS 4, @nuxtjs/i18n 10, Nuxt Content (DE/EN), Vorrendern, Node 24 auf Netlify
- [x] Schriften selbst gehostet, Logos als WebP über `@nuxt/image`, URLs ohne Schrägstrich am Ende (`autoSubfolderIndex: false`)
- [x] Logo-Originale von 15 MB auf 1,9 MB verkleinert (960 px Breite, reicht für 2x bei 240 px); alte Versionen bleiben in der Git-Historie
- [x] `npm audit`: `postcss-selector-parser` per `overrides` auf 7.1.6 gehoben (CSS-Ausgabe identisch); `simple-git` 4 bricht die Nuxt DevTools, bleibt deshalb
- [x] Automatischer SEO-Check nach jedem Build (`scripts/seo-check.mjs`, auch `npm run seo:check`): Fehler bei fehlendem Titel/Beschreibung/Canonical/OG-Bild, ≠ 1 H1 oder kaputten hreflang-Links brechen den Build ab; Warnungen bei Titeln über 70 und Beschreibungen über 165 Zeichen

### SEO & GEO
- [x] Keyword-Recherche mit Ubersuggest (`docs/seo-recherche.md`), Ubersuggest-Projekt „Find Your Main“ mit 20 Keywords (DE/US) für das Ranking-Tracking (wöchentlich)
- [x] Sitemap-Index mit `lastmod` und hreflang-Paaren, `robots.txt` mit Content Signals, hreflang/Canonical auf allen Seiten
- [x] Schema.org (WebPage/FAQPage, Article, Breadcrumb, ItemList, SoftwareApplication), OG-Bild pro Seite
- [x] `llms.txt`, `llms-full.txt` und Markdown-Version jeder Seite, „Kurz gesagt“-Box und FAQs
- [x] Sitemap bei Google Search Console und Bing Webmaster Tools eingereicht

### Inhalte
- [x] Retail: 13 Klassenseiten, Forever: 9 Klassenseiten mit Völker-Matrix (56 Kombinationen), jeweils Quiz und Zufallsgenerator
- [x] Klassenseiten mit Lore-Abschnitt und eigenem Abschnitt je Spezialisierung bzw. Talentbaum (Spielgefühl, typische Fähigkeiten), Lore von Benny gegengelesen; Verschlinger-Fähigkeiten über die Wowhead-Suche ergänzt
- [x] Völker-Klassen-Matrix für Retail (26 Völker, 240 Kombis, Quelle: Warcraft Wiki) auf `/klassen#voelker`, spielbare Völker auf jeder Klassenseite
- [x] Bewertungsmethodik (Einstieg und Solo) auf der Über-uns-Seite, mit Community-Quellen abgeglichen, aus jeder Bewertungsbox verlinkt
- [x] 12 Ratgeber: Klassenwahl, Anfänger, Solo, Tanks, Heiler, PvP (US 880), Klassen & Völker (US 170 / DE 140), Schnell leveln Midnight (DE 210), Schnell leveln Forever (auf Classic-Basis, DE 90), Klassenfarben (mit Farbkacheln zum Kopieren), Forever-Klassenwahl, Forever-Völker

### Bilder
- [x] Offizielle Blizzard-Bilder (Nutzung auf nicht kommerziellen Fanseiten laut Blizzard Legal FAQ, Nachweis unter jedem Ratgeber/jeder Klassenseite, Quellen in `docs/bildquellen.md`): Klassen-Artworks im Text, Klassen-Reihen und Völker-Porträts in den Ratgebern, Hauptbild auf jeder Klassenseite und jedem Ratgeber, auch als Hintergrund im OG-Bild

### Wowhead
- [x] Fähigkeiten in Texten, Kampflog und Unit-Frames verlinkt (Retail- bzw. Forever-Datenbank), alle Namen und IDs über die Wowhead-Tooltip-API geprüft
- [x] Original-Tooltips nur mit Einwilligung, Datenschutz ergänzt
- [x] Retail-Krieger nutzt „Tödlicher Stoß“ statt „Heldenhafter Stoß“ (gibt es in Midnight nicht mehr), Forever-Arena mit Classic-Fähigkeiten

### Design & UX
- [x] Classic-WoW-Look, Header mit Wappen und Retail/Forever-Reitern, DE|EN-Umschalter
- [x] Arena: Unit-Frames, Kampflog, Damage-Meter, eindeutige Kämpfernamen, Siegerauswertung mit Podium, Statistik und Auszeichnungen
- [x] Klassen-Quiz als Quest mit Questgeber Thalgrim Eichenhorn (Zwerg, eigenes Porträt im Questfenster), inklusive Ablehnen-Reaktionen, Quiz-Gewichtung gegengelesen
- [x] Zufallsklasse im Loot-Stil mit Walzen-Animation, Item-Tooltip und gezieltem Neuwürfeln von Spec/Volk

### Teilen
- [x] Quiz-Ergebnis und Arena-Sieger teilbar: Seite „Mein Main“ je Klasse und Modus (`/mein-main/<klasse>`, `/en/my-main/<class>`, Forever analog) mit eigenem OG-Bild, Top 3 bzw. Kämpfername in der URL, `noindex`, nicht in der Sitemap; Teilen-Knopf nutzt das System-Menü oder kopiert den Link, GA4-Ereignis `share`
- [x] Arena: große Intro-Texte („Wähle deine Kämpfer“, READY/FIGHT) entfernt, der Kampf startet sofort

### Erfolge
- [x] 13 Erfolge mit Popup, Punktezähler im Header und Erfolgsliste unter `/erfolge`, dauerhaft nur mit Einwilligung

### Mobil & Barrierefreiheit
- [x] Mobile Navigation mit Menü-Button, Skip-Link, sichtbarer Fokus, „Bewegung reduzieren“ wird respektiert
- [x] axe-core-Audit (WCAG 2.1 AA + Best Practices) Desktop und Mobil: 0 Verstöße
