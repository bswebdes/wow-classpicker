<script setup>
// Zeigt neu errungene Erfolge nacheinander unten mittig an, wie im Spiel
const { queue } = useAchievements()
const current = ref(null)
let timer

const showNext = () => {
  if (current.value || !queue.value.length) return
  const [next, ...rest] = queue.value
  queue.value = rest
  current.value = achievementDefs.find(a => a.id === next) || null
  clearTimeout(timer)
  timer = setTimeout(close, 5000)
}

const close = () => {
  current.value = null
  // kurze Pause zwischen zwei Erfolgen
  setTimeout(showNext, 400)
}

watch(queue, () => setTimeout(showNext, 600), { deep: true })
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-20 z-[60] sm:bottom-5 flex justify-center px-4" aria-live="polite">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-95"
      leave-active-class="transition duration-300 ease-in"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="current" class="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg border-2 border-gold-border bg-gradient-to-b from-[#2a2014] to-[#0d0a06] p-2.5 pr-3 shadow-[0_0_0_1px_#000,0_0_24px_rgba(255,209,0,0.25),0_8px_24px_rgba(0,0,0,0.8)]" role="status">
        <img :src="current.icon" alt="" width="52" height="52" class="wow-slot h-[52px] w-[52px] shrink-0 !border-gold-border" />
        <div class="min-w-0 flex-1 text-center">
          <div class="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-gold">{{ $t('achievements.earned') }}</div>
          <div class="font-display text-[17px] font-bold leading-tight text-white">{{ $t(`achievements.list.${current.id}.name`) }}</div>
          <div class="truncate text-[13px] text-neutral-400">{{ $t(`achievements.list.${current.id}.desc`) }}</div>
        </div>
        <!-- Punkte im Schild -->
        <span class="relative flex h-12 w-11 shrink-0 items-center justify-center" :aria-label="$t('achievements.points', { n: current.points })">
          <svg viewBox="0 0 40 48" class="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M20 2 L37 8 V22 C37 34 29 42 20 46 C11 42 3 34 3 22 V8 Z" fill="#3a2a12" stroke="#ffd100" stroke-width="2.5" />
          </svg>
          <span class="relative font-display text-[15px] font-black text-gold">{{ current.points }}</span>
        </span>
        <button class="ml-1 self-start text-lg leading-none text-neutral-500 hover:text-gold" :aria-label="$t('achievements.close')" @click="close">×</button>
      </div>
    </Transition>
  </div>
</template>
