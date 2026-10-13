<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const k = (key) => props.mode === 'forever' ? `forever.quiz.${key}` : `quiz.${key}`

usePageSeo({
  title: () => t(k('title')),
  description: () => t(k('description')),
  ogTitle: () => t(k('heading')),
  mode: props.mode
})

useSchemaOrg([
  defineSoftwareApp({
    name: t(k('heading')),
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    offers: { price: 0, priceCurrency: 'EUR' }
  })
])

const questions = computed(() => quizQuestionsFor(props.mode))
const started = ref(false)
const step = ref(0)
const answers = reactive({})

const current = computed(() => questions.value[step.value])
const finished = computed(() => step.value >= questions.value.length)
const results = computed(() => finished.value ? scoreQuiz(answers, props.mode).slice(0, 3) : [])

const track = (event, data = {}) => trackEvent(event, { ...data, game_mode: props.mode })

const answer = (option) => {
  answers[current.value.id] = option
  step.value++
  if (finished.value) {
    track('quiz_complete', { top_classes: results.value.map(r => r.id).join(',') })
  }
}

const back = () => {
  if (step.value > 0) step.value--
}

const restart = () => {
  Object.keys(answers).forEach(key => delete answers[key])
  step.value = 0
  started.value = true
}

const start = () => {
  started.value = true
  track('quiz_start')
}

const classLink = (id) => {
  const info = getClassInfo(id, props.mode)
  return info ? localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: info.slug[locale.value] } }) : null
}
// Belohnungen in WoW-Qualitätsstufen: episch, selten, ungewöhnlich
const quality = ['text-quality-epic border-quality-epic', 'text-quality-rare border-quality-rare', 'text-quality-uncommon border-quality-uncommon']
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t(k('intro')) }}</p>

    <!-- Questfenster -->
    <section class="wow-frame mt-8 !p-0 overflow-hidden">
      <div class="flex items-center gap-3 border-b border-gold-border/60 bg-black/40 px-5 py-3">
        <span class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-[#2a1d08] font-display text-lg font-black text-gold" aria-hidden="true">{{ finished ? '?' : '!' }}</span>
        <div>
          <div class="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">{{ $t('quiz.questLabel') }}</div>
          <div class="font-display text-lg font-bold text-gold">{{ finished ? $t('quiz.completeTitle') : $t('quiz.questTitle') }}</div>
        </div>
      </div>

      <div class="wow-parchment !rounded-none !border-0 !shadow-[inset_0_0_40px_rgba(90,60,20,0.45)] min-h-[340px]">
        <!-- Quest-Angebot -->
        <div v-if="!started">
          <p class="text-[18px] leading-relaxed">{{ $t('quiz.questText') }}</p>
          <h2 class="mt-6 font-display text-lg font-bold text-[#4a2408]">{{ $t('quiz.objectivesTitle') }}</h2>
          <p class="mt-1">{{ $t('quiz.objective') }}</p>
          <div class="mt-5 flex flex-wrap gap-1.5">
            <img v-for="c in getClassList(mode)" :key="c.id" :src="c.icon" alt="" width="40" height="40" class="wow-slot h-10 w-10 !border-[#4a3415]" />
          </div>
        </div>

        <!-- Fragen als Dialog-Optionen -->
        <div v-else-if="!finished">
          <div class="flex items-center justify-between font-display text-[12px] font-bold uppercase tracking-wider text-[#6b5023]">
            <span>{{ $t('quiz.question', { current: step + 1, total: questions.length }) }}</span>
            <button v-if="step > 0" class="hover:text-[#8b1a0a]" @click="back">‹ {{ $t('quiz.back') }}</button>
          </div>
          <h2 class="mt-3 font-display text-xl font-bold text-[#2a1606]">{{ $t(`quiz.q.${current.id}.title`) }}</h2>
          <ul class="mt-4 space-y-1">
            <li v-for="opt in current.options" :key="opt">
              <button
                class="group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-[17px] transition-colors hover:bg-[#8a6d2b]/20"
                :class="answers[current.id] === opt ? 'bg-[#8a6d2b]/25 font-semibold' : ''"
                @click="answer(opt)"
              >
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8a6d2b] bg-[#f5e6bf] text-[13px] font-black text-[#8a6d2b] group-hover:border-[#8b1a0a] group-hover:text-[#8b1a0a]" aria-hidden="true">▸</span>
                <span class="text-[#2a1606] group-hover:text-[#8b1a0a]">{{ $t(`quiz.q.${current.id}.options.${opt}`) }}</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Quest abgeschlossen: Belohnungen -->
        <div v-else>
          <p class="text-[17px]">{{ $t('quiz.resultIntro') }}</p>
          <h2 class="mt-5 font-display text-lg font-bold text-[#4a2408]">{{ $t('quiz.rewardsTitle') }}</h2>
          <ol class="mt-3 grid gap-2 sm:grid-cols-3">
            <li v-for="(r, i) in results" :key="r.id">
              <NuxtLink :to="classLink(r.id)" class="flex items-center gap-3 rounded-md border bg-[#0b0b1d]/90 p-2 transition-transform hover:-translate-y-0.5" :class="quality[i].split(' ')[1]">
                <img :src="getClassInfo(r.id, mode)?.icon" :alt="$t(`classes.${r.id}.name`)" width="44" height="44" class="wow-slot h-11 w-11 !border-2" :class="quality[i].split(' ')[1]" />
                <span class="flex flex-col">
                  <span class="font-display font-bold" :class="quality[i].split(' ')[0]">{{ $t(`classes.${r.id}.name`) }}</span>
                  <span class="text-[13px] text-neutral-300">{{ $t('quiz.match', { percent: r.percent }) }}</span>
                </span>
              </NuxtLink>
            </li>
          </ol>
          <p class="mt-3 text-[14px] italic text-[#6b5023]">{{ $t('quiz.rewardHint') }}</p>
        </div>
      </div>

      <!-- Fortschritt wie ein Erfahrungsbalken -->
      <div class="h-2.5 bg-black/70">
        <div class="h-full bg-gradient-to-b from-[#c76bff] to-[#58139e] transition-all duration-300" :style="{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }" />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gold-border/60 bg-black/40 px-5 py-3">
        <span class="text-[13px] text-neutral-400">{{ started ? $t('quiz.progress', { current: Math.min(step, questions.length), total: questions.length }) : '' }}</span>
        <div class="flex flex-wrap gap-2">
          <button v-if="!started" class="wow-btn" @click="start">{{ $t('quiz.accept') }}</button>
          <template v-else-if="finished">
            <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: results.map(r => r.id).join(',') } })" class="wow-btn">
              ⚔ {{ $t('quiz.fightResult') }}
            </NuxtLink>
            <button class="wow-btn wow-btn-stone" @click="restart">{{ $t('quiz.restart') }}</button>
          </template>
        </div>
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-quiz' : 'quiz'" class="mt-12" />
  </main>
</template>
