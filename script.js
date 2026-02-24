const logElement = document.getElementById('battle-log');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const victoryScreen = document.getElementById('victory-screen');
const winnerText = document.getElementById('winner-text');
const winnerClass = document.getElementById('winner-class');
const selectionScreen = document.getElementById('selection-screen');
const arenaElement = document.getElementById('arena');
const classGrid = document.getElementById('class-grid');
const selectAllBtn = document.getElementById('select-all-btn');
const deselectAllBtn = document.getElementById('deselect-all-btn');

let selectedClasses = new Set();

class Character {
    constructor(id, data) {
        this.id = id;
        this.name = data.name;
        this.emoji = data.emoji;
        this.maxHp = 100;
        this.hp = 100;
        // Deep clone abilities to track individual cooldowns
        this.abilities = data.abilities.map(a => ({ ...a, currentCD: 0 }));
        this.alive = true;
        this.evadeNext = false;
        this.className = id;
        
        this.createUI();
    }

    createUI() {
        const arena = document.getElementById('arena');
        this.el = document.createElement('div');
        this.el.id = this.id;
        this.el.className = `character ${this.className}`;
        
        this.el.innerHTML = `
            <div class="hp-bar-container"><div class="hp-bar" id="hp-${this.id}"></div></div>
            <div class="avatar">${this.emoji}</div>
            <div class="name">${this.name}</div>
            <div class="status" id="status-${this.id}">Bereit!</div>
        `;
        
        arena.appendChild(this.el);
        this.hpBar = document.getElementById(`hp-${this.id}`);
        this.statusEl = document.getElementById(`status-${this.id}`);
    }

    updateUI() {
        const percent = Math.max(0, (this.hp / this.maxHp) * 100);
        this.hpBar.style.width = `${percent}%`;
        
        if (percent < 20) {
            this.hpBar.style.backgroundColor = '#f44336';
        } else if (percent < 50) {
            this.hpBar.style.backgroundColor = '#ffeb3b';
        } else {
            this.hpBar.style.backgroundColor = '#4caf50';
        }

        if (this.hp <= 0 && this.alive) {
            this.alive = false;
            this.el.classList.add('dead');
            this.statusEl.innerText = 'BESIEGT';
            addLog(`${this.getColoredName()} ist ausgeschieden!`, 'important');
        }
    }

    getColoredName() {
        return `<span class="c-${this.id}">${this.name}</span>`;
    }

    takeDamage(amount, attacker) {
        if (this.evadeNext) {
            this.evadeNext = false;
            addLog(`${this.getColoredName()} weicht dem Angriff von ${attacker.getColoredName()} elegant aus!`, 'evade');
            this.statusEl.innerText = 'Ausgewichen!';
            return;
        }
        
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        this.updateUI();
        
        // Shake animation
        this.el.classList.add('shake');
        setTimeout(() => this.el.classList.remove('shake'), 500);
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
        this.updateUI();
    }
}

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    entry.innerHTML = `> ${message}`;
    logElement.appendChild(entry);
    logElement.scrollTop = logElement.scrollHeight;
}

const classData = {
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
};

let characters = [];
let battleInProgress = false;

function initBattle() {
    const selectedArray = Array.from(selectedClasses);
    populateArena(selectedArray);
    
    logElement.innerHTML = '';
    addLog(`Der Kampf beginnt mit ${selectedArray.length} Klassen!`);
    victoryScreen.style.display = 'none';
    startBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    selectionScreen.style.display = 'none';
    arenaElement.style.display = 'flex';
}

async function startBattle() {
    if (battleInProgress) return;
    
    if (selectedClasses.size < 2) {
        alert("Wähle mindestens 2 Klassen aus, um den Kampf zu starten!");
        return;
    }

    battleInProgress = true;
    initBattle();

    while (characters.filter(c => c.alive).length > 1) {
        for (let attacker of characters) {
            if (!attacker.alive) continue;
            if (characters.filter(c => c.alive).length <= 1) break;

            await new Promise(resolve => setTimeout(resolve, 800));

            // Cooldowns verringern
            attacker.abilities.forEach(a => {
                if (a.currentCD > 0) a.currentCD--;
            });

            // Verfügbare Fähigkeiten wählen (CD = 0)
            const availableAbilities = attacker.abilities.filter(a => a.currentCD === 0);
            const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
            
            // Ziel wählen (nicht selbst, und am Leben)
            const potentialTargets = characters.filter(c => c.alive && c.id !== attacker.id);
            const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];

            attacker.statusEl.innerText = `Nutzt ${ability.name}...`;
            addLog(`${attacker.getColoredName()} nutzt ${ability.name}: ${ability.msg}`);

            // Cooldown setzen
            if (ability.cooldown) {
                ability.currentCD = ability.cooldown;
            }

            if (ability.evade) {
                attacker.evadeNext = true;
            }
            if (ability.heal) {
                attacker.heal(ability.heal);
            }
            if (ability.damage) {
                target.takeDamage(ability.damage, attacker);
            }

            if (characters.filter(c => c.alive).length <= 1) break;
        }
    }

    const winner = characters.find(c => c.alive);
    endBattle(winner);
}

function endBattle(winner) {
    battleInProgress = false;
    winnerText.innerText = `GEWONNEN!`;
    winnerClass.innerText = winner.name;
    victoryScreen.style.display = 'block';
    resetBtn.style.display = 'inline-block';
    addLog(`KAMPF BEENDET! ${winner.getColoredName()} ist der Champion!`, 'important');
}

startBtn.addEventListener('click', startBattle);

resetBtn.addEventListener('click', () => {
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    victoryScreen.style.display = 'none';
    arenaElement.style.display = 'none';
    selectionScreen.style.display = 'block';
    addLog('Bereit für die nächste Runde? Wähle deine Klassen!');
});

function renderSelectionScreen() {
    classGrid.innerHTML = '';
    for (const [id, data] of Object.entries(classData)) {
        const item = document.createElement('div');
        item.className = 'selection-item';
        if (selectedClasses.has(id)) item.classList.add('selected');
        
        item.innerHTML = `
            <div class="emoji">${data.emoji}</div>
            <div class="name">${data.name}</div>
        `;
        
        item.addEventListener('click', () => {
            if (selectedClasses.has(id)) {
                selectedClasses.delete(id);
                item.classList.remove('selected');
            } else {
                selectedClasses.add(id);
                item.classList.add('selected');
            }
        });
        
        classGrid.appendChild(item);
    }
}

selectAllBtn.addEventListener('click', () => {
    Object.keys(classData).forEach(id => selectedClasses.add(id));
    renderSelectionScreen();
});

deselectAllBtn.addEventListener('click', () => {
    selectedClasses.clear();
    renderSelectionScreen();
});

function populateArena(classIds) {
    arenaElement.innerHTML = '';
    characters = [];
    classIds.forEach(id => {
        characters.push(new Character(id, classData[id]));
    });
}

// Initial beim Laden
renderSelectionScreen();
