<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, tm, rt, locale } = useI18n()
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
const { unlock } = useAchievements()

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

// Quest-Angebot: annehmen oder (mehrfach) ablehnen
const declineCount = ref(0)
const declineLines = computed(() => tm('quest.declineLines').map(line => rt(line)))
const declineLine = computed(() => declineLines.value[Math.min(declineCount.value, declineLines.value.length) - 1])
const finalDecline = computed(() => declineCount.value >= declineLines.value.length)

const decline = () => {
  declineCount.value++
  if (declineCount.value >= achievementThresholds.declines) unlock('murloc')
  track('quiz_decline', { count: declineCount.value })
}

// Einblendung wie im Spiel: „Quest angenommen“ / „Quest abgeschlossen“
const toast = ref('')
let toastTimer
const showToast = (text) => {
  toast.value = text
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2600)
}

const start = () => {
  started.value = true
  showToast(t('quest.acceptedToast'))
  track('quiz_start', { declined_before: declineCount.value })
}

watch(finished, (done) => {
  if (done) {
    showToast(t('quest.completedToast'))
    unlock('quest_done')
  }
})

const questParagraphs = computed(() => t('quest.questText').split('\n\n'))

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
    <section class="wow-frame relative mt-8 !p-0 overflow-hidden">
      <!-- Einblendung wie im Spiel -->
      <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-500" leave-to-class="opacity-0">
        <div v-if="toast" class="pointer-events-none fixed inset-x-0 top-[22%] z-50 bg-gradient-to-r from-transparent via-black/85 to-transparent px-4 py-4 text-center font-display text-2xl font-bold text-gold [text-shadow:0_2px_4px_#000] sm:text-3xl" role="status">{{ toast }}</div>
      </Transition>

      <!-- Questgeber -->
      <div class="flex items-center gap-3 border-b border-gold-border/60 bg-black/40 px-5 py-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-[#2a1d08] font-display text-xl font-black text-gold shadow-[0_0_10px_rgba(255,209,0,0.4)]" aria-hidden="true">{{ finished ? '?' : '!' }}</span>
        <div class="min-w-0">
          <div class="font-display text-lg font-bold leading-tight text-gold">{{ finished ? $t('quiz.completeTitle') : $t('quiz.questTitle') }}</div>
          <div class="text-[14px] text-quality-uncommon">{{ $t('quest.npcName') }} <span class="text-neutral-400">&lt;{{ $t('quest.npcTitle') }}&gt;</span></div>
        </div>
      </div>

      <div class="wow-parchment !rounded-none !border-0 !shadow-[inset_0_0_40px_rgba(90,60,20,0.45)] min-h-[340px]">
        <!-- Quest-Angebot -->
        <div v-if="!started && !declineCount">
          <p v-for="(para, i) in questParagraphs" :key="i" class="mb-3 text-[18px] leading-relaxed">{{ para }}</p>
          <h2 class="mt-5 font-display text-lg font-bold text-[#4a2408]">{{ $t('quiz.objectivesTitle') }}</h2>
          <p class="mt-1">{{ $t('quest.objective') }}</p>
          <h2 class="mt-5 font-display text-lg font-bold text-[#4a2408]">{{ $t('quest.rewardsLabel') }}</h2>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <span class="flex items-center gap-2 rounded-[4px] border border-quality-epic bg-[#0b0b1d]/90 py-1 pl-1 pr-3">
              <span class="wow-slot flex h-9 w-9 items-center justify-center font-display text-xl font-black text-quality-epic" aria-hidden="true">?</span>
              <span class="font-display text-[15px] font-bold text-quality-epic">{{ $t('quest.rewardInsight') }}</span>
            </span>
          </div>
          <p class="mt-2 text-[15px]">{{ $t('quest.rewardXp') }}</p>
          <p class="text-[15px] italic text-[#6b5023]">{{ $t('quest.rewardGold') }}</p>
          <div class="mt-5 flex flex-wrap gap-1.5">
            <img v-for="c in getClassList(mode)" :key="c.id" :src="c.icon" alt="" width="40" height="40" class="wow-slot h-10 w-10 !border-[#4a3415]" />
          </div>
        </div>

        <!-- Abgelehnt: Thalgrim reagiert -->
        <div v-else-if="!started" aria-live="polite">
          <p class="text-[19px] italic leading-relaxed text-[#2a1606]">{{ locale === 'de' ? `„${declineLine}“` : `"${declineLine}"` }}</p>
          <p class="mt-2 text-[14px] text-[#6b5023]">– {{ $t('quest.npcName') }}</p>
          <div v-if="finalDecline" class="mt-6">
            <NuxtLink :to="localePath(routeNameFor('zufall', mode))" class="wow-btn">🎲 {{ $t('quest.declineRandom') }}</NuxtLink>
          </div>
        </div>

        <!-- Fragen als Dialog-Optionen -->
        <div v-else-if="!finished">
          <div class="flex items-center justify-between font-display text-[12px] font-bold uppercase tracking-wider text-[#6b5023]">
            <span>{{ $t('quiz.question', { current: step + 1, total: questions.length }) }}</span>
            <button v-if="step > 0" class="hover:text-[#8b1a0a]" @click="back">‹ {{ $t('quiz.back') }}</button>
          </div>
          <p class="mt-3 italic text-[#5a3d14]">{{ $t(`quest.npcLines.${current.id}`) }}</p>
          <h2 class="mt-2 font-display text-xl font-bold text-[#2a1606]">{{ $t(`quiz.q.${current.id}.title`) }}</h2>
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
          <p class="text-[18px] italic leading-relaxed text-[#2a1606]">{{ $t('quest.completeText', { class: $t(`classes.${results[0].id}.name`) }) }}</p>
          <h2 class="mt-5 font-display text-lg font-bold text-[#4a2408]">{{ $t('quiz.rewardsTitle') }}</h2>
          <ol class="mt-3 grid gap-2 sm:grid-cols-3">
            <li v-for="(r, i) in results" :key="r.id">
              <NuxtLink :to="classLink(r.id)" @click="track('result_class_click', { source: 'quiz', class_id: r.id, place: i + 1 })" class="flex items-center gap-3 rounded-md border bg-[#0b0b1d]/90 p-2 transition-transform hover:-translate-y-0.5" :class="quality[i].split(' ')[1]">
                <img :src="getClassInfo(r.id, mode)?.icon" :alt="$t(`classes.${r.id}.name`)" width="44" height="44" class="wow-slot h-11 w-11 !border-2" :class="quality[i].split(' ')[1]" />
                <span class="flex flex-col">
                  <span class="font-display font-bold" :class="quality[i].split(' ')[0]">{{ $t(`classes.${r.id}.name`) }}</span>
                  <span class="text-[13px] text-neutral-300">{{ $t('quiz.match', { percent: r.percent }) }}</span>
                </span>
              </NuxtLink>
            </li>
          </ol>
          <p class="mt-3 text-[14px] italic text-[#6b5023]">{{ $t('quiz.rewardHint') }}</p>
          <p class="mt-2 text-[15px]">{{ $t('quest.rewardXp') }}</p>
        </div>
      </div>

      <!-- Fortschritt wie ein Erfahrungsbalken -->
      <div class="h-2.5 bg-black/70">
        <div class="h-full bg-gradient-to-b from-[#c76bff] to-[#58139e] transition-all duration-300" :style="{ width: `${(Math.min(step, questions.length) / questions.length) * 100}%` }" />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gold-border/60 bg-black/40 px-5 py-3">
        <span class="text-[13px] text-neutral-400">{{ started ? $t('quiz.progress', { current: Math.min(step, questions.length), total: questions.length }) : '' }}</span>
        <div class="flex flex-wrap gap-2">
          <template v-if="!started">
            <button class="wow-btn" @click="start">{{ declineCount ? $t('quest.declineAccept') : $t('quiz.accept') }}</button>
            <button v-if="!finalDecline" class="wow-btn wow-btn-stone" @click="decline">{{ $t('quest.decline') }}</button>
          </template>
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
