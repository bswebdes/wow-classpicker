import { ref, reactive, computed } from 'vue'

export const classData = {
    warrior: {
        name: 'Krieger',
        emoji: '🛡️',
        description: 'Viel HP und harte Schläge.',
        stats: { hp: 120, crit: 0.1 },
        abilities: [
            { name: 'Hinrichten', damage: 45, msg: 'haut mit dem dicken Schwert drauf! OVERKILL!' },
            { name: 'Schildblock', evade: true, msg: 'versteckt sich hinter seinem Schild.', cooldown: 3 },
            { name: 'Heldenhafter Stoß', damage: 25, msg: 'macht einen sehr... heldenhaften Stoß.' },
            { name: 'Siegesrausch', damage: 20, heal: 20, msg: 'tötet eine imaginäre Ratte und heilt sich!', cooldown: 3 }
        ]
    },
    paladin: {
        name: 'Paladin',
        emoji: '⚖️',
        description: 'Heilung und Unverwundbarkeit.',
        stats: { hp: 100, crit: 0.05 },
        abilities: [
            { name: 'Gottesschild', evade: true, msg: 'wirft die Angstblase an! Unantastbar!', cooldown: 3 },
            { name: 'Urteil des Lichts', damage: 25, heal: 10, msg: 'richtet über das Ziel und klaut ein bisschen Leben.', cooldown: 3 },
            { name: 'Zornige Vergeltung', damage: 40, msg: 'bekommt Flügel! DIE MACHT DES LICHTS!' },
            { name: 'Lichtblitz', heal: 30, msg: 'blendet alle mit einem hellen Licht und heilt sich.', cooldown: 3 }
        ]
    },
    hunter: {
        name: 'Jäger',
        emoji: '🏹',
        description: 'Hoher Schaden, weicht gerne aus.',
        stats: { hp: 90, crit: 0.15 },
        abilities: [
            { name: 'Gezielter Schuss', damage: 35, msg: 'zielt 3 Stunden lang... und TRIFFT!' },
            { name: 'Aspekt der Schildkröte', evade: true, msg: 'wird zu einer Schildkröte. Warum auch immer.', cooldown: 3 },
            { name: 'Fass!', damage: 30, msg: 'schickt sein unsichtbares Pet los. Beiß!' },
            { name: 'Eiskältefalle', damage: 15, msg: 'friert die Füße des Gegners ein. Kalt!' }
        ]
    },
    rogue: {
        name: 'Schurke',
        emoji: '🥷',
        description: 'Glaskanone mit hoher Ausweichchance.',
        stats: { hp: 80, crit: 0.2, dodge: 0.15 },
        abilities: [
            { name: 'Nierenhieb', damage: 25, msg: 'betäubt das Ziel mit einem fiesen Nierenhieb!' },
            { name: 'Meucheln', damage: 35, msg: 'sticht hinterhältig zu! KRIT!' },
            { name: 'Taschendiebstahl', damage: 10, heal: 15, msg: 'stiehlt einen Heiltrank und trinkt ihn selbst!', cooldown: 3 },
            { name: 'Vanish', evade: true, msg: 'verschwindet im Schatten. Nächster Angriff geht ins Leere!', cooldown: 3 }
        ]
    },
    priest: {
        name: 'Priester',
        emoji: '⛪',
        description: 'Starke Heilung, wenig HP.',
        stats: { hp: 85, crit: 0.05 },
        abilities: [
            { name: 'Gedankenschlag', damage: 30, msg: 'verpasst dem Ziel Kopfschmerzen.' },
            { name: 'Machtwort: Schild', evade: true, msg: 'hüllt sich in eine glitzernde Kugel ein.', cooldown: 3 },
            { name: 'Blitzheilung', heal: 40, msg: 'betet ganz schnell für seine Gesundheit.', cooldown: 3 },
            { name: 'Schattenwort: Tod', damage: 40, msg: 'flüstert dem Ziel etwas Gruseliges ins Ohr.' }
        ]
    },
    deathknight: {
        name: 'Todesritter',
        emoji: '💀',
        description: 'Zäh und entzieht Leben.',
        stats: { hp: 115, crit: 0.08 },
        abilities: [
            { name: 'Todesstoß', damage: 25, heal: 20, msg: 'saugt dem Ziel das Leben aus. Lecker!', cooldown: 3 },
            { name: 'Unaufhaltsamer Tod', evade: true, msg: 'läuft ganz langsam weg, ist aber immun gegen alles.', cooldown: 3 },
            { name: 'Heulende Böe', damage: 30, msg: 'pustet den Gegner mit Mundgeruch weg.' },
            { name: 'Armee der Toten', damage: 45, msg: 'ruft seine untoten Kumpels zur Party.' }
        ]
    },
    shaman: {
        name: 'Schamane',
        emoji: '⚡',
        description: 'Vielseitig mit Blitzen und Totems.',
        stats: { hp: 100, crit: 0.12 },
        abilities: [
            { name: 'Kettenblitzschlag', damage: 35, msg: 'ZAPP! Ein Blitz für dich!' },
            { name: 'Heilender Regen', heal: 30, msg: 'lässt es im Raum regnen. Indoor-Wellness.', cooldown: 3 },
            { name: 'Kampfrausch', damage: 20, msg: 'wird ganz rot im Gesicht und schlägt wild um sich!' },
            { name: 'Erdstärketotem', evade: true, msg: 'stellt einen Holzpfosten auf den Boden.', cooldown: 3 }
        ]
    },
    mage: {
        name: 'Magier',
        emoji: '🧙',
        description: 'Explosiver Schaden, aber zerbrechlich.',
        stats: { hp: 80, crit: 0.25 },
        abilities: [
            { name: 'Feuerball', damage: 40, msg: 'wirft einen brennenden Ball. Heiß!' },
            { name: 'Eisblock', evade: true, msg: 'wird zu einem Eiswürfel. Erfrischend!', cooldown: 3 },
            { name: 'Blinzeln', evade: true, msg: 'taucht woanders wieder auf. Magie!', cooldown: 3 },
            { name: 'Verwandlung', damage: 10, msg: 'macht das Ziel zu einem Schaf. Mäh!' }
        ]
    },
    warlock: {
        name: 'Hexenmeister',
        emoji: '😈',
        description: 'Viel Ausdauer und dunkle Magie.',
        stats: { hp: 110, crit: 0.1 },
        abilities: [
            { name: 'Chaosblitz', damage: 45, msg: 'schießt einen grünen Drachenkopf ab. BUMM!' },
            { name: 'Gesundheitsstein', heal: 35, msg: 'isst einen grünen Stein. Schmeckt nach Limette.', cooldown: 3 },
            { name: 'Furcht', damage: 15, msg: 'macht dem Ziel Angst vor der Dunkelheit.' },
            { name: 'Dämonentor', evade: true, msg: 'flüchtet durch ein lila Portal.', cooldown: 3 }
        ]
    },
    monk: {
        name: 'Mönch',
        emoji: '🐼',
        description: 'Mobil und ausgewogen.',
        stats: { hp: 100, crit: 0.1, dodge: 0.1 },
        abilities: [
            { name: 'Tritt der aufgehenden Sonne', damage: 30, msg: 'setzt einen Roundhouse-Kick ein!' },
            { name: 'Bier-Wurf', damage: 20, msg: 'wirft ein Fass Freibier. Das Ziel ist verwirrt!' },
            { name: 'Schadensumleitung', damage: 15, heal: 15, msg: 'leitet sein Karma (und den Schmerz) um!', cooldown: 3 },
            { name: 'Wirbelnder Kranichtritt', damage: 25, msg: 'dreht sich wie ein Brummkreisel!' }
        ]
    },
    druid: {
        name: 'Druide',
        emoji: '🦉',
        description: 'Kann alles ein bisschen.',
        stats: { hp: 105, crit: 0.1 },
        abilities: [
            { name: 'Mondfeuer', damage: 20, msg: 'spamt Mondfeuer! PEW PEW PEW!' },
            { name: 'Nachwachsen', heal: 30, msg: 'verwandelt sich in einen Baum und heilt sich!', cooldown: 3 },
            { name: 'Konvokation der Geister', damage: 40, msg: 'drückt den Panik-Knopf! 16 Zauber gleichzeitig!' },
            { name: 'Kuschelbär', damage: 15, msg: 'rollt als Bär über das Ziel. Flauschig aber schmerzhaft.' }
        ]
    },
    demonhunter: {
        name: 'Dämonenjäger',
        emoji: '🦇',
        description: 'Extrem schnell und aggressiv.',
        stats: { hp: 95, crit: 0.15, dodge: 0.05 },
        abilities: [
            { name: 'Augenstrahl', damage: 40, msg: 'schießt Laser aus den Augen! PEW!' },
            { name: 'Verschwimmen', evade: true, msg: 'macht ganz viele Schattenbilder von sich.', cooldown: 3 },
            { name: 'Metamorphose', damage: 30, heal: 10, msg: 'wird zu einem riesigen Dämon. Roar!', cooldown: 3 },
            { name: 'Gleiten', evade: true, msg: 'segelt elegant über den Boden.', cooldown: 3 }
        ]
    },
    evoker: {
        name: 'Rufer',
        emoji: '🐲',
        description: 'Mittlere Reichweite, gute Heilung.',
        stats: { hp: 100, crit: 0.12 },
        abilities: [
            { name: 'Tiefflug', damage: 30, msg: 'fliegt einmal quer über die Arena. Heiß!' },
            { name: 'Smaragdblüte', heal: 30, msg: 'lässt Blumen wachsen. Schön grün.', cooldown: 3 },
            { name: 'Ewigkeitsfeuer', damage: 35, msg: 'spuckt Feuer wie ein richtiger Drache.' },
            { name: 'Zeit anhalten', evade: true, msg: 'spult die Zeit einfach zurück. Cheater!', cooldown: 3 }
        ]
    }
}

// Zufällige, neutrale Fantasy-Namen (keine Streamer-Namen)
const randomNames = [
  'Aldren', 'Seraphine', 'Borin', 'Lyra', 'Cedric', 'Kaela', 'Dorian', 'Mira', 'Thorin', 'Elara',
  'Garruk', 'Nyra', 'Roland', 'Isolde', 'Fenric', 'Talia', 'Rurik', 'Selene', 'Kael', 'Ysolda',
  'Bram', 'Aveline', 'Corin', 'Neriah', 'Elden', 'Vesper', 'Oren', 'Melia', 'Kellan', 'Rhea',
  'Torin', 'Aria', 'Lucan', 'Nessa', 'Jorik', 'Elowen', 'Dax', 'Liora', 'Faelan', 'Maera',
  'Ronan', 'Sarai', 'Brann', 'Thalia', 'Korin', 'Naida', 'Eryk', 'Viana', 'Rowan', 'Myla'
]

export const useBattle = () => {
  const selectedClasses = ref(new Set(Object.keys(classData)))
  const customNames = reactive({})

  // Initialize with some random names for default selected classes
  Object.keys(classData).forEach(id => {
    if (!customNames[id]) {
      customNames[id] = randomNames[Math.floor(Math.random() * randomNames.length)]
    }
  })

  const characters = ref([])
  const battleLog = ref([])
  const isBattleInProgress = ref(false)
  const isStarted = ref(false)
  const winner = ref(null)

  const getRandomName = () => {
    return randomNames[Math.floor(Math.random() * randomNames.length)]
  }

  const randomizeName = (id) => {
    customNames[id] = getRandomName()
  }

  const randomizeAllNames = () => {
    selectedClasses.value.forEach(id => {
      randomizeName(id)
    })
  }

  const addLog = (message, type = '') => {
    battleLog.value.push({ id: Date.now() + Math.random(), message, type })
  }

  const getColoredName = (char) => {
    return `<span class="c-${char.id}">${char.name}</span>`
  }

  const initBattle = () => {
    isStarted.value = true
    characters.value = Array.from(selectedClasses.value).map(id => {
      const stats = classData[id].stats || {}
      const startHp = stats.hp || 100
      return {
        id,
        name: customNames[id] || classData[id].name,
        className: classData[id].name,
        emoji: classData[id].emoji,
        maxHp: startHp,
        hp: startHp,
        abilities: classData[id].abilities.map(a => ({ ...a, currentCD: 0 })),
        alive: true,
        evadeNext: false,
        status: 'Bereit!',
        isShaking: false,
        stats: stats
      }
    })
    battleLog.value = []
    winner.value = null
    addLog(`Der Kampf beginnt mit ${characters.value.length} Klassen!`)
  }

  const startBattle = async () => {
    if (isBattleInProgress.value) return
    isBattleInProgress.value = true

    while (characters.value.filter(c => c.alive).length > 1) {
      for (const attacker of characters.value) {
        if (!attacker.alive) continue
        if (characters.value.filter(c => c.alive).length <= 1) break

        await new Promise(resolve => setTimeout(resolve, 800))

        // Cooldowns
        attacker.abilities.forEach(a => {
          if (a.currentCD > 0) a.currentCD--
        })

        // Passive Ausweichchance
        const passiveDodge = attacker.stats?.dodge || 0
        
        const availableAbilities = attacker.abilities.filter(a => a.currentCD === 0)
        const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)]

        const potentialTargets = characters.value.filter(c => c.alive && c.id !== attacker.id)
        const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)]

        attacker.status = `Nutzt ${ability.name}...`
        addLog(`${getColoredName(attacker)} nutzt ${ability.name}: ${ability.msg}`)

        if (ability.cooldown) {
          ability.currentCD = ability.cooldown
        }

        if (ability.evade) {
          attacker.evadeNext = true
        }
        if (ability.heal) {
          attacker.hp = Math.min(attacker.maxHp, attacker.hp + ability.heal)
        }
        if (ability.damage) {
          const targetPassiveDodge = target.stats?.dodge || 0
          const isDodged = target.evadeNext || Math.random() < targetPassiveDodge

          if (isDodged) {
            target.evadeNext = false
            addLog(`${getColoredName(target)} weicht dem Angriff von ${getColoredName(attacker)} aus!`, 'evade')
            target.status = 'Ausgewichen!'
          } else {
            let finalDamage = ability.damage
            
            // Crit Chance
            const critChance = attacker.stats?.crit || 0
            if (Math.random() < critChance) {
              finalDamage = Math.floor(finalDamage * 1.5)
              addLog(`KRITISCHER TREFFER von ${getColoredName(attacker)}!`, 'important')
            }

            target.hp = Math.max(0, target.hp - finalDamage)
            target.isShaking = true
            setTimeout(() => { target.isShaking = false }, 500)
            
            if (target.hp <= 0 && target.alive) {
              target.alive = false
              target.status = 'BESIEGT'
              addLog(`${getColoredName(target)} wurde von ${getColoredName(attacker)} eliminiert!`, 'important')
            }
          }
        }
      }
    }

    const champion = characters.value.find(c => c.alive)
    if (champion) {
      winner.value = champion
      addLog(`${getColoredName(champion)} GEWINNT DIE ARENA!`, 'important')
    }
    isBattleInProgress.value = false
  }

  const resetBattle = () => {
    isStarted.value = false
    isBattleInProgress.value = false
    characters.value = []
    winner.value = null
    addLog('Bereit für die nächste Runde? Wähle deine Klassen!')
  }

  const toggleClass = (id) => {
    if (selectedClasses.value.has(id)) {
      selectedClasses.value.delete(id)
    } else {
      selectedClasses.value.add(id)
      if (!customNames[id]) {
        customNames[id] = getRandomName()
      }
    }
    // Vue 3 Set reactivity fix (triggering manual update or use array)
    selectedClasses.value = new Set(selectedClasses.value)
  }

  const selectAll = () => {
    selectedClasses.value = new Set(Object.keys(classData))
    selectedClasses.value.forEach(id => {
      if (!customNames[id]) {
        customNames[id] = getRandomName()
      }
    })
  }

  const deselectAll = () => {
    selectedClasses.value = new Set()
  }

  const totalHp = computed(() => characters.value.reduce((sum, char) => sum + char.hp, 0))
  const totalMaxHp = computed(() => characters.value.reduce((sum, char) => sum + char.maxHp, 0))
  const globalHpPercent = computed(() => {
    if (totalMaxHp.value === 0) return 0
    return Math.max(0, (totalHp.value / totalMaxHp.value) * 100)
  })

  return {
    selectedClasses,
    characters,
    battleLog,
    isBattleInProgress,
    isStarted,
    winner,
    globalHpPercent,
    customNames,
    initBattle,
    startBattle,
    resetBattle,
    toggleClass,
    selectAll,
    deselectAll,
    randomizeName,
    randomizeAllNames
  }
}
