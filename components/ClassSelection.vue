<script setup>
import { classData } from '~/composables/useBattle'

const props = defineProps({
  selectedClasses: Set,
  customNames: Object,
  isBattleInProgress: Boolean
})

const emit = defineEmits(['toggle', 'selectAll', 'deselectAll', 'randomize-name', 'randomize-all'])
</script>

<template>
  <div id="selection-screen" class="section mb-6">
    <h3 class="text-lg font-semibold mb-3">Wähle deine Kämpfer:</h3>
    <div class="flex justify-center gap-2 mb-4">
      <button class="btn-secondary" @click="emit('selectAll')" :disabled="isBattleInProgress">✅ Alle auswählen</button>
      <button class="btn-secondary" @click="emit('deselectAll')" :disabled="isBattleInProgress">❌ Alle abwählen</button>
      <button class="btn-secondary" @click="emit('randomize-all')" :disabled="isBattleInProgress">🎲 Zufallsnamen</button>
    </div>
    <div id="class-grid" class="flex flex-wrap justify-center gap-4">
      <div 
        v-for="(data, id) in classData" 
        :key="id"
        class="group relative w-24 p-2 bg-neutral-700 border-2 border-neutral-600 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center opacity-50 grayscale hover:scale-105 hover:border-neutral-400 hover:opacity-80"
        :class="[
          { 'opacity-100 grayscale-0 bg-neutral-600 scale-105 shadow-lg shadow-black/50': selectedClasses.has(id) },
          selectedClasses.has(id) ? `border-c-${id}` : ''
        ]"
        :style="selectedClasses.has(id) ? { borderColor: 'currentColor' } : {}"
        @click="emit('toggle', id)"
      >
        <div class="text-2xl">{{ data.emoji }}</div>
        <div class="text-[0.7rem] mt-1 font-medium text-center" :class="selectedClasses.has(id) ? `text-c-${id}` : 'text-neutral-300'">
          {{ data.name }}
        </div>
        
        <!-- Custom Name Input + Randomize Button -->
        <div v-if="selectedClasses.has(id)" class="mt-2 w-full flex items-center gap-1 px-1">
          <input 
            v-model="customNames[id]"
            type="text"
            placeholder="Name..."
            class="min-w-0 w-full text-[0.6rem] p-0.5 bg-black/40 border border-white/10 rounded text-white text-center focus:outline-none focus:border-yellow-500/50"
            @click.stop
          />
          <button 
            class="shrink-0 px-1 py-0.5 text-[0.6rem] rounded border border-white/10 bg-neutral-800 hover:bg-neutral-700 transition"
            title="Zufallsname"
            @click.stop="emit('randomize-name', id)"
          >🎲</button>
        </div>
        
        <div 
          v-if="selectedClasses.has(id)"
          class="hidden group-hover:block absolute bottom-full mb-2 p-2 bg-black border border-neutral-700 text-[0.65rem] z-20 rounded shadow-xl w-40 text-left pointer-events-none"
        >
          <div class="font-bold text-yellow-400 mb-1 border-b border-neutral-800 pb-1">{{ data.name }}</div>
          <div class="text-neutral-300 italic mb-2">"{{ data.description }}"</div>
          <div class="flex flex-col gap-1 text-neutral-400">
            <div class="flex justify-between"><span>HP:</span> <span class="text-white">{{ data.stats.hp }}</span></div>
            <div class="flex justify-between"><span>Crit:</span> <span class="text-white">{{ data.stats.crit * 100 }}%</span></div>
            <div v-if="data.stats.dodge" class="flex justify-between"><span>Dodge:</span> <span class="text-white">{{ data.stats.dodge * 100 }}%</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
