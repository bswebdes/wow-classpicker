<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const NuxtLink = resolveComponent('NuxtLink')

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
const races = computed(() => racesForClass(info.value.id, props.mode))
const upcomingRaces = computed(() => getRaces(props.mode).filter(r => r.upcomingClasses?.includes(info.value.id)))
const specsLabel = computed(() => props.mode === 'forever' ? t('forever.talentTrees') : t('common.specs'))
const gameName = computed(() => props.mode === 'forever' ? 'WoW Forever' : 'WoW Midnight')

// FAQ aus den Klassendaten (immer korrekt, auf jeder Klassenseite gleich aufgebaut),
// ergänzt um redaktionelle Fragen aus dem Frontmatter der Klassenseite
const faq = computed(() => {
  const c = info.value
  const forever = props.mode === 'forever'
  const list = (items) => new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items)
  const roles = list(classRoles(c).map(r => t(`common.roles.${r}`)))
  const specs = list(c.specs.map(s => `${s.name[locale.value]} (${t(`common.roles.${s.role}`)}, ${t(`common.range.${s.range}`)})`))
  const others = list(getClassList(props.mode).filter(o => o.armor === c.armor && o.id !== c.id).map(o => t(`classes.${o.id}.name`)))
  const armor = t(`common.armor.${c.armor}`)
  // In Classic tragen Jäger/Schamanen bis Stufe 40 Leder, Krieger/Paladine Kette
  const lighter = { plate: 'mail', mail: 'leather' }[c.armor]
  const level = c.difficulty <= 2 ? 'easy' : c.difficulty === 3 ? 'medium' : 'hard'
  const vars = { class: className.value, game: gameName.value }
  const items = [
    {
      q: t('classFaq.rolesQ', vars),
      a: `${t('classFaq.rolesA', { ...vars, count: t(`classFaq.count.${c.specs.length}`), specsLabel: specsLabel.value, specs, roles })} ${t(forever ? 'classFaq.rolesForever' : 'classFaq.rolesRetail')}`
    },
    ...(page.value.faq || []),
    {
      q: t('classFaq.armorQ', vars),
      a: [
        t('classFaq.armorA', { ...vars, armor, armorNote: t(`classFaq.armorNote.${c.armor}`), others }),
        forever && lighter ? t('classFaq.armorForever', { armor, lighter: t(`common.armor.${lighter}`) }) : ''
      ].filter(Boolean).join(' ')
    },
    { q: t('classFaq.beginnerQ', vars), a: t(`classFaq.beginnerA.${level}`, vars) },
    { q: t('classFaq.soloQ', vars), a: t(c.solo >= 4 ? 'classFaq.soloA.good' : c.solo === 3 ? 'classFaq.soloA.medium' : 'classFaq.soloA.weak', vars) }
  ]
  if (races.value.length) {
    items.push({ q: t('classFaq.racesQ', vars), a: t('classFaq.racesA', { ...vars, count: races.value.length, races: list(races.value.map(r => r.name[locale.value])) }) })
  }
  return items
})

// Retail hat eigene Seiten je Spezialisierung
const specPath = s => props.mode === 'retail'
  ? localePath({ name: 'klassen-slug-spec', params: { slug: info.value.slug[locale.value], spec: specSlug(s, locale.value) } })
  : null

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => `${className.value} – ${gameName.value}`,
  ogSubtitle: () => page.value.description,
  classes: [info.value.id],
  mode: props.mode,
  image: `class-${info.value.id}`,
  art: info.value.id,
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

    <header>
      <PageHero :image="`class-${info.id}`" :alt="$t(`art.heroes.${info.id}`)">
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-4">
          <img :src="info.icon" :alt="className" width="96" height="96" class="wow-slot -mt-12 sm:mt-0 h-16 w-16 shrink-0 !border-gold-border sm:h-20 sm:w-20" />
          <h1 class="min-w-0 font-display text-[1.6rem] font-bold leading-tight [overflow-wrap:anywhere] sm:text-4xl" :style="{ color: info.color, textShadow: '0 2px 6px #000, 0 0 2px #000' }">{{ page.title }}</h1>
        </div>
      </PageHero>
      <p class="mt-4 max-w-3xl text-neutral-300">{{ page.description }}</p>
      <p v-if="page.updated || page.date" class="mt-2 text-[13px] text-neutral-500">
        {{ $t('common.updated') }}: <time :datetime="page.updated || page.date">{{ formatDate(page.updated || page.date) }}</time>
      </p>
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
          <li v-for="s in info.specs" :key="s.id" class="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-0">
            <component :is="specPath(s) ? NuxtLink : 'span'" :to="specPath(s) || undefined" class="flex min-w-0 items-center gap-2 font-semibold" :class="specPath(s) && 'underline decoration-dotted underline-offset-4 hover:brightness-125'" :style="{ color: info.color }">
              <img v-if="mode === 'retail'" :src="specIcon(info.id, s.id)" alt="" width="24" height="24" class="h-6 w-6 shrink-0 rounded-[3px] border border-black" />
              <span>{{ s.name[locale] }}</span><span class="sr-only">:</span>
            </component>
            <span class="text-right text-[14px] text-neutral-400">{{ $t(`common.roles.${s.role}`) }} · {{ $t(`common.range.${s.range}`) }}</span>
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
        <p class="mt-4 text-[13px] text-neutral-500">
          {{ $t('common.ratingNote') }}
          <NuxtLink :to="`${localePath('ueber')}#${locale === 'en' ? 'how-we-rate-classes' : 'wie-wir-klassen-bewerten'}`" class="text-neutral-300 underline decoration-dotted underline-offset-2 hover:text-gold">{{ $t('common.ratingMethod') }} ›</NuxtLink>
        </p>
      </div>
    </section>

    <section v-if="races.length" class="wow-tooltip mt-4">
      <h2 class="mb-3 font-display font-bold text-gold">{{ $t('races.playable') }}</h2>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="r in races"
          :key="r.id"
          class="rounded-[3px] border px-2.5 py-1 text-[14px]"
          :class="{ alliance: 'border-[#4a8cff]/50 text-[#9cc2ff]', horde: 'border-[#e83a3a]/50 text-[#ff9c9c]', neutral: 'border-neutral-500/60 text-neutral-200' }[r.faction]"
        >
          {{ r.name[locale] }}<span v-if="r.newClasses?.includes(info.id)" class="ml-1 text-quality-uncommon" :title="$t(`races.newCombo.${mode}`)"><span aria-hidden="true">✦</span><span class="sr-only"> ({{ $t(`races.newCombo.${mode}`) }})</span></span>
        </li>
      </ul>
      <p v-if="upcomingRaces.length" class="mt-3 text-[13px] text-neutral-400">
        <span aria-hidden="true">◇</span> {{ $t('races.upcoming') }}: {{ upcomingRaces.map(r => r.name[locale]).join(', ') }}
      </p>
    </section>

    <article class="mt-10">
      <ContentProse>
        <ContentRenderer :value="page" />
      </ContentProse>
      <p class="mt-2 text-right text-[12px] text-neutral-500">{{ $t('art.credit') }}</p>
    </article>

    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: info.id } })" class="wow-btn wow-btn-lg">
        ⚔ {{ $t('common.fightInPicker') }}
      </NuxtLink>
      <NuxtLink :to="localePath({ name: routeNameFor('klassen-vergleich', mode), query: { klasse: info.id } })" class="wow-btn wow-btn-stone wow-btn-lg">
        {{ $t('compare.compareWith') }}
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
