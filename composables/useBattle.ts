import { ref, reactive, computed } from 'vue'

export const classData = {
    warrior: {
        emoji: '🛡️',
        icon: 'class-icons/ClassIcon_warrior.webp',
        stats: { hp: 120, crit: 0.1 },
        abilities: {
            execute: { damage: 45, cooldown: 0 },
            shieldblock: { evade: true, cooldown: 3 },
            heroicstrike: { damage: 25, cooldown: 0 },
            victoryrush: { damage: 20, heal: 20, cooldown: 3 }
        }
    },
    paladin: {
        emoji: '⚖️',
        icon: 'class-icons/ClassIcon_paladin.webp',
        stats: { hp: 100, crit: 0.05 },
        abilities: {
            divineshield: { evade: true, cooldown: 3 },
            judgement: { damage: 25, heal: 10, cooldown: 3 },
            avengingwrath: { damage: 40, cooldown: 0 },
            flashoflight: { heal: 30, cooldown: 3 }
        }
    },
    hunter: {
        emoji: '🏹',
        icon: 'class-icons/ClassIcon_hunter.webp',
        stats: { hp: 90, crit: 0.15 },
        abilities: {
            aimedshot: { damage: 35, cooldown: 0 },
            turtle: { evade: true, cooldown: 3 },
            killcommand: { damage: 30, cooldown: 0 },
            freezingtrap: { damage: 15, cooldown: 0 }
        }
    },
    rogue: {
        emoji: '🥷',
        icon: 'class-icons/ClassIcon_rogue.webp',
        stats: { hp: 80, crit: 0.2, dodge: 0.15 },
        abilities: {
            kidneyshot: { damage: 25, cooldown: 0 },
            eviscerate: { damage: 35, cooldown: 0 },
            pickpocket: { damage: 10, heal: 15, cooldown: 3 },
            vanish: { evade: true, cooldown: 3 }
        }
    },
    priest: {
        emoji: '⛪',
        icon: 'class-icons/ClassIcon_priest.webp',
        stats: { hp: 85, crit: 0.05 },
        abilities: {
            mindblast: { damage: 30, cooldown: 0 },
            shield: { evade: true, cooldown: 3 },
            flashheal: { heal: 40, cooldown: 3 },
            swdeath: { damage: 40, cooldown: 0 }
        }
    },
    deathknight: {
        emoji: '💀',
        icon: 'class-icons/ClassIcon_deathknight.webp',
        stats: { hp: 115, crit: 0.08 },
        abilities: {
            deathstrike: { damage: 25, heal: 20, cooldown: 3 },
            deathsadvance: { evade: true, cooldown: 3 },
            howlingblast: { damage: 30, cooldown: 0 },
            army: { damage: 45, cooldown: 0 }
        }
    },
    shaman: {
        emoji: '⚡',
        icon: 'class-icons/ClassIcon_shaman.webp',
        stats: { hp: 100, crit: 0.12 },
        abilities: {
            chainlightning: { damage: 35, cooldown: 0 },
            healingrain: { heal: 30, cooldown: 3 },
            bloodlust: { damage: 20, cooldown: 0 },
            totem: { evade: true, cooldown: 3 }
        }
    },
    mage: {
        emoji: '🧙',
        icon: 'class-icons/ClassIcon_mage.webp',
        stats: { hp: 80, crit: 0.25 },
        abilities: {
            fireball: { damage: 40, cooldown: 0 },
            iceblock: { evade: true, cooldown: 3 },
            blink: { evade: true, cooldown: 3 },
            polymorph: { damage: 10, cooldown: 0 }
        }
    },
    warlock: {
        emoji: '😈',
        icon: '/class-icons/ClassIcon_warlock.webp',
        stats: { hp: 100, crit: 0.08 },
        abilities: {
            chaosbolt: { damage: 45, cooldown: 0 },
            healthstone: { heal: 25, cooldown: 3 },
            fear: { damage: 10, cooldown: 0 },
            drainlife: { damage: 20, heal: 15, cooldown: 3 }
        }
    },
    monk: {
        emoji: '🐼',
        icon: '/class-icons/ClassIcon_monk.webp',
        stats: { hp: 95, crit: 0.15, dodge: 0.1 },
        abilities: {
            fists: { damage: 35, cooldown: 0 },
            brew: { heal: 20, evade: true, cooldown: 3 },
            kick: { damage: 25, cooldown: 0 },
            mist: { heal: 25, cooldown: 0 }
        }
    },
    druid: {
        emoji: '🦉',
        icon: '/class-icons/ClassIcon_druid.webp',
        stats: { hp: 105, crit: 0.1 },
        abilities: {
            convoke: { damage: 40, cooldown: 3 },
            regrowth: { heal: 30, cooldown: 0 },
            bear: { evade: true, cooldown: 3 },
            moonfire: { damage: 20, cooldown: 0 }
        }
    },
    demonhunter: {
        emoji: '🦇',
        icon: '/class-icons/ClassIcon_demon_hunter.webp',
        stats: { hp: 95, crit: 0.15, dodge: 0.05 },
        abilities: {
            eyebeam: { damage: 40, cooldown: 3 },
            blur: { evade: true, cooldown: 3 },
            chaosstrike: { damage: 30, cooldown: 0 },
            metamorphosis: { damage: 35, heal: 15, cooldown: 3 }
        }
    },
    evoker: {
        emoji: '🐲',
        icon: '/class-icons/ClassIcon_evoker.webp',
        stats: { hp: 100, crit: 0.12 },
        abilities: {
            disintegrate: { damage: 40, cooldown: 0 },
            blossom: { heal: 30, cooldown: 0 },
            deepbreath: { damage: 35, cooldown: 3 },
            rewind: { heal: 40, cooldown: 3 }
        }
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
  // Balance-Parameter für faire, aber spannende Kämpfe
  const BALANCE = {
    damageVariance: 0.2,       // +-20% Schaden
    healingVariance: 0.12,     // +-12% Heilung
    critMult: 1.6,             // normaler Krit-Multiplikator
    megaCritChance: 0.025,     // 2.5% Chance auf Mega-Krit
    megaCritMult: 2.5,         // Mega-Krit-Multiplikator
    lowHpThreshold: 0.3,       // unter 30% HP = Verzweiflungsbonus
    lowHpCritBonus: 0.1,       // +10% Krit wenn niedriges Leben
    lowHpDodgeBonus: 0.1       // +10% Ausweichen wenn niedriges Leben
  }
  const selectedClasses = ref(new Set())
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

    const { t } = useI18n()

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
          classId: id,
          name: customNames[id] || t(`classes.${id}.name`),
          className: t(`classes.${id}.name`),
          emoji: classData[id].emoji,
          icon: classData[id].icon,
          maxHp: startHp,
          hp: startHp,
          abilities: Object.keys(classData[id].abilities).map(key => ({ 
            ...classData[id].abilities[key], 
            key,
            name: t(`classes.${id}.abilities.${key}.name`),
            msg: t(`classes.${id}.abilities.${key}.msg`)
          })).map(a => ({ ...a, currentCD: 0 })),
          alive: true,
          evadeNext: false,
          status: t('battle.status.ready'),
          isShaking: false,
          stats: stats,
          damageDone: 0,
          healingDone: 0
        }
      })
      battleLog.value = []
      winner.value = null
      addLog(t('battle.startLog', { count: characters.value.length }))
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

        attacker.status = t('battle.status.using', { ability: ability.name })
        addLog(`${getColoredName(attacker)} ${t('battle.status.using', { ability: ability.name })} ${ability.msg}`)

        if (ability.cooldown) {
          ability.currentCD = ability.cooldown
        }

        if (ability.evade) {
          attacker.evadeNext = true
        }
        if (ability.heal) {
          // leichte Varianz auf Heilung für mehr Dynamik
          const healVar = 1 + (Math.random() * 2 - 1) * BALANCE.healingVariance
          const healAmount = Math.max(1, Math.round(ability.heal * healVar))
          attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount)
          // Healing-Meter
          attacker.healingDone = (attacker.healingDone || 0) + healAmount
        }
        if (ability.damage) {
          // Dynamischer Ausweich-Bonus bei niedrigem Leben (Comeback-Potenzial)
          const targetPassiveDodge = (target.stats?.dodge || 0)
          const targetLowHpBonus = (target.hp / target.maxHp) < BALANCE.lowHpThreshold ? BALANCE.lowHpDodgeBonus : 0
          const totalTargetDodge = Math.min(0.6, targetPassiveDodge + targetLowHpBonus) // Kappung gegen Frustmomente
          const isDodged = target.evadeNext || Math.random() < totalTargetDodge

          if (isDodged) {
            target.evadeNext = false
            addLog(t('battle.evadeLog', { target: getColoredName(target), attacker: getColoredName(attacker) }), 'evade')
            target.status = t('battle.status.evade') || 'Evaded!'
          } else {
            let finalDamage = ability.damage
            
            // Grundvarianz für mehr Unvorhersehbarkeit
            const dmgVar = 1 + (Math.random() * 2 - 1) * BALANCE.damageVariance
            finalDamage = Math.max(1, Math.round(finalDamage * dmgVar))
            
            // Kritische Treffer inkl. Mega-Krit und Low-HP-Bonus
            const baseCrit = attacker.stats?.crit || 0
            const lowHpBonus = (attacker.hp / attacker.maxHp) < BALANCE.lowHpThreshold ? BALANCE.lowHpCritBonus : 0
            const critChance = Math.min(0.75, baseCrit + lowHpBonus)
            if (Math.random() < critChance) {
              // Prüfe auf Mega-Krit
              if (Math.random() < BALANCE.megaCritChance) {
                finalDamage = Math.floor(finalDamage * BALANCE.megaCritMult)
                addLog(t('battle.megaCritLog', { attacker: getColoredName(attacker) }), 'important')
              } else {
                finalDamage = Math.floor(finalDamage * BALANCE.critMult)
                addLog(t('battle.critLog', { attacker: getColoredName(attacker) }), 'important')
              }
            }

            target.hp = Math.max(0, target.hp - finalDamage)
            target.isShaking = true
            setTimeout(() => { target.isShaking = false }, 500)

            // DPS-Meter
            attacker.damageDone = (attacker.damageDone || 0) + finalDamage
            
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
    // Auswahl wirklich zurücksetzen, damit beim Neustart nichts "hängen" bleibt
    selectedClasses.value = new Set()
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
