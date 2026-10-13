# SEO-Recherche WoW Class Picker

Stand: 13.10.2026, Daten aus Ubersuggest (Märkte: Deutschland/Deutsch und USA/Englisch).
SD = SEO Difficulty (0–100, unter 30 ist für eine junge Seite realistisch).

## Ausgangslage

- `wow-classpicker.netlify.app` hat aktuell praktisch keinen organischen Traffic (0–18 Besuche/Monat, 0–3 Keywords).
- Ubersuggest zeigt für die Domain Authority 93 an, das ist aber der Wert von `netlify.app`, nicht der eigenen Seite.
- Die Seite bestand nur aus einer einzigen URL, es gab keine Inhalte, die Suchanfragen beantworten.

## Wichtigste Erkenntnisse

1. **Die Picker-/Randomizer-Nische ist schwach besetzt.** Für „wow class picker“ ranken Seiten mit Domain Authority 1–36 (wowhub.com.ua, wowclasspicker.com, spinthewheel.app). Mit guter Seite gut erreichbar.
2. **Deutsche Long-Tails existieren, haben aber kaum messbares Volumen.** Google Autocomplete zeigt viele Varianten („welche wow klasse passt zu mir“, „… quiz“, „… test“, „wow welche klasse für anfänger“), Ubersuggest misst sie mit 0–10. Große deutsche Volumina gibt es nur bei Midnight-Themen.
3. **Tier-Listen sind groß, aber nicht unser Spielfeld.** „wow midnight tier list“ (DE 6.600, US 3.600) wird von Wowhead, Icy Veins, wow.gg und großen Magazinen dominiert und braucht ständig aktuelle Daten.
4. **WoW Forever startet am 4. November 2026.** Autocomplete zeigt bereits „welche klasse wow forever“ und „should i play wow forever“. Das ist eine zeitkritische Chance.

## Keywords nach Cluster

### Tools (umgesetzt: Startseite, Quiz, Zufallsgenerator)

| Keyword | Markt | Volumen | SD |
| --- | --- | --- | --- |
| wow class quiz | US | 210 | 26 |
| wow class picker | US | 90 | 9 |
| random wow class generator | US | 90 | 6 |
| random wow class picker | US | 50 | 6 |
| wow class randomizer | US | 50 | 7 |
| wow class wheel | US | 50 | 8 |
| wow klassen quiz | DE | 50 | 21 |
| welche wow klasse passt zu mir (quiz/test) | DE | Autocomplete | 4 |

### Klassenübersicht und Klassenseiten (umgesetzt)

| Keyword | Markt | Volumen | SD |
| --- | --- | --- | --- |
| wow klassen | DE | 1.900 | 21 |
| wow klassen ranking | DE | 170 | 23 |
| wow klassen guide(s) | DE | 140–170 | 22–32 |
| wow klassen und rassen | DE | 140 | 28 |
| wow class list | US | 320 | 37 |
| wow midnight dämonenjäger / mage / hunter | DE | 90–110 | 20–36 |

### Ratgeber (umgesetzt)

| Keyword | Markt | Volumen | SD | Seite |
| --- | --- | --- | --- | --- |
| best wow class for pvp | US | 880 | 23 | noch offen |
| best wow healer | US | 720 | 21 | Heiler-Klassen |
| best tank wow | US | 590 | 28 | Tank-Klassen |
| best wow class for solo | US | 390 | 23 | Solo-Klassen |
| wow class color | US | 390 | 27 | Klassenfarben |
| easiest wow class | US | 210 | 27 | Anfänger |
| wow healer classes | US | 260 | 29 | Heiler-Klassen |
| what wow class should i play | US | 30–140 | 24–25 | Entscheidungs-Guide |
| wow klassen schwierigkeitsgrad | DE | 70 | 21 | Anfänger / Übersicht |

## Nächste Schritte (Vorschlag)

1. **WoW-Forever-Ratgeber** vor dem 4. November: „Welche Klasse in WoW Forever?“ (DE/EN). Fakten erst nach offizieller Klassenliste schreiben.
2. **PvP-Ratgeber**: „best wow class for pvp“ ist mit 880/SD 23 das größte offene Keyword. Evergreen schreiben (Spielstil statt Meta).
3. **Klassen & Völker**: „wow class race combos“ (US 170), „wow klassen und rassen“ (DE 140). Braucht eine verlässliche Datentabelle.
4. **Eigene Domain** statt `netlify.app`-Subdomain (z. B. `classpicker.frysch.studio`, war in der alten Config schon vorgesehen). Stärkt die Marke und macht Backlinks wertvoller.
5. **Google Search Console**: Sitemap `/sitemap_index.xml` einreichen (die alte Sitemap zeigte auf eine Vercel-Domain).
6. **Backlinks**: In Reddit (r/wow, r/wownoob), Discord-Communities und bei Gilden-Seiten das Quiz und den Picker teilen. Die Quiz-Ergebnisse und Klassenfarben sind gut teilbar.
