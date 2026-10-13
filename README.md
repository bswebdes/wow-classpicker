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
3. Starte den Development-Server:
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
Die Seite ist für Suchmaschinen (SEO) optimiert. Du kannst die wichtigsten Texte an zwei Stellen pflegen:

1.  **Zentrale Einstellungen (`nuxt.config.ts`):** Unter `runtimeConfig.public` und `app.head` findest du den Seitentitel und die allgemeine Beschreibung.
2.  **Seiten-spezifisch (`app/pages/index.vue`):** In der `useSeoMeta` Funktion kannst du den Titel, die Beschreibung und Open-Graph Tags (für Social Media Vorschauen) anpassen.
3.  **Suchmaschinen:** Eine `robots.txt` und `sitemap.xml` befinden sich im `public/` Ordner.

## 📜 Lizenz
Dieses Projekt ist zum Spaß erstellt worden. Nutze es, wie du möchtest!

---
*Viel Erfolg in Midnight! Mögen die RNG-Götter mit dir sein.* 🐲✨
