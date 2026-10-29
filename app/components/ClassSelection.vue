<script setup>
import { classData } from '~/composables/useBattle'

const props = defineProps({
  selectedClasses: Set,
  customNames: Object,
  isBattleInProgress: Boolean,
  classIds: { type: Array, default: () => Object.keys(classData) }
})

const emit = defineEmits(['toggle', 'selectAll', 'deselectAll', 'randomize-name', 'randomize-all'])

const fighters = computed(() => props.classIds.map(id => ({ id, data: classData[id] })).filter(f => f.data))

// Reihenfolge der Auswahl (P1, P2, P3 ...)
const selectionOrder = computed(() => Array.from(props.selectedClasses))
const getPlayerIndex = (id) => {
  const idx = selectionOrder.value.indexOf(id)
  return idx >= 0 ? idx + 1 : null
}
</script>

<template>
  <section id="selection-screen" class="wow-frame">
    <h2 class="wow-title text-center text-2xl sm:text-3xl uppercase">{{ $t('selection.title') }}</h2>
    <div class="wow-divider !my-4" />

    <div class="flex justify-center flex-wrap gap-3 mb-6">
      <button class="wow-btn wow-btn-sm" :disabled="isBattleInProgress" @click="emit('selectAll')">
        {{ $t('selection.allIn') }}
      </button>
      <button class="wow-btn wow-btn-sm wow-btn-stone" :disabled="isBattleInProgress" @click="emit('deselectAll')">
        {{ $t('selection.clear') }}
      </button>
      <button class="wow-btn wow-btn-sm wow-btn-stone" :disabled="isBattleInProgress" @click="emit('randomize-all')">
        🎲 {{ $t('selection.randomNames') }}
      </button>
    </div>

    <div id="class-grid" class="flex flex-wrap justify-center gap-3 sm:gap-4">
      <div
        v-for="{ id, data } in fighters"
        :key="id"
        class="group relative flex w-[92px] flex-col items-center"
      >
        <button
          type="button"
          class="wow-slot fighter-slot h-[72px] w-[72px] transition-all duration-150"
          :class="selectedClasses.has(id) ? 'is-selected' : 'grayscale-[85%] opacity-70 hover:grayscale-0 hover:opacity-100'"
          :style="{ '--c': data.color }"
          :aria-pressed="selectedClasses.has(id)"
          :aria-label="$t(`classes.${id}.name`)"
          @click="emit('toggle', id)"
        >
          <img :src="data.icon" :alt="$t(`classes.${id}.name`)" width="72" height="72" class="h-full w-full object-cover" />
          <span
            v-if="selectedClasses.has(id)"
            class="absolute right-0.5 top-0.5 rounded-[3px] bg-black/80 px-1 font-display text-[11px] font-bold text-gold"
          >P{{ getPlayerIndex(id) }}</span>
        </button>

        <span
          class="mt-1.5 text-center font-display text-[12px] font-bold leading-tight"
          :class="selectedClasses.has(id) ? `text-c-${id}` : 'text-neutral-500'"
        >{{ $t(`classes.${id}.name`) }}</span>

        <div v-if="selectedClasses.has(id)" class="mt-1 flex w-full items-center gap-1">
          <input
            v-model="customNames[id]"
            type="text"
            :placeholder="$t('selection.namePlaceholder')"
            :aria-label="$t('selection.namePlaceholder')"
            class="min-w-0 w-full rounded-[3px] border border-gold-border/60 bg-black/70 px-1 py-0.5 text-center text-[12px] text-white focus:border-gold focus:outline-hidden"
          />
          <button
            class="shrink-0 rounded-[3px] border border-gold-border/60 bg-black/70 px-1 text-[12px] hover:border-gold"
            :aria-label="$t('fighter.rerollName', { class: $t(`classes.${id}.name`) })"
            @click="emit('randomize-name', id)"
          >🎲</button>
        </div>

        <!-- Tooltip wie im Spiel -->
        <div class="wow-tooltip pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-52 -translate-x-1/2 text-left group-hover:block">
          <div class="font-display font-bold" :class="`text-c-${id}`">{{ $t(`classes.${id}.name`) }}</div>
          <div class="mt-1 text-[13px] italic text-gold">"{{ $t(`classes.${id}.description`) }}"</div>
          <div class="mt-2 space-y-0.5 text-[13px] text-white">
            <div>{{ data.stats.hp }} {{ $t('fighter.hp') }}</div>
            <div class="text-quality-uncommon">{{ $t('fighter.crit', { value: Math.round(data.stats.crit * 100) }) }}</div>
            <div v-if="data.stats.dodge" class="text-quality-uncommon">{{ $t('fighter.dodge', { value: Math.round(data.stats.dodge * 100) }) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fighter-slot.is-selected {
  border-color: var(--color-gold);
  box-shadow: inset 0 0 0 1px #000, 0 0 0 1px var(--color-gold-border), 0 0 14px rgba(255, 209, 0, 0.55);
}
/* Hover: Klasse leuchtet in ihrer Farbe und hebt sich leicht an */
.fighter-slot:not(.is-selected):hover,
.fighter-slot:not(.is-selected):focus-visible {
  border-color: var(--c);
  box-shadow: inset 0 0 0 1px #000, 0 0 14px color-mix(in srgb, var(--c) 70%, transparent);
  transform: translateY(-2px);
}
.fighter-slot:active { transform: scale(0.95); }
</style>
