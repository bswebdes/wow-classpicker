# ⚔️ Find Your Main – WoW Class Picker ⚔️

Ein Arena-Kampf-Simulator mit Klassen-Quiz, Zufallsgenerator und Ratgebern, der dir die schwere Entscheidung abnimmt, welche WoW-Klasse du in **Midnight** oder **WoW Forever** spielen sollst!

## 🎮 Was ist das?
Du kannst dich nicht entscheiden, ob du deinen Schurken, Druiden oder doch den neuen Rufer spielen willst? Lass sie einfach gegeneinander antreten! Der Champion, der als Letztes in der Arena steht, wird dein Main für Midnight.

## ✨ Features
- **Alle 13 WoW-Klassen**: Von Krieger bis Rufer sind alle dabei.
- **Offizielle Klassenfarben**: Das Interface leuchtet in den vertrauten Farben deiner Lieblingsklassen.
- **Witzige Fähigkeiten**: Jede Klasse hat 4 individuelle Skills mit humorvollen Beschreibungen im Kampflog (z.B. "Bier-Wurf" beim Mönch oder "Chaosblitz" beim Hexer).
- **Strategische Tiefe (Light)**: Heil- und Ausweichfähigkeiten haben 3 Runden Abklingzeit (Cooldown), damit die Kämpfe dynamisch bleiben.
- **Interaktive Auswahl**: Wähle gezielt deine Charaktere aus oder schicke mit einem Klick alle 13 in das Gemetzel.
- **Farbiger Kampflog**: Verfolge das Geschehen live in einem übersichtlichen, farblich hervorgehobenen Log.

Live: [findyourmain.com](https://findyourmain.com)

## 🚀 Installation & Start
Dieses Projekt ist eine **Nuxt 4 App** (Quellcode liegt in `app/`).

1. Clone das Repository.
2. Installiere die Abhängigkeiten:
```bash
pnpm install
```
3. Starte den Development-Server (Node.js 22.5+ wegen nativer SQLite für Nuxt Content):
```bash
pnpm dev
```
4. Öffne `http://localhost:3000` im Browser.

## 🛠 Technologien
- **Nuxt 4**: Das Framework für die Web-App.
- **Vue 3**: Komponentenbasiertes UI (Composition API).
- **Vite**: Superschneller Bundler.
- **Tailwind CSS 4**: Utility-First Styling der kompletten App (über `@tailwindcss/vite`).
- **@nuxtjs/i18n**: Deutsch & Englisch (`i18n/locales/`).
- **TypeScript**: Typisierte Logik (Composables).

## 📈 SEO, GEO & Pflege
Die Seite wird beim Build vorgerendert (statisch ausgeliefert) und ist zweisprachig (Deutsch ohne Prefix, Englisch unter `/en`). Es gibt zwei Spielmodi: **Retail (Midnight)** und **WoW Forever** unter `/forever`, umschaltbar über die Reiter im Header.

- **Seiten (`app/pages/`)** sind dünne Wrapper. Die eigentlichen Ansichten liegen in `app/components/*View.vue` und bekommen den Modus als Prop (`retail` / `forever`). `useGameMode()` ermittelt den Modus aus der Route.
- **Klassendaten**: `app/utils/classInfo.ts` (Retail) und `app/utils/foreverInfo.ts` (Forever inkl. Völker-Matrix). Daraus entstehen Klassenseiten, Quiz, Zufallsgenerator und die automatisch erzeugten FAQs auf den Klassenseiten. Kampfwerte für die Arena liegen in `app/composables/useBattle.ts`.
- **Inhalte (`content/`)**: Klassenseiten (`de/klassen`, `en/classes`, `*/forever/...`), Ratgeber (`de/ratgeber`, `en/guides`, mit `game: forever` für Forever-Ratgeber) und Textblöcke (`*/blocks`). Frontmatter: `summary` (Kurzantwort oben auf der Seite), `faq`, `date`/`updated`. DE- und EN-Ratgeber werden über `key` verknüpft. Werte mit Doppelpunkt immer in Anführungszeichen setzen.
- **UI-Texte (`i18n/locales/`)**: `de.json`/`en.json` für die Arena, `*-site.json` für alles andere.
- **Design**: Tokens und Komponenten-Klassen (`wow-frame`, `wow-btn`, `wow-tooltip`, `wow-parchment`, `wow-title` …) in `app/assets/css/tailwind.css`. Schriften (Cinzel, Alegreya Sans) werden über `@nuxt/fonts` selbst gehostet.
- **Bilder**: Spiellogos liegen als Original in `app/assets/images` und werden über `@nuxt/image` beim Build zu kleinen WebP-Dateien. Die Originale werden nicht ausgeliefert.
- **SEO-Module**: Sitemap (`/sitemap_index.xml`, Inhaltsseiten mit Sprachalternativen über `server/api/__sitemap__/urls.ts`), `robots.txt`, Schema.org (WebPage/FAQPage, Article, Breadcrumb, ItemList, SoftwareApplication, VideoGame-Bezug), OG-Bilder pro Seite (`app/components/OgImage/`).
- **GEO / KI-Suche**: `nuxt-ai-ready` erzeugt `/llms.txt`, `/llms-full.txt` und Markdown-Versionen jeder Seite (z. B. `/klassen/magier.md`) und setzt Content Signals in der `robots.txt`.
- **Netlify**: Die Node.js-Version (24) ist in `netlify.toml` festgelegt, Nuxt Content braucht für native SQLite mindestens 22.5.

## 📜 Lizenz
Dieses Projekt ist zum Spaß erstellt worden. Nutze es, wie du möchtest!

---
*Viel Erfolg in Midnight! Mögen die RNG-Götter mit dir sein.* 🐲✨
