<script setup>
const props = defineProps({
  winner: Object,
  mode: { type: String, default: 'retail' }
})

const emit = defineEmits(['close'])

onMounted(() => {
  if (props.winner) {
    trackEvent('battle_victory', { winner: props.winner.classId, game_mode: props.mode })
  }
})
</script>

<template>
  <div v-if="winner" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
    <!-- Erfolgs-Meldung im Stil eines Achievements -->
    <div id="victory-screen" class="wow-frame w-full max-w-sm text-center !border-gold animate-[victory-pop_0.4s_ease-out]">
      <div class="font-display text-[13px] font-bold uppercase tracking-[0.3em] text-neutral-400">{{ $t('victory.achievement') }}</div>
      <h2 class="wow-title mt-1 text-4xl uppercase">{{ $t('victory.champion') }}</h2>
      <div class="wow-divider !my-4" />
      <div class="flex flex-col items-center">
        <img :src="winner.icon" :alt="winner.className" width="96" height="96" class="wow-slot h-24 w-24 !border-gold" />
        <p class="mt-4 text-neutral-300">{{ mode === 'forever' ? $t('victory.playInForever') : $t('victory.playInMidnight') }}</p>
        <p class="mt-1 font-display text-2xl font-bold" :class="`text-c-${winner.classId}`">{{ winner.name }}</p>
        <p v-if="winner.name !== winner.className" class="text-sm font-bold uppercase text-neutral-500">{{ $t(`classes.${winner.classId}.name`) }}</p>
      </div>
      <button class="wow-btn wow-btn-lg mt-8 w-full" @click="emit('close')">
        {{ $t('victory.again') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes victory-pop {
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
