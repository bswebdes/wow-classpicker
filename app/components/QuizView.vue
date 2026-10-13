<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t } = useI18n()
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
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t(k('intro')) }}</p>

    <section class="wow-frame mt-8 min-h-[340px]">
      <div v-if="!started" class="flex flex-col items-center justify-center gap-6 py-10">
        <div class="flex flex-wrap justify-center gap-1.5">
          <img v-for="c in getClassList(mode)" :key="c.id" :src="c.icon" alt="" width="40" height="40" class="wow-slot h-10 w-10" />
        </div>
        <button class="wow-btn wow-btn-lg" @click="start">{{ $t('quiz.start') }}</button>
      </div>

      <div v-else-if="!finished">
        <div class="flex items-center justify-between font-display text-[12px] font-bold uppercase tracking-wider text-neutral-400">
          <span>{{ $t('quiz.question', { current: step + 1, total: questions.length }) }}</span>
          <button v-if="step > 0" class="hover:text-gold" @click="back">‹ {{ $t('quiz.back') }}</button>
        </div>
        <!-- Fortschritt wie ein Erfahrungsbalken -->
        <div class="mt-2 h-3 overflow-hidden rounded-[2px] border border-black bg-neutral-900">
          <div class="h-full bg-gradient-to-b from-[#c76bff] to-[#58139e] transition-all duration-300" :style="{ width: `${(step / questions.length) * 100}%` }" />
        </div>

        <h2 class="mt-6 font-display text-xl font-bold text-white">{{ $t(`quiz.q.${current.id}.title`) }}</h2>
        <div class="mt-4 grid gap-2" :class="current.options.length > 6 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
          <button
            v-for="opt in current.options"
            :key="opt"
            class="wow-tooltip !py-3 text-left transition-colors hover:border-gold hover:text-gold"
            :class="answers[current.id] === opt ? '!border-gold text-gold' : 'text-neutral-100'"
            @click="answer(opt)"
          >
            {{ $t(`quiz.q.${current.id}.options.${opt}`) }}
          </button>
        </div>
      </div>

      <div v-else>
        <h2 class="font-display text-xl font-bold text-gold">{{ $t('quiz.resultTitle') }}</h2>
        <p class="mt-1 text-neutral-400">{{ $t('quiz.resultIntro') }}</p>
        <ol class="mt-6 space-y-3">
          <li v-for="(r, i) in results" :key="r.id" class="flex items-center gap-4">
            <span class="wow-title w-6 text-2xl">{{ i + 1 }}</span>
            <ClassCard :class-id="r.id" :mode="mode" class="flex-1" />
            <span class="whitespace-nowrap font-display text-[14px] font-bold text-quality-uncommon">{{ $t('quiz.match', { percent: r.percent }) }}</span>
          </li>
        </ol>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: results.map(r => r.id).join(',') } })" class="wow-btn">
            ⚔ {{ $t('quiz.fightResult') }}
          </NuxtLink>
          <button class="wow-btn wow-btn-stone" @click="restart">{{ $t('quiz.restart') }}</button>
        </div>
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-quiz' : 'quiz'" class="mt-12" />
  </main>
</template>
