<script setup>
definePageMeta({
  i18n: { paths: { de: '/klassen/[slug]/[spec]', en: '/classes/[slug]/[spec]' } }
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const found = computed(() => getSpecBySlug(String(route.params.slug), String(route.params.spec), locale.value))
if (!found.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}
const info = computed(() => found.value.cls)
const spec = computed(() => found.value.spec)

const { data: page } = await useAsyncData(() => `spec-${locale.value}-${route.params.slug}-${route.params.spec}`, () =>
  queryCollection(locale.value === 'en' ? 'specs_en' : 'specs_de')
    .path(`${locale.value === 'en' ? '/classes' : '/klassen'}/${route.params.slug}/${route.params.spec}`)
    .first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

const setI18nParams = useSetI18nParams()
setI18nParams({
  de: { slug: info.value.slug.de, spec: specSlug(spec.value, 'de') },
  en: { slug: info.value.slug.en, spec: specSlug(spec.value, 'en') }
})

const className = computed(() => t(`classes.${info.value.id}.name`))
const classPath = computed(() => localePath({ name: 'klassen-slug', params: { slug: info.value.slug[locale.value] } }))
const specPath = (s) => localePath({ name: 'klassen-slug-spec', params: { slug: info.value.slug[locale.value], spec: specSlug(s, locale.value) } })
const otherSpecs = computed(() => info.value.specs.filter(s => s.id !== spec.value.id))

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => `${page.value.name} – WoW Midnight`,
  ogSubtitle: () => page.value.description,
  classes: [info.value.id],
  image: `class-${info.value.id}`,
  art: info.value.id,
  faq: page.value.faq,
  dateModified: page.value.updated || page.value.date
})

useSchemaOrg([
  defineArticle({
    headline: page.value.title,
    description: page.value.description,
    datePublished: page.value.date,
    dateModified: page.value.updated || page.value.date
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.classes'), item: localePath('klassen') },
      { name: className.value, item: classPath.value },
      { name: spec.value.name[locale.value] }
    ]
  })
])

const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <nav class="mb-4 text-[14px] text-neutral-400" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('klassen')" class="hover:text-gold">{{ $t('nav.classes') }}</NuxtLink>
      <span class="mx-2">›</span>
      <NuxtLink :to="classPath" class="hover:text-gold">{{ className }}</NuxtLink>
      <span class="mx-2">›</span>
      <span :style="{ color: info.color }">{{ spec.name[locale] }}</span>
    </nav>

    <header>
      <PageHero :image="`class-${info.id}`" :alt="$t(`art.heroes.${info.id}`)">
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-4">
          <img :src="specIcon(info.id, spec.id)" :alt="spec.name[locale]" width="56" height="56" class="wow-slot -mt-12 sm:mt-0 h-14 w-14 shrink-0 !border-gold-border sm:h-16 sm:w-16" />
          <h1 class="min-w-0 font-display text-[1.6rem] font-bold leading-tight [overflow-wrap:anywhere] sm:text-4xl" :style="{ color: info.color, textShadow: '0 2px 6px #000, 0 0 2px #000' }">{{ page.title }}</h1>
        </div>
      </PageHero>
      <p class="mt-4 max-w-3xl text-neutral-300">{{ page.description }}</p>
      <p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-neutral-500">
        <span>{{ page.updated ? $t('common.updated') : $t('common.published') }}: <time :datetime="page.updated || page.date">{{ formatDate(page.updated || page.date) }}</time></span>
        <PatchBadge mode="retail" />
      </p>
    </header>

    <!-- Kurzantwort zuerst: hilft Lesern und KI-Antworten -->
    <section class="wow-objective mt-8">
      <h2 class="font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('common.summary') }}</h2>
      <p class="mt-1 text-neutral-100">{{ page.summary }}</p>
    </section>

    <section class="wow-tooltip mt-6">
      <h2 class="mb-3 font-display font-bold text-gold">{{ $t('spec.facts') }}</h2>
      <dl class="grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
        <div class="flex justify-between gap-3 border-b border-white/10 pb-2">
          <dt class="text-neutral-300">{{ $t('common.role') }}</dt>
          <dd class="text-right font-semibold text-white">{{ $t(`common.roles.${spec.role}`) }}</dd>
        </div>
        <div class="flex justify-between gap-3 border-b border-white/10 pb-2">
          <dt class="text-neutral-300">{{ $t('spec.range') }}</dt>
          <dd class="text-right font-semibold text-white">{{ $t(`common.range.${spec.range}`) }}</dd>
        </div>
        <div class="flex justify-between gap-3 border-b border-white/10 pb-2">
          <dt class="text-neutral-300">{{ $t('common.armorType') }}</dt>
          <dd class="text-right font-semibold text-white">{{ $t(`common.armor.${info.armor}`) }}</dd>
        </div>
        <div class="flex justify-between gap-3 border-b border-white/10 pb-2">
          <dt class="text-neutral-300">{{ $t('spec.class') }}</dt>
          <dd class="text-right font-semibold">
            <NuxtLink :to="classPath" class="underline decoration-dotted underline-offset-2 hover:text-gold" :style="{ color: info.color }">{{ className }}</NuxtLink>
          </dd>
        </div>
      </dl>
    </section>

    <article class="mt-10">
      <ContentProse>
        <ContentRenderer :value="page" />
      </ContentProse>
      <p class="mt-2 text-right text-[12px] text-neutral-500">{{ $t('art.credit') }}</p>
    </article>

    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLink :to="localePath({ name: 'index', query: { classes: info.id } })" class="wow-btn wow-btn-lg">
        ⚔ {{ $t('common.fightInPicker') }}
      </NuxtLink>
      <NuxtLink :to="localePath('quiz')" class="wow-btn wow-btn-stone wow-btn-lg">
        {{ $t('nav.quiz') }}
      </NuxtLink>
    </div>

    <section v-if="page.faq?.length" class="mt-14">
      <h2 class="wow-title text-2xl">{{ $t('common.faqTitle') }}</h2>
      <FaqList :items="page.faq" class="mt-4" />
    </section>

    <section class="mt-14">
      <h2 class="wow-title mb-4 text-2xl">{{ $t('spec.otherSpecs', { class: className }) }}</h2>
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="s in otherSpecs" :key="s.id">
          <NuxtLink :to="specPath(s)" class="wow-tooltip flex items-center gap-3 !p-3 transition-[filter] hover:brightness-125">
            <img :src="specIcon(info.id, s.id)" :alt="''" width="40" height="40" class="wow-slot h-10 w-10 shrink-0" />
            <span class="min-w-0">
              <span class="block font-display font-bold" :style="{ color: info.color }">{{ s.name[locale] }}</span>
              <span class="block text-[13px] text-neutral-400">{{ $t(`common.roles.${s.role}`) }} · {{ $t(`common.range.${s.range}`) }}</span>
            </span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="classPath" class="wow-tooltip flex items-center gap-3 !p-3 transition-[filter] hover:brightness-125">
            <img :src="info.icon" :alt="''" width="40" height="40" class="wow-slot h-10 w-10 shrink-0" />
            <span class="min-w-0">
              <span class="block font-display font-bold" :style="{ color: info.color }">{{ $t('spec.toClass', { class: className }) }}</span>
              <span class="block text-[13px] text-neutral-400">{{ $t('spec.toClassHint') }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>
