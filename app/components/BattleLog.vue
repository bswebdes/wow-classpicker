<script setup>
const props = defineProps({
  logEntries: Array
})

const logRef = ref(null)

watch(() => props.logEntries.length, () => {
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight
    }
  })
})
</script>

<template>
  <!-- Kampflog im Stil des Chatfensters -->
  <div class="flex h-full flex-col rounded-md border border-gold-border/50 bg-black/60 text-left">
    <div class="border-b border-gold-border/40 bg-black/50 px-3 py-1 font-display text-[12px] font-bold uppercase tracking-wider text-gold">{{ $t('battle.logTitle') }}</div>
    <!-- Füllt immer den ganzen Kasten (gleich hoch wie das Damage-Meter daneben), scrollt innen -->
    <div class="relative min-h-44 flex-1">
    <div ref="logRef" id="battle-log" class="wow-scroll absolute inset-0 overflow-y-auto px-3 py-2 text-[14px] leading-snug text-[#ffd100]/90" tabindex="0" role="region" :aria-label="$t('battle.logTitle')">
      <p v-if="!logEntries.length" class="italic text-neutral-500">{{ $t('battle.logEmpty') }}</p>
      <div
        v-for="entry in logEntries"
        :key="entry.id"
        class="py-0.5"
        :class="{
          '!text-[#ff7f3f] font-bold': entry.type === 'important',
          '!text-[#69ccf0]': entry.type === 'evade',
          '!text-[#ff4040]': entry.type === 'damage',
          '!text-[#40ff40]': entry.type === 'heal'
        }"
        v-html="entry.message"
      ></div>
    </div>
    </div>
  </div>
</template>
