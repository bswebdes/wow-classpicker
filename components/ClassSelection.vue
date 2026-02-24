<script setup>
import { classData } from '~/composables/useBattle'

const props = defineProps({
  selectedClasses: Set,
  isBattleInProgress: Boolean
})

const emit = defineEmits(['toggle', 'selectAll', 'deselectAll'])
</script>

<template>
  <div id="selection-screen" class="selection-screen">
    <h3>Wähle deine Kämpfer:</h3>
    <div class="selection-controls">
      <button class="secondary-btn" @click="emit('selectAll')">✅ Alle auswählen</button>
      <button class="secondary-btn" @click="emit('deselectAll')">❌ Alle abwählen</button>
    </div>
    <div id="class-grid" class="class-grid">
      <div 
        v-for="(data, id) in classData" 
        :key="id"
        class="selection-item"
        :class="{ selected: selectedClasses.has(id) }"
        @click="emit('toggle', id)"
      >
        <div class="emoji">{{ data.emoji }}</div>
        <div class="name">{{ data.name }}</div>
      </div>
    </div>
  </div>
</template>
