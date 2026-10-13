<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const info = computed(() => getClassBySlug(String(route.params.slug), locale.value, props.mode))
if (!info.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

const collection = computed(() => {
  const forever = props.mode === 'forever'
  return locale.value === 'en'
    ? { name: forever ? 'forever_classes_en' : 'classes_en', path: `${forever ? '/forever' : ''}/classes/${route.params.slug}` }
    : { name: forever ? 'forever_classes_de' : 'classes_de', path: `${forever ? '/forever' : ''}/klassen/${route.params.slug}` }
})

const { data: page } = await useAsyncData(() => `class-${props.mode}-${locale.value}-${route.params.slug}`, () =>
  queryCollection(collection.value.name).path(collection.value.path).first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

const setI18nParams = useSetI18nParams()
setI18nParams({
  de: { slug: info.value.slug.de },
  en: { slug: info.value.slug.en }
})

const className = computed(() => t(`classes.${info.value.id}.name`))
const races = computed(() => props.mode === 'forever' ? racesForClass(info.value.id) : [])
const specsLabel = computed(() => props.mode === 'forever' ? t('forever.talentTrees') : t('common.specs'))
const gameName = computed(() => props.mode === 'forever' ? 'WoW Forever' : 'WoW Midnight')

// FAQ aus den Klassendaten: immer korrekt und auf jeder Klassenseite gleich aufgebaut
const faq = computed(() => {
  const c = info.value
  const list = (items) => new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items)
  const roles = list(classRoles(c).map(r => t(`common.roles.${r}`)))
  const specs = list(c.specs.map(s => s.name[locale.value]))
  const level = c.difficulty <= 2 ? 'easy' : c.difficulty === 3 ? 'medium' : 'hard'
  const items = [
    { q: t('classFaq.rolesQ', { class: className.value, game: gameName.value }), a: t('classFaq.rolesA', { class: className.value, roles, specsLabel: specsLabel.value, specs }) },
    { q: t('classFaq.armorQ', { class: className.value }), a: t('classFaq.armorA', { class: className.value, armor: t(`common.armor.${c.armor}`) }) },
    { q: t('classFaq.beginnerQ', { class: className.value }), a: t(`classFaq.beginnerA.${level}`, { class: className.value }) },
    { q: t('classFaq.soloQ', { class: className.value }), a: t(c.solo >= 4 ? 'classFaq.soloA.good' : c.solo === 3 ? 'classFaq.soloA.medium' : 'classFaq.soloA.weak', { class: className.value }) }
  ]
  if (races.value.length) {
    items.push({ q: t('classFaq.racesQ', { class: className.value }), a: t('classFaq.racesA', { class: className.value, races: list(races.value.map(r => r.name[locale.value])) }) })
  }
  return items
})

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => `${className.value} – ${gameName.value}`,
  ogSubtitle: () => page.value.description,
  classes: [info.value.id],
  mode: props.mode,
  faq: faq.value,
  dateModified: page.value.updated || page.value.date
})

useSchemaOrg([
  defineArticle({
    headline: page.value.title,
    description: page.value.description,
    ...(page.value.date ? { datePublished: page.value.date, dateModified: page.value.updated || page.value.date } : {})
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: props.mode === 'forever' ? `${t('nav.classes')} (WoW Forever)` : t('nav.classes'), item: localePath(routeNameFor('klassen', props.mode)) },
      { name: className.value }
    ]
  })
])

const otherClasses = computed(() => getClassList(props.mode).filter(c => c.id !== info.value.id))
const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <nav class="mb-4 text-[14px] text-neutral-400" aria-label="Breadcrumb">
      <NuxtLink :to="localePath(routeNameFor('klassen', mode))" class="hover:text-gold">{{ $t('nav.classes') }}</NuxtLink>
      <span class="mx-2">›</span>
      <span :style="{ color: info.color }">{{ className }}</span>
    </nav>

    <header class="flex flex-col items-start gap-5 sm:flex-row">
      <img :src="info.icon" :alt="className" width="96" height="96" class="wow-slot h-24 w-24 !border-gold-border" />
      <div>
        <h1 class="font-display text-3xl font-bold sm:text-4xl" :style="{ color: info.color, textShadow: '0 2px 0 #000' }">{{ page.title }}</h1>
        <p class="mt-2 max-w-3xl text-neutral-300">{{ page.description }}</p>
        <p v-if="page.updated || page.date" class="mt-2 text-[13px] text-neutral-500">
          {{ $t('common.updated') }}: <time :datetime="page.updated || page.date">{{ formatDate(page.updated || page.date) }}</time>
        </p>
      </div>
    </header>

    <!-- Kurzantwort zuerst: hilft Lesern und KI-Antworten -->
    <section v-if="page.summary" class="wow-objective mt-8">
      <h2 class="font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('common.summary') }}</h2>
      <p class="mt-1 text-neutral-100">{{ page.summary }}</p>
    </section>

    <section class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="wow-tooltip">
        <h2 class="mb-3 font-display font-bold text-gold">{{ specsLabel }}</h2>
        <ul class="space-y-2">
          <li v-for="s in info.specs" :key="s.id" class="flex justify-between gap-3 border-b border-white/10 pb-2 last:border-0">
            <span class="font-semibold" :style="{ color: info.color }">{{ s.name[locale] }}<span class="sr-only">:</span></span>
            <span class="text-[14px] text-neutral-400">{{ $t(`common.roles.${s.role}`) }} · {{ $t(`common.range.${s.range}`) }}</span>
          </li>
        </ul>
      </div>
      <div class="wow-tooltip">
        <h2 class="mb-3 font-display font-bold text-gold">{{ $t('common.ourRating') }}</h2>
        <dl class="space-y-3 text-[15px]">
          <div class="flex justify-between gap-3">
            <dt class="text-neutral-300">{{ $t('common.roles_label') }}</dt>
            <dd class="font-semibold text-white">{{ classRoles(info).map(r => $t(`common.roles.${r}`)).join(', ') }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-neutral-300">{{ $t('common.armorType') }}</dt>
            <dd class="font-semibold text-white">{{ $t(`common.armor.${info.armor}`) }}</dd>
          </div>
          <div class="flex justify-between gap-3" :title="$t('common.difficultyHint')">
            <dt class="text-neutral-300">{{ $t('common.difficulty') }}</dt>
            <dd><RatingDots :value="6 - info.difficulty" :color="info.color" /></dd>
          </div>
          <div class="flex justify-between gap-3" :title="$t('common.soloHint')">
            <dt class="text-neutral-300">{{ $t('common.solo') }}</dt>
            <dd><RatingDots :value="info.solo" :color="info.color" /></dd>
          </div>
        </dl>
        <p class="mt-4 text-[13px] text-neutral-500">{{ $t('common.ratingNote') }}</p>
      </div>
    </section>

    <section v-if="races.length" class="wow-tooltip mt-4">
      <h2 class="mb-3 font-display font-bold text-gold">{{ $t('forever.playableRaces') }}</h2>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="r in races"
          :key="r.id"
          class="rounded-[3px] border px-2.5 py-1 text-[14px]"
          :class="r.faction === 'alliance' ? 'border-[#4a8cff]/50 text-[#9cc2ff]' : 'border-[#e83a3a]/50 text-[#ff9c9c]'"
        >
          {{ r.name[locale] }}<span v-if="r.newClasses?.includes(info.id)" class="ml-1 text-quality-uncommon" :title="$t('forever.newCombo')"><span aria-hidden="true">✦</span><span class="sr-only"> ({{ $t('forever.newCombo') }})</span></span>
        </li>
      </ul>
    </section>

    <article class="mt-10">
      <ContentProse>
        <ContentRenderer :value="page" />
      </ContentProse>
    </article>

    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: info.id } })" class="wow-btn wow-btn-lg">
        ⚔ {{ $t('common.fightInPicker') }}
      </NuxtLink>
      <NuxtLink :to="localePath(routeNameFor('quiz', mode))" class="wow-btn wow-btn-stone wow-btn-lg">
        {{ $t('nav.quiz') }}
      </NuxtLink>
    </div>

    <section class="mt-14">
      <h2 class="wow-title text-2xl">{{ $t('common.faqTitle') }}</h2>
      <FaqList :items="faq" class="mt-4" />
    </section>

    <section class="mt-14">
      <h2 class="wow-title mb-4 text-2xl">{{ $t('common.otherClasses') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ClassCard v-for="c in otherClasses" :key="c.id" :class-id="c.id" :mode="mode" />
      </div>
    </section>
  </main>
</template>
