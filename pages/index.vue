<script setup>
const {
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
  deselectAll,
  globalHpPercent,
  customNames,
  randomizeName,
  randomizeAllNames
} = useBattle()

const config = useRuntimeConfig()

useSeoMeta({
  title: 'WoW Midnight Class Picker - Welche WoW Klasse spielst du?',
  ogTitle: 'WoW Midnight Class Picker',
  description: 'Unentschlossen bei der WoW Klassenwahl für Midnight? Lass den WoW Class Picker für dich entscheiden!',
  ogDescription: 'Unentschlossen bei der WoW Klassenwahl für Midnight? Lass den WoW Class Picker für dich entscheiden!',
  ogImage: '/og-image.png', // Pfad zum OG-Image (muss noch erstellt/hochgeladen werden)
  twitterCard: 'summary_large_image',
})

// Arcade-Intro Steuerung
const showBattleIntro = ref(false)
const onBattleIntroFinished = () => {
  // Battle-Intro zurücksetzen, damit es beim nächsten Mal erneut ausgelöst werden kann
  showBattleIntro.value = false
  initBattle()
  startBattle()
}

// Selection-Intro beim Laden und nach Reset
const showSelectionIntro = ref(false)
const onSelectionIntroFinished = () => {
  showSelectionIntro.value = false
}

onMounted(() => {
  showSelectionIntro.value = true
})

const handleStart = () => {
  if (selectedClasses.value.size < 2) {
    alert("Wähle mindestens 2 Klassen aus, um den Kampf zu starten!")
    return
  }
  showBattleIntro.value = true
}

const handleReset = () => {
  resetBattle()
  // kurze Verzögerung, damit UI zurückspringt, dann Intro zeigen
  setTimeout(() => { showSelectionIntro.value = true }, 50)
}

</script>

<template>
  <div class="max-w-5xl w-[90%] mx-auto text-center card p-6 mt-8">
    <header class="mb-6">
      <h1 class="text-3xl font-extrabold text-yellow-400 drop-shadow-sm">Welche Klasse soll ich in WoW spielen?</h1>
      <p class="mt-2 italic text-neutral-400">Wähle deine WoW Klassen selbst und lass sie im Battle gegeneinander antreten. Du kannst nur deine Favoriten auswählen, eigene Setups bauen und optional deinen Namen hinterlegen. Am Ende steht dein neuer Main für Raid, Mythic+ oder PvP fest.</p>
    </header>

    <!-- Street-Fighter-Style Intros -->
    <BattleIntro :show="showSelectionIntro" mode="selection" @finished="onSelectionIntroFinished" />
    <BattleIntro :show="showBattleIntro" mode="battle" @finished="onBattleIntroFinished" />

    <main>
      <ClassSelection 
        v-if="!isStarted"
        :selected-classes="selectedClasses"
        :custom-names="customNames"
        :is-battle-in-progress="isBattleInProgress"
        @toggle="toggleClass"
        @select-all="selectAll"
        @deselect-all="deselectAll"
        @randomize-name="randomizeName"
        @randomize-all="randomizeAllNames"
      />

      <div v-if="isStarted" class="mb-4">
        <div class="flex justify-between items-center mb-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span>Gesamt-Status der Arena</span>
          <span>{{ Math.round(globalHpPercent) }}%</span>
        </div>
        <div class="w-full h-3 bg-neutral-800 border border-neutral-700 rounded-full overflow-hidden shadow-inner">
          <div 
            class="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
            :style="{ width: globalHpPercent + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="isStarted" id="arena" class="flex justify-center items-end flex-wrap gap-4 mb-8 p-5 section min-h-[250px]">
        <CharacterCard 
          v-for="char in characters" 
          :key="char.id" 
          :character="char" 
        />
      </div>

      <div class="mt-8 flex items-center justify-center gap-3">
        <button 
          v-if="!isStarted" 
          class="arcade-btn group relative overflow-hidden" 
          @click="handleStart"
        >
          <span class="relative z-10">KAMPF STARTEN!</span>
          <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
        </button>
        <button v-if="isStarted && !isBattleInProgress" id="reset-btn" class="btn-secondary" @click="handleReset">
          Zur Auswahl
        </button>
      </div>

      <div class="mt-6">
        <BattleLog :log-entries="battleLog" />
      </div>

      <div class="mt-6">
        <DpsMeter v-if="isStarted" :characters="characters" />
      </div>

      <div class="mt-6">
        <VictoryScreen v-if="winner" :winner="winner" @close="handleReset" />
      </div>
    </main>

    <footer class="mt-10 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
    </footer>
  </div>
</template>
