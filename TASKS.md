# Tasks – Find Your Main (WoW Class Picker)

Stand: 14.10.2026 · live auf [findyourmain.com](https://findyourmain.com), Branch `master` (Push deployt automatisch)

## 🔲 Offen

### Zum Forever-Start (4.11.2026)
- [ ] `app/utils/gameVersion.ts`: Forever auf `status: 'live'` und Patch setzen
- [ ] Forever-Fakten gegen die Live-Version prüfen und `updated` setzen:
  - Meilenstein-Talente und Talentbaum-Namen
  - Himmelsgeborene: Volksfähigkeiten, Klassen, Startgebiet Zephras (Ratgeber, Völker-Ratgeber, Klassenseiten)
  - Classic-Klassenquests (Haltungen, Totems, Dämonen, Reittiere) in den Lore-Abschnitten der Klassenseiten
  - Classic-Annahmen in den Ratgebern „Schnell leveln“, „Forever-Tanks“, „Forever-Heiler“ (Paladin-Tank, Erste Hilfe) samt Hinweis-Kästen
- [ ] Forever-Talentbaum-Seiten nach Vorbild `/klassen/<klasse>/<spec>`, sobald die überarbeiteten Bäume feststehen

### Mit Patch 12.2
- [ ] Paladin für Nachtelf, Troll und Untote von `upcomingClasses` nach `classes` verschieben (`app/utils/retailRaces.ts`), Ratgeber „Klassen & Völker“ anpassen

### Reichweite
- [ ] In Communitys teilen: r/wow, r/wownoob, r/classicwow, Discord, Gilden-Seiten

### Features & Ideen
- [ ] Tipp-Datenbank (`app/data/tips.ts`) nach und nach erweitern, z. B. zu jeder Spec und nach dem Forever-Start
- [ ] Turnier-Modi: 1 gegen 1, Turnierbaum
- [ ] Sound-Effekte im Kampf (optional, standardmäßig aus)
- [ ] Thalgrim auch an anderen Stellen auftauchen lassen (z. B. Tipps auf Klassenseiten, 404-Seite), ggf. im Quest-Text als Zwerg erkennbar machen („bei meinem Bart“)

### Technik
- [ ] Ab 14.10.2026, 19:27 Uhr: `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` entfernen (jüngstes der 44 Pakete: 13.10., 17:26 UTC)
- [ ] Netlify-UI: Build-Befehl optional von `npm run build` auf `pnpm run build` umstellen (funktioniert beides)

### Laufend
- [ ] Bei jedem Patch: `app/utils/gameVersion.ts` anpassen (Anzeige „Spielstand“), Spec-Seiten auf geänderte Fähigkeiten prüfen (Namen kommen über `scripts/expand-spells.mjs` von Wowhead)
- [ ] Nach Änderungen an Tool-Seiten (Turnier, Quiz, Zufall): `pnpm indexnow --all`, weil die automatische Meldung nur Seiten mit `lastmod` erfasst
- [ ] Weitere Vergleichspaare indexieren, sobald Ubersuggest Suchvolumen zeigt (`indexedPairs` in `app/utils/compare.ts`)
- [ ] `pnpm audit`: 6 Meldungen (node-forge, braces, simple-git) nur im Build- und Dev-Werkzeug von Nuxt, ohne Fix für Nuxt 4; bei Nuxt-Updates erneut prüfen

## ✅ Erledigt

### Go-live & Recht
- [x] Domain `findyourmain.com` (Marke „Find Your Main“): registriert, DNS auf Netlify, HTTPS inkl. `www`, 301 von `netlify.app` und `www`, Search Console mit Sitemap, live seit 13.10.2026
- [x] Eigenes Impressum und eigene Datenschutzerklärung für eine private, nicht kommerzielle Seite (`findyourmain@pm.me`, frysch.studio nur als Ersteller, `noindex`, nicht in der Sitemap)
- [x] Über-uns-Seite: privates Fanprojekt von Benny, Quellen und Bewertungsmethode

### Tracking & Einwilligung
- [x] Cookie-Banner (vanilla-cookieconsent v3, Opt-in) mit Kategorien Notwendig / Erfolge speichern / Wowhead-Tooltips (Statistik seit 25.10.2026 raus, Revision 2)
- [x] Google Analytics 4 + GTM + Consent Mode komplett entfernt (25.10.2026): Statistik nur noch Umami (cookiefrei), alte `_ga`-Cookies werden beim Besuch gelöscht. GA4-Property und GTM-Container `GTM-MSF6PT29` in Google löschen (Benny)
- [x] Events nur nach Einwilligung: `battle_start/victory/reset`, `quiz_start/decline/complete`, `random_roll`, `result_class_click`, `achievement_unlocked`, `mode_switch`, `language_switch`, `faq_open`, `share`, `donate_click`

### Technik
- [x] Nuxt 4, Tailwind CSS 4, @nuxtjs/i18n 10, Nuxt Content (DE/EN), Vorrendern, Node 24 auf Netlify
- [x] Schriften selbst gehostet, Logos als WebP über `@nuxt/image`, URLs ohne Schrägstrich am Ende (`autoSubfolderIndex: false`)
- [x] Logo-Originale von 15 MB auf 1,9 MB verkleinert (960 px Breite, reicht für 2x bei 240 px); alte Versionen bleiben in der Git-Historie
- [x] `postcss-selector-parser` per `overrides` in `pnpm-workspace.yaml` auf 7.1.6 gehoben (CSS-Ausgabe identisch); `simple-git` 4 bricht die Nuxt DevTools, bleibt deshalb
- [x] pnpm statt npm, Build von 67 auf 49 s (keine Vorrender-Durchläufe für `?classes=`-Links, OG-Bilder nur für echte Seiten: 448 statt 1.140), Spielstand-Anzeige über `app/utils/gameVersion.ts`
- [x] Automatischer SEO-Check nach jedem Build (`scripts/seo-check.mjs`, auch `pnpm seo:check`): Fehler bei fehlendem Titel/Beschreibung/Canonical/OG-Bild, ≠ 1 H1 oder kaputten hreflang-Links brechen den Build ab; Warnungen bei Titeln über 70 und Beschreibungen über 165 Zeichen

### SEO & GEO
- [x] IndexNow (Bing u. a.): Key in `public/`, automatische Meldung geänderter URLs nach jedem Produktions-Deploy (`netlify/functions/deploy-succeeded.mjs`), manuell `pnpm indexnow`
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
- [x] Offizielle deutsche Namen der Skyborne übernommen (Himmelsgeborene, Windformer, Hoher Orden; Blizzard-Artikel 24302071), eigener Ratgeber „Himmelsgeborene in WoW Forever“ (DE + EN)
- [x] 15 Ratgeber: Klassenwahl, Anfänger, Solo, Tanks, Heiler, PvP (US 880), Klassen & Völker (US 170 / DE 140), Schnell leveln Midnight (DE 210), Schnell leveln Forever (auf Classic-Basis, DE 90), Forever-Tanks (DE 90) und Forever-Heiler (US 50), Klassenfarben (mit Farbkacheln zum Kopieren), Forever-Klassenwahl, Forever-Völker, Himmelsgeborene

### Bilder
- [x] Offizielle Blizzard-Bilder (Nutzung auf nicht kommerziellen Fanseiten laut Blizzard Legal FAQ, Nachweis unter jedem Ratgeber/jeder Klassenseite, Quellen in `docs/bildquellen.md`): Klassen-Artworks im Text, Klassen-Reihen und Völker-Porträts in den Ratgebern, Hauptbild auf jeder Klassenseite und jedem Ratgeber, auch als Hintergrund im OG-Bild

### Wowhead
- [x] Fähigkeiten in Texten, Kampflog und Unit-Frames verlinkt (Retail- bzw. Forever-Datenbank), alle Namen und IDs über die Wowhead-Tooltip-API geprüft
- [x] Original-Tooltips nur mit Einwilligung, Datenschutz ergänzt
- [x] Retail-Krieger nutzt „Tödlicher Stoß“ statt „Heldenhafter Stoß“ (gibt es in Midnight nicht mehr), Forever-Turnier mit Classic-Fähigkeiten

### Design & UX
- [x] Classic-WoW-Look, Header mit Wappen und Retail/Forever-Reitern, DE|EN-Umschalter
- [x] Neues Wappen als SVG (`app/utils/crestSvg.ts`): Schild mit Goldrand, Edelstein, gekreuzt Schwert und Zauberstab, violett (Retail) bzw. rot/bernstein (Forever); Favicon (SVG, PNG 32, Apple-Touch-Icon) und Logo-PNG für Schema.org per `node scripts/generate-icons.mjs`
- [x] Klassen-Turnier: Unit-Frames, Kampflog, Damage-Meter, eindeutige Kämpfernamen, Siegerauswertung mit Podium, Statistik und Auszeichnungen
- [x] Klassen-Quiz als Quest mit Questgeber Thalgrim Eichenhorn (Zwerg, eigenes Porträt im Questfenster), inklusive Ablehnen-Reaktionen, Quiz-Gewichtung gegengelesen
- [x] Zufallsklasse im Loot-Stil mit Walzen-Animation, Item-Tooltip und gezieltem Neuwürfeln von Spec/Volk
- [x] Sieg-Dialog mobil, Desktop-Navigation mit Klassen-Megamenü, Footer, Werkzeug-Karten als Item-Tooltips, FAQ im Questlog-Stil
- [x] „Arena“ in „Klassen-Turnier“ umbenannt (keine Verwechslung mit der PvP-Arena)
- [x] Thalgrims Tipps während des Turniers: 63 Tipps (DE/EN) in `app/data/tips.ts`, bevorzugt zu den kämpfenden Klassen, ohne Wiederholung pro Sitzung, mit Pause/Vor/Zurück und Links zu Klassen- und Spec-Seiten (neuer Tab)

### Klassenvergleich
- [x] Klassenvergleich für Retail und Forever (`/klassen/vergleich`, `/forever/klassen/vergleich`, EN `/classes/compare`): Auswahl zweier Klassen, jede Paarung mit eigener URL (`magier-vs-hexenmeister`, 78 Retail + 36 Forever), Unterschiede als Sätze, Übersichtstabelle, Kurzantworten der Klassenseiten, FAQ, Turnier-Link; nur Paare mit Suchvolumen indexierbar (Magier vs. Hexenmeister US 210, Krieger vs. Paladin US 90, Schamane vs. Druide US 30, Forever Magier vs. Hexenmeister US 30), Rest `noindex` und nicht in der Sitemap; umgekehrte Reihenfolge leitet um; verlinkt von Klassenübersicht, Klassenseiten und Footer

### Unterstützung
- [x] Freiwilliger PayPal-Link („Heiltrank spendieren“) als Band über dem Footer und Absatz auf der Über-uns-Seite, nur ein Link ohne PayPal-Skript, Datenschutz ergänzt
- [x] Spenden-Tränke mit vorausgefülltem Betrag (1, 5, 10, DE in Euro, EN in Dollar) plus „Eigener Betrag“; Monetarisierung über Werbung oder Affiliate bewusst verworfen

### Teilen
- [x] Quiz-Ergebnis und Turniersieger teilbar: Seite „Mein Main“ je Klasse und Modus (`/mein-main/<klasse>`, `/en/my-main/<class>`, Forever analog) mit eigenem OG-Bild, Top 3 bzw. Kämpfername in der URL, `noindex`, nicht in der Sitemap; Teilen-Knopf nutzt das System-Menü oder kopiert den Link, Umami-Ereignis `share`
- [x] Turnier: große Intro-Texte („Wähle deine Kämpfer“, READY/FIGHT) entfernt, der Kampf startet sofort

### Erfolge
- [x] 7 neue Erfolge (14.10.2026): Wissbegierig (10 Tipps), Meister der Spezialisierungen (5 Spec-Seiten), Gestaltwandler (geheim, alle Druiden-Specs), Von der Leere berührt (geheim, Verschlinger), Stammgast der Taverne (3 Tage), Ehrenduell (Turnier mit genau 2 Klassen), Neugierig wie ein Gnom (10 FAQ-Antworten); insgesamt 28
- [x] 21 Erfolge inkl. geheimem Abschluss „Legende von Azeroth“ (neu u. a. Spieglein, Spieglein, Herold von Azeroth, Bibliothekar von Dalaran, Zurück nach Azeroth, Ein Name, den man sich merkt) mit Popup, Punktezähler im Header und Erfolgsliste unter `/erfolge` (oben die drei zuletzt errungenen, wie im WoW-Interface), dauerhaft nur mit Einwilligung

### Mobil & Barrierefreiheit
- [x] Mobile Navigation mit Menü-Button, Skip-Link, sichtbarer Fokus, „Bewegung reduzieren“ wird respektiert
- [x] axe-core-Audit (WCAG 2.1 AA + Best Practices) Desktop und Mobil: 0 Verstöße
