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
        <ul class="mt-6 space-y-2">
          <li
            v-for="a in achievementDefs"
            :key="a.id"
            class="flex items-center gap-3 rounded-md border p-2.5"
            :class="state.unlocked[a.id] ? 'border-gold-border bg-gradient-to-r from-[#2a2014] to-transparent' : 'border-neutral-800 bg-black/40'"
          >
            <img :src="a.icon" alt="" width="44" height="44" class="wow-slot h-11 w-11 shrink-0" :class="state.unlocked[a.id] ? '!border-gold-border' : 'grayscale opacity-40'" />
            <div class="min-w-0 flex-1">
              <div class="font-display font-bold" :class="state.unlocked[a.id] ? 'text-white' : 'text-neutral-500'">
                {{ a.secret && !state.unlocked[a.id] ? '???' : $t(`achievements.list.${a.id}.name`) }}
              </div>
              <div class="text-[14px]" :class="state.unlocked[a.id] ? 'text-neutral-300' : 'text-neutral-600'">
                {{ a.secret && !state.unlocked[a.id] ? $t('achievements.secret') : $t(`achievements.list.${a.id}.desc`) }}
              </div>
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
