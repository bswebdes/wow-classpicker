<script setup>
// Teilen-Seite „Mein Main“: Ergebnis aus Quiz oder Arena, Daten kommen aus der URL
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const info = computed(() => getClassBySlug(String(route.params.slug), locale.value, props.mode))
if (!info.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

const setI18nParams = useSetI18nParams()
setI18nParams({ de: { slug: info.value.slug.de }, en: { slug: info.value.slug.en } })

const className = computed(() => t(`classes.${info.value.id}.name`))
const game = computed(() => props.mode === 'forever' ? 'WoW Forever' : 'WoW Midnight')

usePageSeo({
  title: () => t('share.title', { game: game.value, class: className.value }),
  description: () => t('share.description', { game: game.value, class: className.value }),
  ogTitle: () => t('share.heading', { class: className.value }),
  ogSubtitle: () => t('share.yourTurn'),
  classes: [info.value.id],
  mode: props.mode,
  image: `class-${info.value.id}`,
  art: info.value.id
})
// Dünne Seite nur zum Teilen: nicht in den Suchindex
useSeoMeta({ robots: 'noindex, follow' })

// Ergebnis aus der URL erst im Browser lesen (die Seite ist vorgerendert, ohne Parameter)
const source = ref('')
const top = ref([])
const fighterName = ref('')
onMounted(() => {
  const from = String(route.query.from || '')
  if (from === 'quiz') {
    source.value = 'quiz'
    top.value = String(route.query.top || '').split(',').map((part) => {
      const [id, percent] = part.split('.')
      return { id, percent: Math.max(0, Math.min(100, Number.parseInt(percent, 10) || 0)) }
    }).filter(r => getClassInfo(r.id, props.mode)).slice(0, 3)
  }
  else if (from === 'arena') {
    source.value = 'arena'
    const name = String(route.query.name || '').trim()
    // Nur gültige Namen zeigen, sonst den Satz ohne Namen
    fighterName.value = /^[\p{L}' -]{1,24}$/u.test(name) && name !== className.value ? name : ''
  }
})

const classLink = id => localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: getClassInfo(id, props.mode).slug[locale.value] } })
const quality = ['text-quality-epic border-quality-epic', 'text-quality-rare border-quality-rare', 'text-quality-uncommon border-quality-uncommon']
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <PageHero :image="`class-${info.id}`" :alt="$t(`art.heroes.${info.id}`)">
      <div class="flex items-center gap-4 sm:items-end">
        <img :src="`/images/classes/${info.id}.webp`" :alt="`${className}: ${$t(`art.classes.${info.id}`)}`" width="384" height="384" class="h-20 w-20 shrink-0 rounded-md border-2 object-cover sm:h-28 sm:w-28" :style="{ borderColor: info.color }" />
        <h1 class="font-display text-3xl font-bold sm:text-4xl" :style="{ color: info.color, textShadow: '0 2px 6px #000, 0 0 2px #000' }">{{ $t('share.heading', { class: className }) }}</h1>
      </div>
    </PageHero>

    <section class="wow-objective mt-6">
      <p class="text-[18px] text-neutral-100">
        <template v-if="source === 'quiz'">{{ $t('share.fromQuiz', { class: className }) }}</template>
        <template v-else-if="source === 'arena'">{{ fighterName ? $t('share.fromArena', { name: fighterName, class: className }) : $t('share.fromArenaNoName', { class: className }) }}</template>
        <template v-else>{{ $t('share.generic', { class: $t(`classAccusative.${info.id}`) }) }}</template>
      </p>
    </section>

    <section v-if="top.length" class="mt-6">
      <h2 class="font-display text-lg font-bold text-gold">{{ $t('share.top3') }}</h2>
      <ol class="mt-3 grid gap-2 sm:grid-cols-3">
        <li v-for="(r, i) in top" :key="r.id">
          <NuxtLink :to="classLink(r.id)" class="flex items-center gap-3 rounded-md border bg-[#0b0b1d]/90 p-2 transition-transform hover:-translate-y-0.5" :class="quality[i].split(' ')[1]">
            <img :src="getClassInfo(r.id, mode).icon" :alt="$t(`classes.${r.id}.name`)" width="44" height="44" class="wow-slot h-11 w-11 !border-2" :class="quality[i].split(' ')[1]" />
            <span class="flex flex-col">
              <span class="font-display font-bold" :class="quality[i].split(' ')[0]">{{ $t(`classes.${r.id}.name`) }}</span>
              <span class="text-[13px] text-neutral-300">{{ $t('quiz.match', { percent: r.percent }) }}</span>
            </span>
          </NuxtLink>
        </li>
      </ol>
    </section>

    <section class="mt-10 text-center">
      <h2 class="wow-title text-2xl">{{ $t('share.yourTurn') }}</h2>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <NuxtLink :to="localePath(routeNameFor('quiz', mode))" class="wow-btn wow-btn-lg">{{ $t('share.ctaQuiz') }} ›</NuxtLink>
        <NuxtLink :to="localePath(routeNameFor('index', mode))" class="wow-btn wow-btn-stone wow-btn-lg">⚔ {{ $t('share.ctaArena') }}</NuxtLink>
      </div>
      <p class="mt-6">
        <NuxtLink :to="classLink(info.id)" class="text-neutral-300 underline decoration-dotted underline-offset-2 hover:text-gold">{{ $t('result.learnMore', { class: $t(`classAccusative.${info.id}`) }) }} ›</NuxtLink>
      </p>
    </section>
    <p class="mt-8 text-right text-[12px] text-neutral-500">{{ $t('art.credit') }}</p>
  </main>
</template>
