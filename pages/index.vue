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
  title: 'Midnight Class Picker - Wer wird es für Midnight?',
  ogTitle: 'Midnight Class Picker',
  description: 'Unentschlossen bei der Klassenwahl? Lass den Midnight Class Picker für dich entscheiden!',
  ogDescription: 'Unentschlossen bei der Klassenwahl? Lass den Midnight Class Picker für dich entscheiden!',
  ogImage: '/og-image.png', // Pfad zum OG-Image (muss noch erstellt/hochgeladen werden)
  twitterCard: 'summary_large_image',
})

const handleStart = () => {
  if (selectedClasses.value.size < 2) {
    alert("Wähle mindestens 2 Klassen aus, um den Kampf zu starten!")
    return
  }
  initBattle()
  startBattle()
}
</script>

<template>
  <div class="max-w-5xl w-[90%] mx-auto text-center card p-6 mt-8">
    <header class="mb-6">
      <h1 class="text-3xl font-extrabold text-yellow-400 drop-shadow-sm">⚔️ Midnight Class Picker ⚔️</h1>
      <p class="mt-2 italic text-neutral-400">Nuxt Edition - Wer wird es für Midnight? Lass das Schicksal entscheiden!</p>
    </header>

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

      <div class="mt-4 flex items-center justify-center gap-3">
        <button v-if="!isStarted" id="start-btn" class="btn-primary bg-red-700 hover:bg-red-600" @click="handleStart">
          KAMPF STARTEN!
        </button>
        <button v-if="isStarted && !isBattleInProgress" id="reset-btn" class="btn-secondary" @click="resetBattle">
          Zur Auswahl
        </button>
      </div>

      <div class="mt-6">
        <BattleLog :log-entries="battleLog" />
      </div>

      <div class="mt-6">
        <VictoryScreen v-if="winner" :winner="winner" @close="resetBattle" />
      </div>
    </main>

    <footer class="mt-10 pt-6 border-t border-neutral-800 text-sm text-neutral-400">
      <NuxtLink class="hover:text-yellow-400 transition" to="/impressum">Impressum</NuxtLink>
    </footer>
  </div>
</template>
