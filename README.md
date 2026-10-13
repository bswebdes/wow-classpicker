# ⚔️ Midnight Class Picker ⚔️

Ein witziger "Pokémon-artiger" Arena-Kampf-Simulator, der dir die schwere Entscheidung abnimmt, welche WoW-Klasse du in der Erweiterung **Midnight** spielen sollst!

## 🎮 Was ist das?
Du kannst dich nicht entscheiden, ob du deinen Schurken, Druiden oder doch den neuen Rufer spielen willst? Lass sie einfach gegeneinander antreten! Der Champion, der als Letztes in der Arena steht, wird dein Main für Midnight.

## ✨ Features
- **Alle 13 WoW-Klassen**: Von Krieger bis Rufer sind alle dabei.
- **Offizielle Klassenfarben**: Das Interface leuchtet in den vertrauten Farben deiner Lieblingsklassen.
- **Witzige Fähigkeiten**: Jede Klasse hat 4 individuelle Skills mit humorvollen Beschreibungen im Kampflog (z.B. "Bier-Wurf" beim Mönch oder "Chaosblitz" beim Hexer).
- **Strategische Tiefe (Light)**: Heil- und Ausweichfähigkeiten haben 3 Runden Abklingzeit (Cooldown), damit die Kämpfe dynamisch bleiben.
- **Interaktive Auswahl**: Wähle gezielt deine Charaktere aus oder schicke mit einem Klick alle 13 in das Gemetzel.
- **Farbiger Kampflog**: Verfolge das Geschehen live in einem übersichtlichen, farblich hervorgehobenen Log.

## 🚀 Installation & Start
Dieses Projekt ist eine **Nuxt 4 App** (Quellcode liegt in `app/`).

1. Clone das Repository.
2. Installiere die Abhängigkeiten:
```bash
npm install
```
3. Starte den Development-Server (Node.js 22.5+ wegen nativer SQLite für Nuxt Content):
```bash
npm run dev
```
4. Öffne `http://localhost:3000` im Browser.

## 🛠 Technologien
- **Nuxt 4**: Das Framework für die Web-App.
- **Vue 3**: Komponentenbasiertes UI (Composition API).
- **Vite**: Superschneller Bundler.
- **Tailwind CSS 4**: Utility-First Styling der kompletten App (über `@tailwindcss/vite`).
- **@nuxtjs/i18n**: Deutsch & Englisch (`i18n/locales/`).
- **TypeScript**: Typisierte Logik (Composables).

## 📈 SEO & Pflege
Die Seite wird beim Build vorgerendert (statisch ausgeliefert) und ist zweisprachig (Deutsch ohne Prefix, Englisch unter `/en`).

- **Inhalte (`content/`)**: Klassenseiten (`de/klassen`, `en/classes`), Ratgeber (`de/ratgeber`, `en/guides`) und Textblöcke für Startseite, Quiz und Zufallsgenerator (`*/blocks`) als Markdown über Nuxt Content. DE- und EN-Ratgeber werden über das Feld `key` verknüpft.
- **Klassendaten (`app/utils/classInfo.ts`)**: Specs, Rollen, Rüstung, Slugs und unsere Bewertungen. Wird von Klassenseiten, Quiz und Zufallsgenerator genutzt. Kampfwerte für die Arena liegen in `app/composables/useBattle.ts`.
- **UI-Texte (`i18n/locales/`)**: `de.json`/`en.json` für die Arena, `*-site.json` für Navigation und neue Seiten.
- **SEO-Module**: Sitemap (`/sitemap_index.xml`), `robots.txt`, Schema.org und automatisch generierte OG-Bilder (`app/components/OgImage/`).
- **Titel & Beschreibungen**: Für Inhaltsseiten im Frontmatter (`title`, `description`), sonst in den i18n-Dateien. Werte mit Doppelpunkt immer in Anführungszeichen setzen.
- **Netlify**: Die Node.js-Version (24) ist in `netlify.toml` festgelegt, Nuxt Content braucht für native SQLite mindestens 22.5.

## 📜 Lizenz
Dieses Projekt ist zum Spaß erstellt worden. Nutze es, wie du möchtest!

---
*Viel Erfolg in Midnight! Mögen die RNG-Götter mit dir sein.* 🐲✨
