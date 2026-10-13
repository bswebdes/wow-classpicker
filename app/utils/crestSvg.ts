// Wappen von Find Your Main als SVG: Schild mit Goldrand, Edelstein (dein „Main“),
// dahinter Schwert und Zauberstab für Nahkampf und Magie. Farbe je Spielmodus.
// Einzige Quelle für Header-Logo und Favicons (scripts/generate-icons.mjs).

type Mode = 'retail' | 'forever'

export const crestSvg = (mode: Mode = 'retail', id = 'crest', options: { weapons?: boolean, favicon?: boolean } = {}) => {
  const weapons = options.weapons ?? true
  const favicon = options.favicon ?? false
  const field = mode === 'forever' ? ['#a3161b', '#3a0405'] : ['#5b2a91', '#12061f']
  const gem = mode === 'forever' ? ['#fff1c2', '#ffb23e', '#c2410c', '#5c1a04'] : ['#f3e8ff', '#c39bff', '#7b3fe4', '#2a0b5c']
  const viewBox = weapons ? '-15 -16 94 100' : '6 3 52 67'
  // Favicon: Stein größer, Rand kräftiger, damit es auch in 16 px klar bleibt
  const gemTransform = favicon ? ' transform="translate(32 36) scale(1.28) translate(-32 -36)"' : ''
  const rim = favicon ? 4.6 : 3.4

  const defs = `<defs>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".45" stop-color="#ffd100"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>
    <linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d96a0"/><stop offset=".5" stop-color="#f4f7fa"/><stop offset="1" stop-color="#5f6772"/></linearGradient>
    <linearGradient id="${id}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${field[0]}"/><stop offset="1" stop-color="${field[1]}"/></linearGradient>
    <radialGradient id="${id}-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${gem[1]}" stop-opacity=".85"/><stop offset="1" stop-color="${gem[1]}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${gem[0]}"/><stop offset=".4" stop-color="${gem[1]}"/><stop offset="1" stop-color="${gem[2]}"/></linearGradient>
  </defs>`

  const sword = `<g transform="rotate(40 32 38)">
    <path d="M32 -16 L36.5 -8 L36.5 54 L27.5 54 L27.5 -8 Z" fill="url(#${id}-s)" stroke="#141414" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M32 -12 L32 52" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>
    <path d="M18 54 Q32 50 46 54 L46 58.5 Q32 55 18 58.5 Z" fill="url(#${id}-g)" stroke="#2a1606" stroke-width="1.1"/>
    <rect x="29.6" y="58" width="4.8" height="13" fill="#5a3416" stroke="#2a1606" stroke-width="1.1"/>
    <path d="M29.6 61 L34.4 61 M29.6 64 L34.4 64 M29.6 67 L34.4 67" stroke="#2a1606" stroke-width=".8"/>
    <circle cx="32" cy="74" r="4" fill="url(#${id}-g)" stroke="#2a1606" stroke-width="1.1"/>
  </g>`

  const staff = `<g transform="rotate(-40 32 38)">
    <rect x="29.8" y="-4" width="4.4" height="84" rx="2.2" fill="#7a4b22" stroke="#2a1606" stroke-width="1.1"/>
    <path d="M29.8 70 L34.2 70 M29.8 73 L34.2 73" stroke="#c9a14a" stroke-width="1.4"/>
    <path d="M21 -6 C21 -16 27 -20 32 -20 C26 -17 25 -10 28 -6 Z M43 -6 C43 -16 37 -20 32 -20 C38 -17 39 -10 36 -6 Z" fill="url(#${id}-g)" stroke="#2a1606" stroke-width="1.1" stroke-linejoin="round"/>
    <path d="M26 -6 L38 -6 L36 -2 L28 -2 Z" fill="url(#${id}-g)" stroke="#2a1606" stroke-width="1.1"/>
    <circle cx="32" cy="-11" r="5.2" fill="url(#${id}-gem)" stroke="${gem[3]}" stroke-width="1.1"/>
    <circle cx="30.3" cy="-12.8" r="1.3" fill="#fff"/>
  </g>`

  const shield = `<path d="M10 12 Q32 5 54 12 L54 36 C54 53 43 63 32 68 C21 63 10 53 10 36 Z" fill="url(#${id}-f)" stroke="url(#${id}-g)" stroke-width="${rim}" stroke-linejoin="round"/>
  ${favicon ? '' : `<path d="M14.5 15.5 Q32 10 49.5 15.5 L49.5 36 C49.5 50 40.5 58.5 32 62.8 C23.5 58.5 14.5 50 14.5 36 Z" fill="none" stroke="#ffd100" stroke-opacity=".35" stroke-width="1"/>`}`

  const jewel = `<g${gemTransform}>
    ${favicon ? '' : `<circle cx="32" cy="36" r="17" fill="url(#${id}-glow)"/>`}
    <path d="M32 20 L43.5 34 L32 52 L20.5 34 Z" fill="url(#${id}-gem)" stroke="${gem[3]}" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M20.5 34 L43.5 34 M32 20 L27 34 L32 52 L37 34 Z" fill="none" stroke="${gem[0]}" stroke-opacity=".55" stroke-width=".9" stroke-linejoin="round"/>
    <path d="M32 20 L27 34 L20.5 34 Z" fill="#fff" fill-opacity=".35"/>
    <circle cx="27.3" cy="27" r="1.4" fill="#fff"/>
  </g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${defs}${weapons ? sword + staff : ''}${shield}${jewel}</svg>`
}
