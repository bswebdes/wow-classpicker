// Beitragsbild für Ratgeber „Bestes Volk für …“: Hintergrund aus public/images/hero plus eine Reihe Volks-Icons
// (public/images/race-icons) mit goldenem Rahmen, im oberen Drittel (darunter liegt der Seitentitel).
// Aufruf: node scripts/hero-races.mjs <ausgabe> <hintergrund> <volk-geschlecht,…>
//   z. B. node scripts/hero-races.mjs race-mage class-mage voidelf-f,dwarf-m,troll-f,tauren-m,bloodelf-f,human-m
// Schreibt public/images/hero/<ausgabe>.webp (1600 px) und <ausgabe>-800.webp.
import sharp from 'sharp'

// optional 4. Argument: Bildausschnitt des Hintergrunds (centre, top, bottom …), Standard centre
const [out, background, list, position = 'centre'] = process.argv.slice(2)
if (!out || !background || !list) {
  console.error('Aufruf: node scripts/hero-races.mjs <ausgabe> <hintergrund> <volk-geschlecht,…>')
  process.exit(1)
}
const W = 1600, H = 900, SIZE = 168, RING = 6
const icons = list.split(',').map(s => s.trim())
const gap = Math.min(56, (W - icons.length * SIZE) / (icons.length + 1))
const rowWidth = icons.length * SIZE + (icons.length - 1) * gap
const top = Math.round(H * 0.22)

const circle = (size, fill, stroke = '') => Buffer.from(
  `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - (stroke ? RING / 2 : 0)}" fill="${fill}" ${stroke ? `stroke="${stroke}" stroke-width="${RING}"` : ''}/></svg>`
)

const layers = []
for (const [i, icon] of icons.entries()) {
  const left = Math.round((W - rowWidth) / 2 + i * (SIZE + gap))
  const inner = SIZE - RING * 2
  const face = await sharp(`public/images/race-icons/${icon}.webp`).resize(inner, inner)
    .composite([{ input: circle(inner, '#fff'), blend: 'dest-in' }]).png().toBuffer()
  // weicher goldener Schein hinter jedem Porträt
  layers.push({ input: await sharp(circle(SIZE + 40, 'rgba(255,209,0,0.35)')).blur(14).png().toBuffer(), left: left - 20, top: top - 20 })
  layers.push({ input: circle(SIZE, '#000', '#ffd100'), left, top })
  layers.push({ input: face, left: left + RING, top: top + RING })
}

const base = sharp(`public/images/hero/${background}.webp`).resize(W, H, { fit: 'cover', position }).modulate({ brightness: 0.85 })
const img = await base.composite(layers).webp({ quality: 78 }).toBuffer()
await sharp(img).toFile(`public/images/hero/${out}.webp`)
await sharp(img).resize(800).webp({ quality: 74 }).toFile(`public/images/hero/${out}-800.webp`)
console.log(`public/images/hero/${out}.webp + -800.webp (${icons.length} Völker)`)
