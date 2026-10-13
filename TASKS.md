# Tasks – Find Your Main (WoW Class Picker)

Stand: 13.10.2026 · live auf [findyourmain.com](https://findyourmain.com), Branch `master` (Push deployt automatisch)

## 🔲 Offen

### Zeitkritisch
- [ ] Nach dem Forever-Start am 4.11.2026: Forever-Fakten prüfen (Meilenstein-Talente, Skyborne-Fraktionen „High Order“/„Windshaper“, Talentbaum-Namen), `updated`-Datum setzen
- [ ] Ebenfalls nach dem Start: Übernimmt Forever die Classic-Klassenquests (Haltungen, Totems, Dämonen, Reittiere)? Lore-Abschnitte der Forever-Klassenseiten anpassen
- [ ] Deutschen Namen der Skyborne-Fraktionen klären, sobald Blizzard einen veröffentlicht

### Fachlich
- [x] Quiz-Gewichtung gegenlesen (`app/utils/quiz.ts`)
- [x] Lore-Texte der Klassenseiten gegenlesen (Benny)
- [x] Verschlinger-Dämonenjäger: Fähigkeiten ergänzt (Verzehren, Ernten, Leerenmetamorphose, Leerenstrahl, Kollabierender Stern; IDs über die Wowhead-Suche gefunden und per Tooltip-API geprüft)

### SEO-Inhalte (nach Suchvolumen)
- [ ] PvP-Ratgeber „Beste Klasse für PvP“ (US 880 Suchen, SD 23, größtes offenes Keyword)
- [ ] Retail-Völker und Klassen-Kombinationen („wow class race combos“ US 170, „wow klassen und rassen“ DE 140)
- [ ] „Welche Klasse levelt am schnellsten“ (Forever + Retail)
- [ ] Ratgeber pro Rolle für Forever (Tank, Heiler)
- [ ] Spezialisierungs-Seiten (z. B. „Verschlinger Dämonenjäger“), sobald die Klassenseiten ranken

### GEO / KI-Sichtbarkeit
- [ ] Sitemap (`/sitemap_index.xml`) in den Bing Webmaster Tools einreichen (Bing beliefert ChatGPT und Copilot)
- [ ] Ubersuggest AI Search Visibility für die Marke einrichten (Brand-Slot ist aktuell für frysch.studio belegt)
- [ ] Prüfen, ob ChatGPT/Perplexity die Seite bei „welche WoW Klasse passt zu mir“ nennen

### Reichweite
- [ ] Quiz-Ergebnis teilbar machen (eigene URL + OG-Bild mit Top 3)
- [ ] Arena-Sieger teilbar machen („Mein Main für Forever ist …“)
- [ ] In Communitys teilen: r/wow, r/wownoob, r/classicwow, Discord, Gilden-Seiten

### Features & Ideen
- [ ] Klassen-Vergleich (zwei Klassen nebeneinander)
- [ ] Arena-Modi: 1 gegen 1, Turnier-Baum
- [ ] Sound-Effekte im Kampf (optional, standardmäßig aus)
- [ ] Thalgrim auch an anderen Stellen auftauchen lassen (z. B. Tipps auf Klassenseiten, 404-Seite)
- [ ] Weitere Erfolge: Forever-Quiz abschließen, alle Völker-Kombis gewürfelt, Arena-Sieg mit einem selbst benannten Kämpfer

### Technik
- [ ] Original-Logos (15 MB) aus dem Git-Repo nehmen oder verkleinert ablegen
- [ ] Verbleibende `npm audit`-Meldungen beobachten (nur Dev-/Build-Tooling)
- [ ] Automatischer SEO-Check im Build (Titel-/Beschreibungslängen, H1, hreflang)

## ✅ Erledigt

### Go-live & Recht
- [x] Domain `findyourmain.com` (Marke „Find Your Main“): registriert, DNS auf Netlify, HTTPS inkl. `www`, 301 von `netlify.app` und `www`, Search Console mit Sitemap, live seit 13.10.2026
- [x] Eigenes Impressum und eigene Datenschutzerklärung für eine private, nicht kommerzielle Seite (`findyourmain@pm.me`, frysch.studio nur als Ersteller, `noindex`, nicht in der Sitemap)
- [x] Über-uns-Seite: privates Fanprojekt von Benny, Quellen und Bewertungsmethode

### Tracking & Einwilligung
- [x] Cookie-Banner (vanilla-cookieconsent v3, Opt-in) mit Kategorien Notwendig / Erfolge speichern / Wowhead-Tooltips / Statistik
- [x] Google Consent Mode v2, GTM `GTM-MSF6PT29` erst nach Zustimmung, GA4 eingerichtet nach `docs/gtm-ga4-setup.md`
- [x] Events nur nach Einwilligung: `battle_start/victory/reset`, `quiz_start/decline/complete`, `random_roll`, `result_class_click`, `achievement_unlocked`, `mode_switch`, `language_switch`, `faq_open`

### Technik
- [x] Nuxt 4, Tailwind CSS 4, @nuxtjs/i18n 10, Nuxt Content (DE/EN), Vorrendern, Node 24 auf Netlify
- [x] Schriften selbst gehostet, Logos als WebP über `@nuxt/image`, URLs ohne Schrägstrich am Ende (`autoSubfolderIndex: false`)

### SEO & GEO
- [x] Keyword-Recherche mit Ubersuggest (`docs/seo-recherche.md`)
- [x] Sitemap-Index mit `lastmod` und hreflang-Paaren, `robots.txt` mit Content Signals, hreflang/Canonical auf allen Seiten
- [x] Schema.org (WebPage/FAQPage, Article, Breadcrumb, ItemList, SoftwareApplication), OG-Bild pro Seite
- [x] `llms.txt`, `llms-full.txt` und Markdown-Version jeder Seite, „Kurz gesagt“-Box und FAQs

### Inhalte
- [x] Retail: 13 Klassenseiten, Forever: 9 Klassenseiten mit Völker-Matrix (56 Kombinationen), jeweils Quiz und Zufallsgenerator
- [x] Klassenseiten mit Lore-Abschnitt und eigenem Abschnitt je Spezialisierung bzw. Talentbaum (Spielgefühl, typische Fähigkeiten)
- [x] Bewertungsmethodik (Einstieg und Solo) auf der Über-uns-Seite, mit Community-Quellen abgeglichen, aus jeder Bewertungsbox verlinkt
- [x] 8 Ratgeber: Klassenwahl, Anfänger, Solo, Tanks, Heiler, Klassenfarben (mit Farbkacheln zum Kopieren), Forever-Klassenwahl, Forever-Völker

### Wowhead
- [x] Fähigkeiten in Texten, Kampflog und Unit-Frames verlinkt (Retail- bzw. Forever-Datenbank), alle Namen und IDs über die Wowhead-Tooltip-API geprüft
- [x] Original-Tooltips nur mit Einwilligung, Datenschutz ergänzt
- [x] Retail-Krieger nutzt „Tödlicher Stoß“ statt „Heldenhafter Stoß“ (gibt es in Midnight nicht mehr), Forever-Arena mit Classic-Fähigkeiten

### Design & UX
- [x] Classic-WoW-Look, Header mit Wappen und Retail/Forever-Reitern, DE|EN-Umschalter
- [x] Arena: Unit-Frames, Kampflog, Damage-Meter, eindeutige Kämpfernamen, Siegerauswertung mit Podium, Statistik und Auszeichnungen
- [x] Klassen-Quiz als Quest mit Questgeber Thalgrim Eichenhorn, inklusive Ablehnen-Reaktionen
- [x] Zufallsklasse im Loot-Stil mit Walzen-Animation, Item-Tooltip und gezieltem Neuwürfeln von Spec/Volk

### Erfolge
- [x] 13 Erfolge mit Popup, Punktezähler im Header und Erfolgsliste unter `/erfolge`, dauerhaft nur mit Einwilligung

### Mobil & Barrierefreiheit
- [x] Mobile Navigation mit Menü-Button, Skip-Link, sichtbarer Fokus, „Bewegung reduzieren“ wird respektiert
- [x] axe-core-Audit (WCAG 2.1 AA + Best Practices) Desktop und Mobil: 0 Verstöße
