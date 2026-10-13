<script setup>
// Erfolgspunkte im Header, führt zur Erfolgsseite und pulsiert bei neuen Erfolgen
const localePath = useLocalePath()
const { state, points } = useAchievements()
const earned = computed(() => Object.keys(state.value.unlocked).length)

const pulse = ref(false)
watch(points, (now, before) => {
  if (now > before) {
    pulse.value = false
    requestAnimationFrame(() => { pulse.value = true })
    setTimeout(() => { pulse.value = false }, 1600)
  }
})
</script>

<template>
  <NuxtLink
    :to="localePath('erfolge')"
    class="group flex items-center gap-1.5 rounded-[4px] border border-gold-border/60 bg-black/50 py-0.5 pl-1 pr-2 transition-colors hover:border-gold"
    :class="{ 'animate-[achievement-pulse_0.8s_ease-out_2]': pulse }"
    :title="`${$t('achievements.heading')}: ${earned}/${achievementDefs.length}`"
    :aria-label="`${$t('achievements.heading')}: ${points} ${$t('achievements.pointsShort')}`"
  >
    <svg viewBox="0 0 40 48" width="18" height="22" aria-hidden="true">
      <path d="M20 2 L37 8 V22 C37 34 29 42 20 46 C11 42 3 34 3 22 V8 Z" fill="#3a2a12" stroke="#ffd100" stroke-width="3" />
      <path d="M20 13 L23 21 L31 22 L25 27 L27 35 L20 31 L13 35 L15 27 L9 22 L17 21 Z" fill="#ffd100" />
    </svg>
    <span class="font-display text-[14px] font-bold tabular-nums text-gold">{{ points }}</span>
  </NuxtLink>
</template>

<style scoped>
@keyframes achievement-pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 209, 0, 0.7); transform: scale(1); }
  40% { box-shadow: 0 0 14px 4px rgba(255, 209, 0, 0.5); transform: scale(1.12); }
  100% { box-shadow: 0 0 0 0 rgba(255, 209, 0, 0); transform: scale(1); }
}
</style>
