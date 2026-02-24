import { ref, reactive } from 'vue'

export const classData = {
    warrior: {
        name: 'Krieger',
        emoji: '🛡️',
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
        abilities: [
            { name: 'Tiefflug', damage: 30, msg: 'fliegt einmal quer über die Arena. Heiß!' },
            { name: 'Smaragdblüte', heal: 30, msg: 'lässt Blumen wachsen. Schön grün.', cooldown: 3 },
            { name: 'Ewigkeitsfeuer', damage: 35, msg: 'spuckt Feuer wie ein richtiger Drache.' },
            { name: 'Zeit anhalten', evade: true, msg: 'spult die Zeit einfach zurück. Cheater!', cooldown: 3 }
        ]
    }
}

export const useBattle = () => {
  const selectedClasses = ref(new Set(Object.keys(classData)))
  const characters = ref([])
  const battleLog = ref([])
  const isBattleInProgress = ref(false)
  const isStarted = ref(false)
  const winner = ref(null)

  const addLog = (message, type = '') => {
    battleLog.value.push({ id: Date.now() + Math.random(), message, type })
  }

  const getColoredName = (char) => {
    return `<span class="c-${char.id}">${char.name}</span>`
  }

  const initBattle = () => {
    isStarted.value = true
    characters.value = Array.from(selectedClasses.value).map(id => ({
      id,
      name: classData[id].name,
      emoji: classData[id].emoji,
      maxHp: 100,
      hp: 100,
      abilities: classData[id].abilities.map(a => ({ ...a, currentCD: 0 })),
      alive: true,
      evadeNext: false,
      status: 'Bereit!',
      isShaking: false
    }))
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
          if (target.evadeNext) {
            target.evadeNext = false
            addLog(`${getColoredName(target)} weicht dem Angriff von ${getColoredName(attacker)} elegant aus!`, 'evade')
            target.status = 'Ausgewichen!'
          } else {
            target.hp = Math.max(0, target.hp - ability.damage)
            target.isShaking = true
            setTimeout(() => { target.isShaking = false }, 500)
            
            if (target.hp <= 0 && target.alive) {
              target.alive = false
              target.status = 'BESIEGT'
              addLog(`${getColoredName(target)} ist ausgeschieden!`, 'important')
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
    }
    // Vue 3 Set reactivity fix (triggering manual update or use array)
    selectedClasses.value = new Set(selectedClasses.value)
  }

  const selectAll = () => {
    selectedClasses.value = new Set(Object.keys(classData))
  }

  const deselectAll = () => {
    selectedClasses.value = new Set()
  }

  return {
    selectedClasses,
    characters,
    battleLog,
    isBattleInProgress,
    isStarted,
    winner,
    initBattle,
    startBattle,
    resetBattle,
    toggleClass,
    selectAll,
    deselectAll
  }
}
