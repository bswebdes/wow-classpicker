<script setup>
definePageMeta({
  i18n: { paths: { de: '/erfolge', en: '/achievements' } }
})

const { t } = useI18n()
const { $showCookieSettings } = useNuxtApp()
const { state, points } = useAchievements()
const consent = useConsentState()

// Spielerei ohne Suchwert: nicht indexieren
useSeoMeta({
  title: () => t('achievements.pageTitle'),
  robots: 'noindex, follow'
})

const earnedCount = computed(() => achievementDefs.filter(a => state.value.unlocked[a.id]).length)
const formatDate = (iso) => new Date(iso).toLocaleDateString()

// Wie im WoW-Interface: die drei neuesten oben, darunter der Rest (weitere errungene, dann offene)
const byDate = computed(() => achievementDefs
  .filter(a => state.value.unlocked[a.id])
  .sort((x, y) => state.value.unlocked[y.id].localeCompare(state.value.unlocked[x.id])))
const recent = computed(() => byDate.value.slice(0, 3))
const rest = computed(() => [
  ...byDate.value.slice(3),
  ...achievementDefs.filter(a => !state.value.unlocked[a.id])
])
// In den letzten 24 Stunden errungen: Glanz läuft einmal über die Karte
const isNew = a => Date.now() - new Date(state.value.unlocked[a.id]).getTime() < 86_400_000
const nameOf = a => a.secret && !state.value.unlocked[a.id] ? '???' : t(`achievements.list.${a.id}.name`)
const descOf = a => a.secret && !state.value.unlocked[a.id] ? t('achievements.secret') : t(`achievements.list.${a.id}.desc`)
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('achievements.heading') }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t('achievements.intro') }}</p>

    <section class="wow-frame mt-8">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <ClientOnly>
          <p class="font-display font-bold text-gold">
            {{ $t('achievements.progress', { earned: earnedCount, total: achievementDefs.length, points, maxPoints: achievementTotalPoints }) }}
          </p>
        </ClientOnly>
      </div>
      <div class="mt-2 h-3 overflow-hidden rounded-[2px] border border-black bg-neutral-900">
        <ClientOnly>
          <div class="h-full bg-gradient-to-b from-[#3cff3c] to-[#0a8a0a] transition-all" :style="{ width: `${(points / achievementTotalPoints) * 100}%` }" />
        </ClientOnly>
      </div>

      <ClientOnly>
        <!-- Zuletzt errungen -->
        <template v-if="recent.length">
          <h2 class="mt-6 font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('achievements.recent') }}</h2>
          <ul class="mt-3 grid gap-2 sm:grid-cols-3">
            <li v-for="(a, i) in recent" :key="a.id" class="relative flex flex-col items-center overflow-hidden rounded-md border border-gold bg-gradient-to-b from-[#3a2a12] to-[#1a120a] p-3 text-center shadow-[0_0_14px_rgba(255,209,0,0.15)]" :class="{ 'achievement-new': isNew(a) }" :style="{ '--i': i }">
              <img :src="a.icon" alt="" width="56" height="56" class="wow-slot h-14 w-14 !border-gold" />
              <div class="mt-2 font-display font-bold leading-tight text-white">{{ nameOf(a) }}</div>
              <div class="mt-1 text-[13px] text-neutral-300">{{ descOf(a) }}</div>
              <div class="mt-auto pt-2 text-[12px] text-neutral-500"><span class="font-display font-black text-gold">{{ a.points }}</span> · {{ formatDate(state.unlocked[a.id]) }}</div>
            </li>
          </ul>
          <h2 class="mt-8 font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('achievements.all') }}</h2>
        </template>

        <ul class="mt-3 space-y-2" :class="recent.length ? '' : 'mt-6'">
          <li
            v-for="a in rest"
            :key="a.id"
            class="flex items-center gap-3 rounded-md border p-2.5"
            :class="state.unlocked[a.id] ? 'border-gold-border bg-gradient-to-r from-[#2a2014] to-transparent' : 'border-neutral-800 bg-black/40'"
          >
            <img :src="a.icon" alt="" width="44" height="44" class="wow-slot h-11 w-11 shrink-0" :class="state.unlocked[a.id] ? '!border-gold-border' : 'grayscale opacity-40'" />
            <div class="min-w-0 flex-1">
              <div class="font-display font-bold" :class="state.unlocked[a.id] ? 'text-white' : 'text-neutral-500'">{{ nameOf(a) }}</div>
              <div class="text-[14px]" :class="state.unlocked[a.id] ? 'text-neutral-300' : 'text-neutral-600'">{{ descOf(a) }}</div>
            </div>
            <div class="shrink-0 text-right">
              <div class="font-display font-black" :class="state.unlocked[a.id] ? 'text-gold' : 'text-neutral-600'">{{ a.points }}</div>
              <div v-if="state.unlocked[a.id]" class="text-[12px] text-neutral-500">{{ formatDate(state.unlocked[a.id]) }}</div>
            </div>
          </li>
        </ul>

        <div class="wow-objective mt-6 flex flex-wrap items-center justify-between gap-3">
          <p class="text-[15px] text-neutral-200">{{ consent.preferences ? $t('achievements.saved') : $t('achievements.notSaved') }}</p>
          <button class="wow-btn wow-btn-sm wow-btn-stone" @click="$showCookieSettings()">{{ $t('achievements.openSettings') }}</button>
        </div>
      </ClientOnly>
    </section>
  </main>
</template>

<style scoped>
/* Frisch errungen: goldener Glanz läuft einmal über die Karte (nacheinander) */
.achievement-new::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255, 225, 120, 0.45) 50%, transparent 65%);
  transform: translateX(-100%);
  animation: achievement-shine 1.1s ease-out calc(0.3s + var(--i) * 0.2s) forwards;
  pointer-events: none;
}
@keyframes achievement-shine {
  to { transform: translateX(100%); }
}
</style>
