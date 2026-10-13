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
  <!-- Damage-Meter im Stil bekannter Addons -->
  <div class="rounded-md border border-gold-border/50 bg-black/60 text-left">
    <div class="border-b border-gold-border/40 bg-black/50 px-3 py-1 font-display text-[12px] font-bold uppercase tracking-wider text-gold">{{ $t('meter.performance') }}</div>
    <div class="grid grid-cols-1 gap-4 p-3 md:grid-cols-2">
      <div v-for="meter in [{ key: 'd', title: $t('meter.totalDamage'), list: damageRanking, field: 'damage', max: maxDamage }, { key: 'h', title: $t('meter.totalHealing'), list: healingRanking, field: 'healing', max: maxHealing }]" :key="meter.key">
        <div class="mb-1.5 text-[13px] font-semibold text-neutral-300">{{ meter.title }}</div>
        <div class="space-y-[3px]">
          <div v-for="(p, idx) in meter.list" :key="meter.key + p.id" class="relative h-[22px] overflow-hidden rounded-[2px] bg-neutral-900">
            <div class="absolute inset-y-0 left-0 opacity-80 transition-all duration-300 ease-out" :class="'bg-c-' + p.id" :style="{ width: Math.round((p[meter.field] / meter.max) * 100) + '%' }" />
            <div class="relative flex h-full items-center justify-between px-2 text-[13px] font-semibold text-white [text-shadow:1px_1px_0_#000]">
              <span class="truncate">{{ idx + 1 }}. {{ p.name }}</span>
              <span class="tabular-nums">{{ p[meter.field] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
