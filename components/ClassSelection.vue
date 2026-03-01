<script setup>
import { classData } from '~/composables/useBattle'

const props = defineProps({
  selectedClasses: Set,
  customNames: Object,
  isBattleInProgress: Boolean
})

const emit = defineEmits(['toggle', 'selectAll', 'deselectAll', 'randomize-name', 'randomize-all'])

// Ermittelt die Reihenfolge der Auswahl (P1, P2, P3 ...)
const selectionOrder = computed(() => Array.from(props.selectedClasses))
const getPlayerIndex = (id) => {
  const idx = selectionOrder.value.indexOf(id)
  return idx >= 0 ? idx + 1 : null
}
</script>

<template>
  <div id="selection-screen" class="section mb-6 relative overflow-hidden">
    <!-- Dekorative Arcade-Elemente -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
    
    <div class="mb-6">
      <h3 class="text-4xl font-black italic tracking-tighter text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase mb-2" style="font-family: 'Permanent Marker', cursive;">
        {{ $t('selection.title') }}
      </h3>
      <div class="h-0.5 w-48 mx-auto bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
    </div>

    <div class="flex justify-center flex-wrap gap-3 mb-8">
      <button 
        class="arcade-btn group" 
        @click="emit('selectAll')" 
        :disabled="isBattleInProgress"
      >
        <span class="relative z-10">{{ $t('selection.allIn') }}</span>
        <div class="absolute inset-0 bg-green-700 transform skew-x-[-12deg] group-hover:bg-green-600 transition-colors"></div>
      </button>
      
      <button 
        class="arcade-btn group" 
        @click="emit('deselectAll')" 
        :disabled="isBattleInProgress"
      >
        <span class="relative z-10">{{ $t('selection.clear') }}</span>
        <div class="absolute inset-0 bg-neutral-700 transform skew-x-[-12deg] group-hover:bg-neutral-600 transition-colors"></div>
      </button>

      <button 
        class="arcade-btn group" 
        @click="emit('randomize-all')" 
        :disabled="isBattleInProgress"
      >
        <span class="relative z-10">{{ $t('selection.randomNames') }}</span>
        <div class="absolute inset-0 bg-blue-700 transform skew-x-[-12deg] group-hover:bg-blue-600 transition-colors"></div>
      </button>
    </div>

    <div id="class-grid" class="flex flex-wrap justify-center gap-4 px-2">
      <div 
        v-for="(data, id) in classData" 
        :key="id"
        class="fighter-card group"
        :class="[
          { 'is-selected': selectedClasses.has(id) },
          selectedClasses.has(id) ? `border-c-${id}` : 'border-neutral-700'
        ]"
        @click="emit('toggle', id)"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-lg">
          <div class="absolute inset-0 rotate-45 scale-150 bg-[repeating-linear-gradient(0deg,#000,#000_1px,transparent_1px,transparent_4px)]"></div>
        </div>

        <div class="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-125">
          <img :src="data.icon" :alt="data.name" class="w-full h-full object-cover" />
        </div>

        <div 
          class="relative z-10 text-[0.65rem] mt-auto font-black uppercase tracking-tighter bg-black/60 w-full py-1 backdrop-blur-sm" 
          :class="selectedClasses.has(id) ? `text-c-${id}` : 'text-neutral-500'"
          style="font-family: 'Press Start 2P', cursive; font-size: 0.5rem;"
        >
          {{ $t(`classes.${id}.name`) }}
        </div>
        
        <!-- Custom Name Input Overlay -->
        <div v-if="selectedClasses.has(id)" class="mt-3 w-full relative z-20 flex items-center gap-1 px-1">
          <input 
            v-model="customNames[id]"
            type="text"
            :placeholder="$t('selection.namePlaceholder')"
            class="min-w-0 w-full text-[0.6rem] p-1 bg-black/60 border border-white/20 rounded-sm text-white text-center focus:outline-none focus:border-yellow-500 font-bold uppercase"
            @click.stop
          />
          <button 
            class="shrink-0 p-1 text-[0.6rem] rounded-sm border border-white/20 bg-neutral-800 hover:bg-red-600 transition-colors"
            @click.stop="emit('randomize-name', id)"
          >🎲</button>
        </div>
        
        <!-- Tooltip / Stats -->
        <div 
          v-if="selectedClasses.has(id)"
          class="stats-popup"
        >
          <div class="font-black text-yellow-400 mb-1 border-b border-yellow-400/30 pb-1 italic uppercase text-xs">
            {{ $t(`classes.${id}.name`) }}
          </div>
          <div class="text-[0.6rem] text-neutral-300 italic mb-2 leading-tight">"{{ $t(`classes.${id}.description`) }}"</div>
          <div class="grid grid-cols-1 gap-1 font-mono text-[0.6rem]">
            <div class="flex justify-between border-b border-white/5"><span>HP</span> <span class="text-white font-bold">{{ data.stats.hp }}</span></div>
            <div class="flex justify-between border-b border-white/5"><span>CRT</span> <span class="text-white font-bold">{{ data.stats.crit * 100 }}%</span></div>
            <div v-if="data.stats.dodge" class="flex justify-between border-b border-white/5"><span>DDG</span> <span class="text-white font-bold">{{ data.stats.dodge * 100 }}%</span></div>
          </div>
        </div>

        <!-- Selection Marker mit dynamischem P-Index -->
        <div v-if="selectedClasses.has(id)" class="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-yellow-400 text-black text-[0.6rem] flex items-center justify-center font-black rounded-sm shadow-lg z-30 tracking-tighter" :style="{ fontFamily: `'Permanent Marker', cursive` }">
          P{{ getPlayerIndex(id) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fighter-card {
  @apply relative w-28 h-36 p-0 bg-neutral-900 border-2 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center opacity-60 grayscale scale-95 overflow-hidden;
}

.fighter-card:hover {
  @apply opacity-90 grayscale-0 scale-100 border-neutral-500 shadow-[0_0_15px_rgba(255,255,255,0.1)];
}

.fighter-card.is-selected {
  @apply opacity-100 grayscale-0 scale-105 bg-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.6)];
  border-color: inherit; /* Nutzt die Border-Class für Farben */
  box-shadow: 0 0 15px currentColor;
}

.is-selected::after {
  content: '';
  @apply absolute inset-0 border-2 border-white/20 rounded-lg animate-pulse;
}

.stats-popup {
  @apply hidden group-hover:block absolute bottom-full mb-3 p-3 bg-neutral-900 border-2 border-yellow-500/50 z-[100] rounded shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-44 text-left pointer-events-none backdrop-blur-sm;
}

/* Scanline Effect */
.fighter-card::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 5;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  opacity: 0.3;
}
</style>
