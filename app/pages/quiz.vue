<script setup>
definePageMeta({
  i18n: { paths: { de: '/welche-klasse-passt-zu-mir', en: '/wow-class-quiz' } }
})

const { t } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: () => t('quiz.title'),
  description: () => t('quiz.description'),
  ogTitle: () => t('quiz.heading')
})

const started = ref(false)
const step = ref(0)
const answers = reactive({})

const current = computed(() => quizQuestions[step.value])
const finished = computed(() => step.value >= quizQuestions.length)
const results = computed(() => finished.value ? scoreQuiz(answers).slice(0, 3) : [])

const track = (event, data) => {
  if (typeof window !== 'undefined' && window.umami) window.umami.track(event, data)
}

const answer = (option) => {
  answers[current.value.id] = option
  step.value++
  if (finished.value) {
    track('Quiz - Finished', { top: results.value.map(r => r.id).join(',') })
  }
}

const back = () => {
  if (step.value > 0) step.value--
}

const restart = () => {
  Object.keys(answers).forEach(k => delete answers[k])
  step.value = 0
  started.value = true
}

const start = () => {
  started.value = true
  track('Quiz - Start')
}
</script>

<template>
  <main class="max-w-3xl w-[90%] mx-auto mt-8">
    <h1 class="text-3xl font-extrabold text-yellow-400">{{ $t('quiz.heading') }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t('quiz.intro') }}</p>

    <section class="section mt-8 min-h-[320px]">
      <div v-if="!started" class="flex flex-col items-center justify-center gap-6 py-10">
        <div class="flex flex-wrap justify-center gap-1.5">
          <img v-for="c in classInfo" :key="c.id" :src="c.icon" alt="" width="36" height="36" class="w-9 h-9 rounded-sm" />
        </div>
        <button class="arcade-btn group relative overflow-hidden" @click="start">
          <span class="relative z-10">{{ $t('quiz.start') }}</span>
          <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
        </button>
      </div>

      <div v-else-if="!finished">
        <div class="flex items-center justify-between text-xs uppercase tracking-wider text-neutral-400 font-bold">
          <span>{{ $t('quiz.question', { current: step + 1, total: quizQuestions.length }) }}</span>
          <button v-if="step > 0" class="hover:text-yellow-400" @click="back">← {{ $t('quiz.back') }}</button>
        </div>
        <div class="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div class="h-full bg-yellow-400 transition-all duration-300" :style="{ width: `${(step / quizQuestions.length) * 100}%` }" />
        </div>

        <h2 class="mt-6 text-xl font-bold text-white">{{ $t(`quiz.q.${current.id}.title`) }}</h2>
        <div class="mt-4 grid gap-2" :class="current.options.length > 6 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
          <button
            v-for="opt in current.options"
            :key="opt"
            class="text-left rounded-lg border px-4 py-3 transition-colors"
            :class="answers[current.id] === opt ? 'border-yellow-400 bg-yellow-400/10 text-white' : 'border-neutral-700 bg-neutral-900/70 text-neutral-200 hover:border-neutral-500'"
            @click="answer(opt)"
          >
            {{ $t(`quiz.q.${current.id}.options.${opt}`) }}
          </button>
        </div>
      </div>

      <div v-else>
        <h2 class="text-xl font-bold text-white">{{ $t('quiz.resultTitle') }}</h2>
        <p class="mt-1 text-neutral-400">{{ $t('quiz.resultIntro') }}</p>
        <ol class="mt-6 space-y-3">
          <li v-for="(r, i) in results" :key="r.id" class="flex items-center gap-4">
            <span class="text-2xl font-black text-neutral-600 w-6">{{ i + 1 }}</span>
            <ClassCard :class-id="r.id" class="flex-1" />
            <span class="text-sm font-bold text-yellow-400 whitespace-nowrap">{{ $t('quiz.match', { percent: r.percent }) }}</span>
          </li>
        </ol>
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <NuxtLink :to="localePath({ name: 'index', query: { classes: results.map(r => r.id).join(',') } })" class="arcade-btn group relative overflow-hidden">
            <span class="relative z-10">{{ $t('quiz.fightResult') }}</span>
            <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
          </NuxtLink>
          <button class="btn-secondary" @click="restart">{{ $t('quiz.restart') }}</button>
        </div>
      </div>
    </section>

    <ContentBlock name="quiz" class="mt-12" />
  </main>
</template>
