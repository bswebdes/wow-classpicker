<script setup>
const props = defineProps({
  characters: { type: Array, default: () => [] }
})

const damageRanking = computed(() => {
  const list = props.characters.map(c => ({
    id: c.id,
    name: c.name,
    className: c.className,
    damage: c.damageDone || 0
  }))
  return list.sort((a, b) => b.damage - a.damage)
})

const healingRanking = computed(() => {
  const list = props.characters.map(c => ({
    id: c.id,
    name: c.name,
    className: c.className,
    healing: c.healingDone || 0
  }))
  return list.sort((a, b) => b.healing - a.healing)
})

const maxDamage = computed(() => Math.max(1, ...damageRanking.value.map(e => e.damage)))
const maxHealing = computed(() => Math.max(1, ...healingRanking.value.map(e => e.healing)))
</script>

<template>
  <div class="section p-4 border border-neutral-800 rounded bg-neutral-950/50">
    <div class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">{{ $t('meter.performance') }}</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Schaden -->
      <div>
        <div class="text-sm font-semibold text-neutral-300 mb-2">{{ $t('meter.totalDamage') }}</div>
        <div class="space-y-2">
          <div v-for="(p, idx) in damageRanking" :key="'d-'+p.id" class="flex items-center gap-2">
            <div class="w-8 text-right text-xs text-neutral-400">#{{ idx+1 }}</div>
            <div class="flex-1">
              <div class="h-6 bg-neutral-800 rounded overflow-hidden border border-neutral-700">
                <div 
                  class="h-full text-xs flex items-center px-2 transition-all duration-300 ease-out meter-bar-text"
                  :class="'bg-c-' + p.id"
                  :style="{ width: Math.round((p.damage / maxDamage) * 100) + '%' }"
                >
                  <span class="truncate">{{ p.name }} ({{ p.className }})</span>
                </div>
              </div>
            </div>
            <div class="w-16 text-right text-xs tabular-nums">{{ p.damage }}</div>
          </div>
        </div>
      </div>

      <!-- Heilung -->
      <div>
        <div class="text-sm font-semibold text-neutral-300 mb-2">{{ $t('meter.totalHealing') }}</div>
        <div class="space-y-2">
          <div v-for="(p, idx) in healingRanking" :key="'h-'+p.id" class="flex items-center gap-2">
            <div class="w-8 text-right text-xs text-neutral-400">#{{ idx+1 }}</div>
            <div class="flex-1">
              <div class="h-6 bg-neutral-800 rounded overflow-hidden border border-neutral-700">
                <div 
                  class="h-full text-xs flex items-center px-2 transition-all duration-300 ease-out meter-bar-text"
                  :class="'bg-c-' + p.id"
                  :style="{ width: Math.round((p.healing / maxHealing) * 100) + '%' }"
                >
                  <span class="truncate">{{ p.name }} ({{ p.className }})</span>
                </div>
              </div>
            </div>
            <div class="w-16 text-right text-xs tabular-nums">{{ p.healing }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meter-bar-text {
  color: white !important;
  text-shadow: 
    -1px -1px 0 #333,  
     1px -1px 0 #333,
    -1px  1px 0 #333,
     1px  1px 0 #333;
}
</style>
