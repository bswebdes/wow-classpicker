# Tasks – Find Your Main (WoW Class Picker)

Stand: 13.10.2026 · live auf [findyourmain.com](https://findyourmain.com), Branch `master` (Push deployt automatisch)

## 🔲 Offen

### Zeitkritisch
- [ ] Nach dem Forever-Start am 4.11.2026: Forever-Fakten prüfen (Meilenstein-Talente, Skyborne-Fraktionen „High Order“/„Windshaper“, Talentbaum-Namen), `updated`-Datum setzen
- [ ] Ebenfalls nach dem Start: Übernimmt Forever die Classic-Klassenquests (Haltungen, Totems, Dämonen, Reittiere)? Lore-Abschnitte der Forever-Klassenseiten anpassen
- [ ] Ebenfalls nach dem Start: Stimmt die Classic-Annahme in den Ratgebern „WoW Forever schnell leveln“, „Forever-Tanks“ und „Forever-Heiler“ (Klassen, Paladin-Tank mit Meilenstein-Talenten, Erste Hilfe)? Hinweis-Kästen danach anpassen
- [ ] Deutschen Namen der Skyborne-Fraktionen klären, sobald Blizzard einen veröffentlicht
- [ ] Mit Patch 12.2: Paladin für Nachtelf, Troll und Untote von `upcomingClasses` nach `classes` verschieben (`app/utils/retailRaces.ts`), Ratgeber „Klassen & Völker“ anpassen

### SEO-Inhalte (nach Suchvolumen)
- [ ] Forever-Talentbaum-Seiten nach dem Start (Bäume werden in Forever überarbeitet), Retail-Vorbild: `/klassen/<klasse>/<spec>`
- [ ] Spec-Seiten bei größeren Patches prüfen (Fähigkeiten-Namen ändern sich, z. B. „Schattenwort: Wahnsinn“), Linktexte kommen über `scripts/expand-spells.mjs` von Wowhead

### Reichweite
- [ ] In Communitys teilen: r/wow, r/wownoob, r/classicwow, Discord, Gilden-Seiten

### Features & Ideen
- [ ] Arena-Modi: 1 gegen 1, Turnier-Baum
- [ ] Sound-Effekte im Kampf (optional, standardmäßig aus)
- [ ] Thalgrim auch an anderen Stellen auftauchen lassen (z. B. Tipps auf Klassenseiten, 404-Seite), ggf. im Quest-Text als Zwerg erkennbar machen („bei meinem Bart“)

### Technik
- [ ] Weitere Vergleichspaare indexieren, sobald Ubersuggest dafür Suchvolumen zeigt (`indexedPairs` in `app/utils/compare.ts`)
- [ ] `npm audit` beobachten: 24 Meldungen (node-forge, braces/micromatch, simple-git) stecken nur im Build- und Dev-Werkzeug von Nuxt, ohne passenden Fix für Nuxt 4. Bei Nuxt-Updates erneut prüfen

## ✅ Erledigt

### Go-live & Recht
- [x] Domain `findyourmain.com` (Marke „Find Your Main“): registriert, DNS auf Netlify, HTTPS inkl. `www`, 301 von `netlify.app` und `www`, Search Console mit Sitemap, live seit 13.10.2026
- [x] Eigenes Impressum und eigene Datenschutzerklärung für eine private, nicht kommerzielle Seite (`findyourmain@pm.me`, frysch.studio nur als Ersteller, `noindex`, nicht in der Sitemap)
- [x] Über-uns-Seite: privates Fanprojekt von Benny, Quellen und Bewertungsmethode

### Tracking & Einwilligung
- [x] Cookie-Banner (vanilla-cookieconsent v3, Opt-in) mit Kategorien Notwendig / Erfolge speichern / Wowhead-Tooltips / Statistik
- [x] Google Consent Mode v2, GTM `GTM-MSF6PT29` erst nach Zustimmung und nur auf `findyourmain.com` (lokal und auf Testadressen nie), GA4 eingerichtet nach `docs/gtm-ga4-setup.md` inkl. „Erweiterung 1“ (Ereignis `share`)
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
- [x] 40 Spec-Seiten (Retail, DE + EN) mit Kurzantwort, Steckbrief, Kernmechanik, Fähigkeiten, Lore, Stärken/Schwächen und eigener FAQ, verlinkt von den Klassenseiten; Klassen-FAQ ausgebaut (Retail + Forever)
- [x] 14 Ratgeber: Klassenwahl, Anfänger, Solo, Tanks, Heiler, PvP (US 880), Klassen & Völker (US 170 / DE 140), Schnell leveln Midnight (DE 210), Schnell leveln Forever (auf Classic-Basis, DE 90), Forever-Tanks (DE 90) und Forever-Heiler (US 50), Klassenfarben (mit Farbkacheln zum Kopieren), Forever-Klassenwahl, Forever-Völker

### Bilder
- [x] Offizielle Blizzard-Bilder (Nutzung auf nicht kommerziellen Fanseiten laut Blizzard Legal FAQ, Nachweis unter jedem Ratgeber/jeder Klassenseite, Quellen in `docs/bildquellen.md`): Klassen-Artworks im Text, Klassen-Reihen und Völker-Porträts in den Ratgebern, Hauptbild auf jeder Klassenseite und jedem Ratgeber, auch als Hintergrund im OG-Bild

### Wowhead
- [x] Fähigkeiten in Texten, Kampflog und Unit-Frames verlinkt (Retail- bzw. Forever-Datenbank), alle Namen und IDs über die Wowhead-Tooltip-API geprüft
- [x] Original-Tooltips nur mit Einwilligung, Datenschutz ergänzt
- [x] Retail-Krieger nutzt „Tödlicher Stoß“ statt „Heldenhafter Stoß“ (gibt es in Midnight nicht mehr), Forever-Arena mit Classic-Fähigkeiten

### Design & UX
- [x] Classic-WoW-Look, Header mit Wappen und Retail/Forever-Reitern, DE|EN-Umschalter
- [x] Neues Wappen als SVG (`app/utils/crestSvg.ts`): Schild mit Goldrand, Edelstein, gekreuzt Schwert und Zauberstab, violett (Retail) bzw. rot/bernstein (Forever); Favicon (SVG, PNG 32, Apple-Touch-Icon) und Logo-PNG für Schema.org per `node scripts/generate-icons.mjs`
- [x] Arena: Unit-Frames, Kampflog, Damage-Meter, eindeutige Kämpfernamen, Siegerauswertung mit Podium, Statistik und Auszeichnungen
- [x] Klassen-Quiz als Quest mit Questgeber Thalgrim Eichenhorn (Zwerg, eigenes Porträt im Questfenster), inklusive Ablehnen-Reaktionen, Quiz-Gewichtung gegengelesen
- [x] Zufallsklasse im Loot-Stil mit Walzen-Animation, Item-Tooltip und gezieltem Neuwürfeln von Spec/Volk

### Klassenvergleich
- [x] Klassenvergleich für Retail und Forever (`/klassen/vergleich`, `/forever/klassen/vergleich`, EN `/classes/compare`): Auswahl zweier Klassen, jede Paarung mit eigener URL (`magier-vs-hexenmeister`, 78 Retail + 36 Forever), Unterschiede als Sätze, Übersichtstabelle, Kurzantworten der Klassenseiten, FAQ, Arena-Link; nur Paare mit Suchvolumen indexierbar (Magier vs. Hexenmeister US 210, Krieger vs. Paladin US 90, Schamane vs. Druide US 30, Forever Magier vs. Hexenmeister US 30), Rest `noindex` und nicht in der Sitemap; umgekehrte Reihenfolge leitet um; verlinkt von Klassenübersicht, Klassenseiten und Footer

### Unterstützung
- [x] Freiwilliger PayPal-Link („Heiltrank spendieren“) als Band über dem Footer und Absatz auf der Über-uns-Seite, nur ein Link ohne PayPal-Skript, Datenschutz ergänzt

### Teilen
- [x] Quiz-Ergebnis und Arena-Sieger teilbar: Seite „Mein Main“ je Klasse und Modus (`/mein-main/<klasse>`, `/en/my-main/<class>`, Forever analog) mit eigenem OG-Bild, Top 3 bzw. Kämpfername in der URL, `noindex`, nicht in der Sitemap; Teilen-Knopf nutzt das System-Menü oder kopiert den Link, GA4-Ereignis `share`
- [x] Arena: große Intro-Texte („Wähle deine Kämpfer“, READY/FIGHT) entfernt, der Kampf startet sofort

### Erfolge
- [x] 21 Erfolge inkl. geheimem Abschluss „Legende von Azeroth“ (neu u. a. Spieglein, Spieglein, Herold von Azeroth, Bibliothekar von Dalaran, Zurück nach Azeroth, Ein Name, den man sich merkt) mit Popup, Punktezähler im Header und Erfolgsliste unter `/erfolge` (oben die drei zuletzt errungenen, wie im WoW-Interface), dauerhaft nur mit Einwilligung

### Mobil & Barrierefreiheit
- [x] Mobile Navigation mit Menü-Button, Skip-Link, sichtbarer Fokus, „Bewegung reduzieren“ wird respektiert
- [x] axe-core-Audit (WCAG 2.1 AA + Best Practices) Desktop und Mobil: 0 Verstöße
