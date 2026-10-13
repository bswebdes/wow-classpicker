// Erzeugt Favicons und Logo-PNG aus dem Wappen (app/utils/crestSvg.ts).
// Aufruf nach Änderungen am Wappen: node scripts/generate-icons.mjs
import { writeFileSync } from 'node:fs'
import sharp from 'sharp'
import { crestSvg } from '../app/utils/crestSvg.ts'

const favicon = crestSvg('retail', 'fav', { weapons: false, favicon: true })
const full = crestSvg('retail', 'logo')

writeFileSync('public/favicon.svg', favicon)
await sharp(Buffer.from(favicon)).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/favicon.png')
// Apple-Touch-Icon: dunkler Hintergrund, iOS rundet die Ecken selbst
const touch = await sharp(Buffer.from(favicon)).resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
await sharp({ create: { width: 180, height: 180, channels: 4, background: { r: 18, g: 13, b: 7, alpha: 1 } } }).composite([{ input: touch, left: 20, top: 20 }]).png().toFile('public/apple-touch-icon.png')
// Logo für Schema.org und Teilen
await sharp(Buffer.from(full)).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/logo.png')
console.log('Icons erzeugt: favicon.svg, favicon.png, apple-touch-icon.png, logo.png')
