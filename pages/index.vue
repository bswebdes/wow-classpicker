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
  deselectAll
} = useBattle()

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
  <div class="container">
    <h1>⚔️ Midnight Class Picker ⚔️</h1>
    <p class="subtitle">Nuxt Edition - Wer wird es für Midnight? Lass das Schicksal entscheiden!</p>

    <ClassSelection 
      v-if="!isStarted"
      :selected-classes="selectedClasses"
      :is-battle-in-progress="isBattleInProgress"
      @toggle="toggleClass"
      @select-all="selectAll"
      @deselect-all="deselectAll"
    />

    <div v-else id="arena" class="arena">
      <CharacterCard 
        v-for="char in characters" 
        :key="char.id" 
        :character="char" 
      />
    </div>

    <div class="controls">
      <button v-if="!isStarted" id="start-btn" @click="handleStart">
        KAMPF STARTEN!
      </button>
      <button v-if="isStarted && !isBattleInProgress" id="reset-btn" @click="resetBattle">
        Zur Auswahl
      </button>
    </div>

    <BattleLog :log-entries="battleLog" />

    <VictoryScreen v-if="winner" :winner="winner" />
  </div>
</template>
