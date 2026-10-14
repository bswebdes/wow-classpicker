# GTM & GA4 einrichten – Schritt für Schritt

Diese Anleitung richtet Google Analytics 4 (GA4) über den Google Tag Manager (GTM) für **findyourmain.com** ein. Du brauchst keine Vorkenntnisse. Plane etwa 45 Minuten ein.

> Hinweis: Google benennt Menüpunkte gelegentlich um. Wenn ein Name nicht exakt passt, such nach dem ähnlichsten Eintrag.

---

## 0. So hängt alles zusammen

```
Besucher klickt im Cookie-Banner auf „Statistik erlauben“
        │
        ▼
Die Website lädt den Google Tag Manager (GTM-MSF6PT29)
        │
        ▼
GTM lädt GA4 und schickt Seitenaufrufe
        │
        ▼
Die Website meldet Ereignisse (z. B. „Quiz abgeschlossen“) in den dataLayer
        │
        ▼
GTM leitet diese Ereignisse an GA4 weiter
```

Wichtig zu wissen:

- **Ohne Einwilligung passiert gar nichts.** Kein GTM, kein GA4, keine Ereignisse. Das ist im Code bereits so gebaut.
- **Die Website liefert die Ereignisse schon fertig.** Du musst in GTM nur noch sagen: „Schick sie an GA4“.
- **Seitenaufrufe** erfasst GA4 automatisch, auch wenn man ohne Neuladen zwischen Seiten wechselt (siehe Schritt 2.3).

---

## 1. Was wird getrackt?

### Automatisch durch GA4

| Was | Wofür |
| --- | --- |
| Seitenaufrufe (`page_view`) | Welche Seiten werden besucht, woher kommen die Besucher |
| Scrollen (`scroll`) | Werden die Ratgeber bis unten gelesen |
| Externe Links (`click`) | Klicks auf Links zu anderen Websites |

### Von der Website gemeldete Ereignisse

| Ereignis | Wann | Parameter |
| --- | --- | --- |
| `battle_start` | Kampf in der Arena gestartet | `class_count`, `classes`, `game_mode` |
| `battle_victory` | Kampf beendet, Sieger steht fest | `winner`, `rounds`, `game_mode` |
| `battle_reset` | Zurück zur Klassenauswahl | `game_mode` |
| `quiz_start` | Quest im Klassen-Quiz angenommen | `declined_before`, `game_mode` |
| `quiz_decline` | Quest abgelehnt | `count`, `game_mode` |
| `quiz_complete` | Quiz abgeschlossen | `top_classes`, `game_mode` |
| `random_roll` | Zufallsklasse gewürfelt | `class_id`, `spec`, `race`, `game_mode` |
| `result_class_click` | Vom Ergebnis zur Klassenseite geklickt | `source` (arena/quiz/random), `class_id`, `place`, `game_mode` |
| `achievement_unlocked` | Erfolg errungen | `achievement_id` |
| `mode_switch` | Retail ↔ Forever gewechselt | `from_mode`, `to_mode` |
| `language_switch` | Sprache gewechselt | `from_language`, `to_language` |
| `faq_open` | FAQ-Frage aufgeklappt | `question` |

**Die drei wichtigsten Fragen, die du damit beantworten kannst:**

1. Welche Klassen interessieren die Leute am meisten (Quiz-Ergebnisse, Würfe, Klicks)?
2. Führen Arena, Quiz und Zufall wirklich zu den Klassenseiten (`result_class_click`)?
3. Wie viele nutzen Retail und wie viele Forever?

---

## 2. GA4 anlegen

### 2.1 Property erstellen

1. Öffne [analytics.google.com](https://analytics.google.com) und melde dich mit deinem Google-Konto an.
2. Unten links auf **Verwaltung** (Zahnrad) klicken.
3. **+ Erstellen** → **Property**.
4. Eingaben:
   - Name: `Find Your Main`
   - Zeitzone: `Deutschland`
   - Währung: `Euro (€)`
5. **Weiter**, Branche: *Spiele* oder *Kunst & Unterhaltung*, Unternehmensgröße: *Klein*.
6. Ziele: *Nutzerverhalten verstehen* reicht. **Erstellen**.

### 2.2 Datenstream anlegen

1. Plattform **Web** wählen.
2. Website-URL: `https://findyourmain.com`, Name: `findyourmain.com`.
3. **Stream erstellen**.
4. Oben rechts steht jetzt die **Mess-ID**, sie sieht so aus: `G-ABC123XYZ`. **Notier sie dir**, du brauchst sie gleich in GTM.

### 2.3 Erweiterte Messung einstellen

Noch im Datenstream: bei **Erweiterte Messung** auf das Zahnrad klicken.

| Einstellung | Wert | Warum |
| --- | --- | --- |
| Seitenaufrufe | **an** | Pflicht |
| → Erweiterte Einstellungen: „Seitenänderungen basierend auf Ereignissen im Browserverlauf“ | **an** | Die Website wechselt Seiten ohne Neuladen. Ohne diese Option würden die meisten Seitenaufrufe fehlen. |
| Scrollen | **an** | Lesetiefe der Ratgeber |
| Ausgehende Klicks | **an** | Klicks auf externe Links |
| Websitesuche | aus | Gibt es nicht |
| Formularinteraktionen | aus | Gibt es nicht, erzeugt sonst falsche Daten |
| Videointeraktionen | aus | Gibt es nicht |
| Dateidownloads | aus | Gibt es nicht |

**Speichern**.

### 2.4 Datenschutz-Einstellungen (wichtig, so steht es in der Datenschutzerklärung)

Alles unter **Verwaltung** → Spalte **Property** → **Datenerfassung und -änderung**:

1. **Datenaufbewahrung**: Ereignisdaten auf **14 Monate** stellen. **Speichern**.
2. **Datenerfassung**:
   - **Google Signale**: **aus** lassen bzw. ausschalten.
   - **Erfassung von Daten für personalisierte Werbung**: für **alle Regionen deaktivieren**.

Unter **Verwaltung** → Spalte **Konto** → **Kontoeinstellungen**:

3. Bei **Einstellungen für die Datenfreigabe** alle Häkchen **entfernen**. **Speichern**.

### 2.5 Eigene Besuche ausfiltern (optional, empfohlen)

Sonst zählst du deine eigenen Testklicks mit.

1. **Verwaltung** → **Datenstreams** → deinen Stream öffnen → **Tag-Einstellungen konfigurieren** → **Alle anzeigen** → **Internen Traffic definieren**.
2. **Erstellen**: Name `Ich`, `traffic_type` bleibt `internal`, Bedingung *IP-Adresse ist gleich* → deine IP (z. B. über „wie ist meine IP“ googeln).
3. **Verwaltung** → **Datenfilter** → Filter **Interner Traffic** öffnen → Status auf **Aktiv** → **Speichern**.

---

## 3. GTM einrichten

Öffne [tagmanager.google.com](https://tagmanager.google.com) und den Container **GTM-MSF6PT29**.

### 3.1 Datenschichtvariablen anlegen

Damit GTM die Parameter der Ereignisse lesen kann, brauchst du für jeden Parameter eine Variable. Das ist der langweiligste Teil, danach wird es schnell.

Für **jede Zeile** der Tabelle unten:

1. Links **Variablen** → unten bei *Benutzerdefinierte Variablen* auf **Neu**.
2. Oben links den **Variablennamen** aus der mittleren Spalte eintragen, z. B. `DLV - game_mode`.
3. **Variablenkonfiguration** → **Datenschichtvariable**.
4. **Name der Datenschichtvariable**: den Wert aus der rechten Spalte eintragen, z. B. `game_mode`.
5. Version 2 lassen. **Speichern**.

| # | Variablenname (oben links) | Name der Datenschichtvariable |
| --- | --- | --- |
| 1 | `DLV - game_mode` | `game_mode` |
| 2 | `DLV - class_count` | `class_count` |
| 3 | `DLV - classes` | `classes` |
| 4 | `DLV - winner` | `winner` |
| 5 | `DLV - rounds` | `rounds` |
| 6 | `DLV - declined_before` | `declined_before` |
| 7 | `DLV - count` | `count` |
| 8 | `DLV - top_classes` | `top_classes` |
| 9 | `DLV - class_id` | `class_id` |
| 10 | `DLV - spec` | `spec` |
| 11 | `DLV - race` | `race` |
| 12 | `DLV - source` | `source` |
| 13 | `DLV - place` | `place` |
| 14 | `DLV - achievement_id` | `achievement_id` |
| 15 | `DLV - from_mode` | `from_mode` |
| 16 | `DLV - to_mode` | `to_mode` |
| 17 | `DLV - from_language` | `from_language` |
| 18 | `DLV - to_language` | `to_language` |
| 19 | `DLV - question` | `question` |

> Tipp: Achte auf exakte Schreibweise, Groß-/Kleinschreibung und Unterstriche. Ein Tippfehler bedeutet: Der Wert kommt nie an.

### 3.2 Integrierte Variable „Event“ aktivieren

1. **Variablen** → oben bei *Integrierte Variablen* auf **Konfigurieren**.
2. Häkchen bei **Event** setzen (unter „Dienstprogramme“). Fenster schließen.

### 3.3 Google-Tag (GA4-Grundlage)

1. **Tags** → **Neu**.
2. Name: `GA4 - Google-Tag`.
3. **Tag-Konfiguration** → **Google-Tag**.
4. **Tag-ID**: deine Mess-ID aus Schritt 2.2 (`G-...`).
5. **Trigger** → **Initialization - All Pages**.
6. **Speichern**.

Dieser Tag sorgt für die Seitenaufrufe und die automatischen Ereignisse aus Schritt 2.3.

### 3.4 Trigger für alle Website-Ereignisse

Statt zwölf einzelner Trigger reicht einer:

1. **Trigger** → **Neu**.
2. Name: `CE - App Events`.
3. **Triggerkonfiguration** → **Benutzerdefiniertes Ereignis**.
4. **Ereignisname** (genau so kopieren):

   ```
   ^(battle_start|battle_victory|battle_reset|quiz_start|quiz_decline|quiz_complete|random_roll|result_class_click|achievement_unlocked|mode_switch|language_switch|faq_open)$
   ```

5. Häkchen bei **Übereinstimmung mit regulärem Ausdruck verwenden**.
6. *Dieser Trigger wird ausgelöst bei*: **Alle benutzerdefinierten Ereignisse**.
7. **Speichern**.

### 3.5 Ein Tag für alle Website-Ereignisse

1. **Tags** → **Neu**.
2. Name: `GA4 - App Events`.
3. **Tag-Konfiguration** → **Google Analytics: GA4-Ereignis**.
4. **Mess-ID**: wieder deine `G-...`.
5. **Ereignisname**: auf das Baustein-Symbol klicken und **{{Event}}** auswählen. So wird automatisch der richtige Name übernommen.
6. **Ereignisparameter** → für jede Zeile **Parameter hinzufügen**. Links steht der Name (als Text), rechts die Variable:

   | Parametername | Wert |
   | --- | --- |
   | `game_mode` | `{{DLV - game_mode}}` |
   | `class_count` | `{{DLV - class_count}}` |
   | `classes` | `{{DLV - classes}}` |
   | `winner` | `{{DLV - winner}}` |
   | `rounds` | `{{DLV - rounds}}` |
   | `declined_before` | `{{DLV - declined_before}}` |
   | `count` | `{{DLV - count}}` |
   | `top_classes` | `{{DLV - top_classes}}` |
   | `class_id` | `{{DLV - class_id}}` |
   | `spec` | `{{DLV - spec}}` |
   | `race` | `{{DLV - race}}` |
   | `source` | `{{DLV - source}}` |
   | `place` | `{{DLV - place}}` |
   | `achievement_id` | `{{DLV - achievement_id}}` |
   | `from_mode` | `{{DLV - from_mode}}` |
   | `to_mode` | `{{DLV - to_mode}}` |
   | `from_language` | `{{DLV - from_language}}` |
   | `to_language` | `{{DLV - to_language}}` |
   | `question` | `{{DLV - question}}` |

   Keine Sorge: Parameter, die ein Ereignis nicht hat, werden einfach nicht mitgeschickt.

7. **Trigger** → `CE - App Events`.
8. **Speichern**.

---

## 4. Testen, bevor es live geht

### 4.1 GTM-Vorschau

1. In GTM oben rechts auf **Vorschau**.
2. URL eingeben: `https://findyourmain.com` → **Verbinden**.
3. Ein neues Fenster mit der Website öffnet sich. **Ganz wichtig:** Im Cookie-Banner auf **Alle erlauben** klicken. Vorher lädt GTM absichtlich nicht.
4. Falls Tag Assistant „nicht verbunden“ meldet: Seite im Website-Fenster einmal neu laden.
5. Jetzt ein bisschen klicken: eine Klasse ansehen, würfeln, das Quiz durchspielen, einen Kampf starten.
6. Zurück im Tag-Assistant-Fenster siehst du links die Ereignisse. Klick auf z. B. `quiz_complete`:
   - Unter **Tags Fired** muss `GA4 - App Events` stehen.
   - Unter **Variables** siehst du die Werte, z. B. `top_classes = warrior,deathknight,paladin`.

### 4.2 GA4 DebugView

1. In GA4: **Verwaltung** → **DebugView** (unter *Datenanzeige*).
2. Während die GTM-Vorschau läuft, erscheinen dort deine Ereignisse fast in Echtzeit.
3. Klick auf ein Ereignis, rechts siehst du die Parameter.

Wenn beides passt: weiter mit Schritt 5.

---

## 5. Veröffentlichen

1. In GTM oben rechts **Senden**.
2. Versionsname: `GA4 Grundsetup`, Beschreibung: `Google-Tag, App-Events`.
3. **Veröffentlichen**.

Ab jetzt läuft das Tracking für alle, die im Banner zugestimmt haben.

---

## 6. Benutzerdefinierte Definitionen in GA4

Ohne diesen Schritt kommen die Parameter zwar an, tauchen aber in den Berichten nicht auf.

1. GA4 → **Verwaltung** → **Benutzerdefinierte Definitionen**.
2. **Benutzerdefinierte Dimension erstellen**, für jede Zeile:
   - Dimensionsname: wie in der Tabelle (lesbar)
   - Bereich: **Ereignis**
   - Ereignisparameter: exakt wie in der Tabelle

| Dimensionsname | Ereignisparameter |
| --- | --- |
| Spielmodus | `game_mode` |
| Klassen im Kampf | `classes` |
| Sieger | `winner` |
| Quiz-Ergebnis | `top_classes` |
| Klasse | `class_id` |
| Spezialisierung | `spec` |
| Volk | `race` |
| Quelle Ergebnis-Klick | `source` |
| Platz | `place` |
| Erfolg | `achievement_id` |
| Wechsel zu Modus | `to_mode` |
| Wechsel zu Sprache | `to_language` |
| FAQ-Frage | `question` |

3. Unter dem Reiter **Benutzerdefinierte Messwerte** zwei Messwerte anlegen (Bereich **Ereignis**, Maßeinheit **Standard**):

| Messwertname | Ereignisparameter |
| --- | --- |
| Anzahl Kämpfer | `class_count` |
| Runden | `rounds` |

> Die Dimensionen gelten erst ab dem Moment, in dem du sie anlegst. Ältere Daten werden nicht nachträglich zugeordnet. Also am besten direkt nach dem Veröffentlichen machen.

---

## 7. Schlüsselereignisse festlegen

Schlüsselereignisse (früher „Conversions“) sind die Aktionen, die für die Seite wirklich zählen.

1. GA4 → **Verwaltung** → **Ereignisse**. Die Ereignisse erscheinen dort erst, nachdem sie einmal ausgelöst wurden (bis zu 24 Stunden Verzögerung).
2. Bei diesen drei den Schalter **Als Schlüsselereignis markieren** aktivieren:
   - `quiz_complete`: jemand hat das Quiz durchgespielt
   - `battle_victory`: jemand hat einen Kampf zu Ende geschaut
   - `result_class_click`: jemand ist vom Ergebnis zur Klassenseite gegangen

---

## 8. Nützliche Auswertungen

In GA4 unter **Explorative Datenanalysen** → **Leer** anlegen:

| Frage | Dimension | Messwert | Filter |
| --- | --- | --- | --- |
| Welche Klassen gewinnen am häufigsten? | Sieger | Ereignisanzahl | Ereignisname = `battle_victory` |
| Welche Klassen empfiehlt das Quiz am häufigsten? | Quiz-Ergebnis | Ereignisanzahl | Ereignisname = `quiz_complete` |
| Funktioniert der Weg zur Klassenseite? | Quelle Ergebnis-Klick, Klasse | Ereignisanzahl | Ereignisname = `result_class_click` |
| Retail oder Forever? | Spielmodus | Ereignisanzahl | – |
| Welche FAQ-Fragen interessieren? | FAQ-Frage | Ereignisanzahl | Ereignisname = `faq_open` |
| Welche Erfolge erreichen die Leute? | Erfolg | Ereignisanzahl | Ereignisname = `achievement_unlocked` |

Die FAQ-Auswertung ist übrigens auch für SEO wertvoll: Häufig geöffnete Fragen verdienen einen eigenen Ratgeber.

---

## 9. Abschluss-Checkliste

- [ ] GA4-Property „Find Your Main“ mit Web-Stream `findyourmain.com`
- [ ] Erweiterte Messung: „Seitenänderungen im Browserverlauf“ an, Formulare/Suche/Video/Downloads aus
- [ ] Datenaufbewahrung 14 Monate
- [ ] Google Signale aus, personalisierte Werbung aus, Datenfreigabe aus
- [ ] Interner Traffic gefiltert (optional)
- [ ] GTM: 19 Datenschichtvariablen, Variable „Event“ aktiviert
- [ ] GTM: Tag `GA4 - Google-Tag` (Initialization - All Pages)
- [ ] GTM: Trigger `CE - App Events` und Tag `GA4 - App Events`
- [ ] In der Vorschau getestet (mit „Alle erlauben“) und in der DebugView gesehen
- [ ] GTM-Container veröffentlicht
- [ ] Benutzerdefinierte Dimensionen und Messwerte angelegt
- [ ] Schlüsselereignisse markiert

## Später erweitern

Neue Ereignisse kommen im Code über `trackEvent('name', { parameter: wert })` dazu (`app/utils/trackEvent.ts`). Danach in GTM den Namen im Trigger `CE - App Events` ergänzen, neue Parameter als Datenschichtvariable anlegen, im Tag `GA4 - App Events` eintragen und in GA4 als Dimension registrieren.

---

## Erweiterung 1 (13.10.2026): Ergebnis teilen

> **Neu.** Alles oberhalb ist unverändert. Diesen Abschnitt nur einmal abarbeiten, wenn die Grundeinrichtung schon steht.

Quiz-Ergebnis und Arena-Sieger lassen sich jetzt teilen. Dafür gibt es ein neues Ereignis im `dataLayer`:

| Ereignis | Wann | Parameter |
| --- | --- | --- |
| `share` | Klick auf „Ergebnis teilen“ (Quiz) oder „Sieger teilen“ (Arena) | `method` (`native` = Teilen-Menü des Handys, `copy_link` = Link kopiert), `content_type` (`quiz_result` oder `arena_winner`), `item_id` (Klassen-ID, z. B. `mage`) |

`share` ist ein [empfohlenes GA4-Ereignis](https://support.google.com/analytics/answer/9267735), GA4 kennt den Namen also schon.

### E1.1 Drei neue Datenschichtvariablen

Wie in Schritt 3.1 (**Variablen** → **Benutzerdefinierte Variablen** → **Neu** → **Datenschichtvariable**):

| # | Variablenname | Name der Datenschichtvariable |
| --- | --- | --- |
| 20 | `DLV - method` | `method` |
| 21 | `DLV - content_type` | `content_type` |
| 22 | `DLV - item_id` | `item_id` |

### E1.2 Trigger erweitern

1. **Trigger** → `CE - App Events` öffnen.
2. Beim **Ereignisnamen** am Ende `|share` ergänzen. Der komplette Ausdruck lautet dann:

   ```
   ^(battle_start|battle_victory|battle_reset|quiz_start|quiz_decline|quiz_complete|random_roll|result_class_click|achievement_unlocked|mode_switch|language_switch|faq_open|share)$
   ```

3. **Speichern**.

### E1.3 Tag erweitern

1. **Tags** → `GA4 - App Events` öffnen.
2. Unter **Ereignisparameter** drei Zeilen hinzufügen:

   | Parametername | Wert |
   | --- | --- |
   | `method` | `{{DLV - method}}` |
   | `content_type` | `{{DLV - content_type}}` |
   | `item_id` | `{{DLV - item_id}}` |

3. **Speichern**.

### E1.4 In GA4 als Dimensionen registrieren

**Verwalten** → **Benutzerdefinierte Definitionen** → **Benutzerdefinierte Dimension erstellen**, Bereich jeweils **Ereignis**:

| Dimensionsname | Ereignisparameter |
| --- | --- |
| Teilen-Methode | `method` |
| Geteilter Inhalt | `content_type` |
| Geteilte Klasse | `item_id` |

### E1.5 Testen und veröffentlichen

1. GTM-**Vorschau** starten, Cookie-Banner „Statistik“ erlauben.
2. Quiz durchspielen und **Ergebnis teilen** klicken (am PC wird der Link kopiert).
3. In der Vorschau muss `share` erscheinen und `GA4 - App Events` ausgelöst werden, mit `method = copy_link`, `content_type = quiz_result` und der Klasse als `item_id`.
4. Dasselbe im Klassen-Turnier mit **Sieger teilen** (`content_type = arena_winner`, der interne Wert heißt aus Gründen der Vergleichbarkeit weiter so).
5. **Senden** → Version „Teilen-Ereignis“ veröffentlichen.

**Auswertung:** Unter **Berichte** → **Interaktion** → **Ereignisse** → `share` siehst du nach ein bis zwei Tagen, wie oft geteilt wird und welche Klassen am häufigsten geteilt werden. Die Besuche über geteilte Links erkennst du an den Seiten `/mein-main/…` bzw. `/en/my-main/…`.


## Erweiterung 2 (14.10.2026): Spenden-Klicks

> **Neu.** Nur abarbeiten, wenn Erweiterung 1 schon steht.

Die Spendenbox hat jetzt drei Trank-Größen mit vorausgefülltem Betrag (1, 5, 10, auf Deutsch in Euro, auf Englisch in US-Dollar) und einen Link „Eigener Betrag“. Jeder Klick erzeugt ein Ereignis. Ob danach wirklich gespendet wurde, sieht nur PayPal, gemessen wird also das Interesse.

| Ereignis | Wann | Parameter |
| --- | --- | --- |
| `donate_click` | Klick auf einen Trank oder „Eigener Betrag“ | `value` (1, 5 oder 10; 0 = eigener Betrag), `currency` (`EUR` oder `USD`) |

### E2.1 Zwei neue Datenschichtvariablen

| # | Variablenname | Name der Datenschichtvariable |
| --- | --- | --- |
| 23 | `DLV - value` | `value` |
| 24 | `DLV - currency` | `currency` |

### E2.2 Trigger erweitern

`CE - App Events` öffnen und am Ende des Ausdrucks `|donate_click` ergänzen:

```
^(battle_start|battle_victory|battle_reset|quiz_start|quiz_decline|quiz_complete|random_roll|result_class_click|achievement_unlocked|mode_switch|language_switch|faq_open|share|donate_click)$
```

### E2.3 Tag erweitern

`GA4 - App Events` öffnen, unter **Ereignisparameter** zwei Zeilen ergänzen:

| Parametername | Wert |
| --- | --- |
| `value` | `{{DLV - value}}` |
| `currency` | `{{DLV - currency}}` |

### E2.4 In GA4 registrieren

**Benutzerdefinierte Definitionen** → Dimension **Spenden-Währung** (`currency`, Bereich Ereignis) und Messwert **Spenden-Betrag (Klick)** (`value`, Bereich Ereignis, Einheit Standard).

### E2.5 Testen und veröffentlichen

1. GTM-**Vorschau**, „Statistik“ im Cookie-Banner erlauben.
2. Auf einen Trank klicken: `donate_click` mit `value = 5` und `currency = EUR` (auf `/en` mit `USD`).
3. **Senden** → Version „Spenden-Klicks“ veröffentlichen.
