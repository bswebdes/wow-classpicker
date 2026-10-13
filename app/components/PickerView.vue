<script setup>
import { classData } from '~/composables/useBattle'

const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const {
  selectedClasses,
  characters,
  battleLog,
  isBattleInProgress,
  isStarted,
  winner,
  rounds,
  ranking,
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
const { unlock } = useAchievements()

// Erfolge nach dem Kampf
watch(() => winner.value, (w) => {
  if (!w) return
  unlock('arena_win')
  if (characters.value.length >= classIds.value.length) unlock('battle_royale')
})
const localePath = useLocalePath()

const classIds = computed(() => getClassList(props.mode).map(c => c.id).filter(id => id in classData))
usePageSeo({
  title: () => props.mode === 'forever' ? t('forever.home.title') : t('seo.title'),
  description: () => props.mode === 'forever' ? t('forever.home.description') : t('seo.description'),
  ogTitle: () => props.mode === 'forever' ? t('forever.home.heading') : t('home.ogTitle'),
  ogSubtitle: () => t('siteSeo.homeOgSubtitle'),
  mode: props.mode
})

useSchemaOrg([
  defineSoftwareApp({
    name: props.mode === 'forever' ? 'Find Your Main – WoW Forever Class Picker' : 'Find Your Main – WoW Class Picker',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    offers: { price: 0, priceCurrency: 'EUR' }
  })
])

const heading = computed(() => props.mode === 'forever' ? t('forever.home.heading') : t('welcome'))
const intro = computed(() => props.mode === 'forever' ? t('forever.home.intro') : t('description'))

// Vorauswahl über ?classes=mage,rogue (z. B. aus dem Quiz)
const route = useRoute()
onMounted(() => {
  const preselect = String(route.query.classes || '').split(',').filter(id => classIds.value.includes(id))
  preselect.forEach(id => {
    if (!selectedClasses.value.has(id)) toggleClass(id)
  })
  showSelectionIntro.value = true
})

// Arcade-Intro Steuerung
const showBattleIntro = ref(false)
const onBattleIntroFinished = () => {
  // Battle-Intro zurücksetzen, damit es beim nächsten Mal erneut ausgelöst werden kann
  showBattleIntro.value = false
  showResult.value = true
  initBattle(props.mode)
  startBattle()
}

// Selection-Intro beim Laden und nach Reset
const showSelectionIntro = ref(false)
// Siegerauswertung kann geschlossen werden, um den Kampfverlauf anzusehen
const showResult = ref(true)
const onSelectionIntroFinished = () => {
  showSelectionIntro.value = false
}

const handleStart = () => {
  if (selectedClasses.value.size < 2) {
    alert(t('minTwoClasses'))
    return
  }
  trackEvent('battle_start', {
    class_count: selectedClasses.value.size,
    classes: Array.from(selectedClasses.value).join(','),
    game_mode: props.mode
  })
  showBattleIntro.value = true
}

const handleReset = () => {
  trackEvent('battle_reset', { game_mode: props.mode })
  resetBattle()
  // kurze Verzögerung, damit UI zurückspringt, dann Intro zeigen
  setTimeout(() => { showSelectionIntro.value = true }, 50)
}
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <header class="text-center">
      <GameLogo :mode="mode" :width="240" eager class="mx-auto mb-4 w-[180px] sm:w-[240px]" />
      <h1 class="wow-title text-3xl sm:text-4xl">{{ heading }}</h1>
      <p class="mx-auto mt-3 max-w-3xl text-neutral-300">{{ intro }}</p>
    </header>

    <!-- Street-Fighter-Style Intros -->
    <BattleIntro :show="showSelectionIntro" mode="selection" @finished="onSelectionIntroFinished" />
    <BattleIntro :show="showBattleIntro" mode="battle" @finished="onBattleIntroFinished" />

    <div class="mt-8">
      <ClassSelection
        v-if="!isStarted"
        :class-ids="classIds"
        :selected-classes="selectedClasses"
        :custom-names="customNames"
        :is-battle-in-progress="isBattleInProgress"
        @toggle="toggleClass"
        @select-all="selectAll(classIds)"
        @deselect-all="deselectAll"
        @randomize-name="randomizeName"
        @randomize-all="randomizeAllNames"
      />

      <section v-if="isStarted" class="wow-frame">
        <div class="mb-1 flex items-center justify-between font-display text-[12px] font-bold uppercase tracking-wider text-neutral-400">
          <span>{{ $t('arenaStatus') }}</span>
          <span>{{ Math.round(globalHpPercent) }}%</span>
        </div>
        <div class="h-3 overflow-hidden rounded-[2px] border border-black bg-neutral-900">
          <div class="h-full bg-gradient-to-r from-[#8b0f0f] via-[#c9a227] to-[#2fa82f] transition-all duration-500 ease-out" :style="{ width: globalHpPercent + '%' }" />
        </div>
        <div id="arena" class="mt-5 flex min-h-[200px] flex-wrap items-start justify-center gap-3">
          <CharacterCard v-for="char in characters" :key="char.id" :character="char" />
        </div>
      </section>

      <div class="mt-6 flex items-center justify-center gap-3">
        <button v-if="!isStarted" class="wow-btn wow-btn-lg" @click="handleStart">
          ⚔ {{ $t('startBattle') }}
        </button>
        <button v-if="isStarted && !isBattleInProgress" id="reset-btn" class="wow-btn wow-btn-stone" @click="handleReset">
          {{ $t('backToSelection') }}
        </button>
      </div>

      <!-- Kampflog und Meter erst, wenn gekämpft wird -->
      <div v-if="isStarted" class="mt-6 grid gap-4 lg:grid-cols-2">
        <BattleLog :log-entries="battleLog" />
        <DpsMeter :characters="characters" />
      </div>

      <VictoryScreen v-if="winner && showResult" :winner="winner" :ranking="ranking" :rounds="rounds" :mode="mode" @close="showResult = false" @again="handleReset" />
      <div v-if="winner && !showResult" class="mt-6 text-center">
        <button class="wow-btn" @click="showResult = true">🏆 {{ $t('result.show') }}</button>
      </div>
    </div>

    <section class="mt-14">
      <h2 class="wow-title text-2xl">{{ $t('home.toolsTitle') }}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-3">
        <NuxtLink
          v-for="tool in [
            { to: localePath(routeNameFor('quiz', mode)), title: $t('nav.quiz'), text: $t('home.quizTeaser') },
            { to: localePath(routeNameFor('zufall', mode)), title: $t('nav.random'), text: mode === 'forever' ? $t('forever.home.randomTeaser') : $t('home.randomTeaser') },
            { to: localePath(routeNameFor('klassen', mode)), title: $t('nav.classes'), text: mode === 'forever' ? $t('forever.home.classesTeaser') : $t('home.classesTeaser') }
          ]"
          :key="tool.to"
          :to="tool.to"
          class="wow-tooltip block transition-colors hover:border-gold"
        >
          <span class="block font-display font-bold text-gold">{{ tool.title }}</span>
          <span class="mt-1 block text-[15px] text-neutral-300">{{ tool.text }}</span>
        </NuxtLink>
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-home' : 'home'" class="mt-12" />
  </main>
</template>
