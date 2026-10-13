<script setup>
import { classData } from '~/composables/useBattle'

const {
  selectedClasses,
  characters,
  battleLog,
  isBattleInProgress,
  isStarted,
  winner,
  initBattle,
  startBattle,
  resetBattle,
  toggleClass,
  selectAll,
  deselectAll,
  globalHpPercent,
  customNames,
  randomizeName,
  randomizeAllNames
} = useBattle()

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('home.ogTitle'),
  ogSubtitle: () => t('siteSeo.homeOgSubtitle')
})

// Vorauswahl über ?classes=mage,rogue (z. B. aus dem Quiz)
const route = useRoute()
onMounted(() => {
  const preselect = String(route.query.classes || '').split(',').filter(id => id in classData)
  preselect.forEach(id => {
    if (!selectedClasses.value.has(id)) toggleClass(id)
  })
})

// Arcade-Intro Steuerung
const showBattleIntro = ref(false)
const onBattleIntroFinished = () => {
  // Battle-Intro zurücksetzen, damit es beim nächsten Mal erneut ausgelöst werden kann
  showBattleIntro.value = false
  initBattle()
  startBattle()
}

// Selection-Intro beim Laden und nach Reset
const showSelectionIntro = ref(false)
const onSelectionIntroFinished = () => {
  showSelectionIntro.value = false
}

onMounted(() => {
  showSelectionIntro.value = true
})

const handleStart = () => {
  if (selectedClasses.value.size < 2) {
    alert(t('minTwoClasses'))
    return
  }
  
  // Umami Tracking
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track('Battle - Start', { 
      classesCount: selectedClasses.value.size, 
      classes: Array.from(selectedClasses.value).join(',') 
    })
  }

  showBattleIntro.value = true
}

const handleReset = () => {
  // Umami Tracking
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track('Battle - Reset')
  }

  resetBattle()
  // kurze Verzögerung, damit UI zurückspringt, dann Intro zeigen
  setTimeout(() => { showSelectionIntro.value = true }, 50)
}

</script>

<template>
  <div class="max-w-5xl w-[90%] mx-auto text-center card p-6 mt-8">
    <header class="mb-6">
      <h1 class="text-3xl font-extrabold text-yellow-400 drop-shadow-xs">{{ $t('welcome') }}</h1>
      <p class="mt-2 italic text-neutral-400">{{ $t('description') }}</p>
    </header>

    <!-- Street-Fighter-Style Intros -->
    <BattleIntro :show="showSelectionIntro" mode="selection" @finished="onSelectionIntroFinished" />
    <BattleIntro :show="showBattleIntro" mode="battle" @finished="onBattleIntroFinished" />

    <main>
      <ClassSelection 
        v-if="!isStarted"
        :selected-classes="selectedClasses"
        :custom-names="customNames"
        :is-battle-in-progress="isBattleInProgress"
        @toggle="toggleClass"
        @select-all="selectAll"
        @deselect-all="deselectAll"
        @randomize-name="randomizeName"
        @randomize-all="randomizeAllNames"
      />

      <div v-if="isStarted" class="mb-4">
        <div class="flex justify-between items-center mb-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span>{{ $t('arenaStatus') }}</span>
          <span>{{ Math.round(globalHpPercent) }}%</span>
        </div>
        <div class="w-full h-3 bg-neutral-800 border border-neutral-700 rounded-full overflow-hidden shadow-inner">
          <div 
            class="h-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
            :style="{ width: globalHpPercent + '%' }"
          ></div>
        </div>
      </div>

      <div v-if="isStarted" id="arena" class="flex justify-center items-end flex-wrap gap-4 mb-8 p-5 section min-h-[250px]">
        <CharacterCard 
          v-for="char in characters" 
          :key="char.id" 
          :character="char" 
        />
      </div>

      <div class="mt-8 flex items-center justify-center gap-3">
        <button 
          v-if="!isStarted" 
          class="arcade-btn group relative overflow-hidden" 
          @click="handleStart"
        >
          <span class="relative z-10">{{ $t('startBattle') }}</span>
          <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
        </button>
        <button v-if="isStarted && !isBattleInProgress" id="reset-btn" class="btn-secondary" @click="handleReset">
          {{ $t('backToSelection') }}
        </button>
      </div>

      <div class="mt-6">
        <BattleLog :log-entries="battleLog" />
      </div>

      <div class="mt-6">
        <DpsMeter v-if="isStarted" :characters="characters" />
      </div>

      <div class="mt-6">
        <VictoryScreen v-if="winner" :winner="winner" @close="handleReset" />
      </div>
    </main>

    <section class="mt-12 pt-8 border-t border-neutral-800 text-left">
      <h2 class="text-2xl font-extrabold text-yellow-400 mb-4">{{ $t('home.toolsTitle') }}</h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <NuxtLink :to="localePath('quiz')" class="section block hover:border-yellow-500/60 transition-colors">
          <span class="block font-bold text-white mb-1">{{ $t('nav.quiz') }}</span>
          <span class="text-sm text-neutral-400">{{ $t('home.quizTeaser') }}</span>
        </NuxtLink>
        <NuxtLink :to="localePath('zufall')" class="section block hover:border-yellow-500/60 transition-colors">
          <span class="block font-bold text-white mb-1">{{ $t('nav.random') }}</span>
          <span class="text-sm text-neutral-400">{{ $t('home.randomTeaser') }}</span>
        </NuxtLink>
        <NuxtLink :to="localePath('klassen')" class="section block hover:border-yellow-500/60 transition-colors">
          <span class="block font-bold text-white mb-1">{{ $t('nav.classes') }}</span>
          <span class="text-sm text-neutral-400">{{ $t('home.classesTeaser') }}</span>
        </NuxtLink>
      </div>

      <ContentBlock name="home" class="mt-10" />
    </section>
  </div>
</template>
