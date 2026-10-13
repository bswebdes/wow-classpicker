<script setup>
definePageMeta({
  i18n: { paths: { de: '/ratgeber/[slug]', en: '/guides/[slug]' } }
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const collectionFor = (code) => code === 'en' ? 'guides_en' : 'guides_de'
const basePath = (code) => code === 'en' ? '/guides' : '/ratgeber'

const { data: page } = await useAsyncData(() => `guide-${locale.value}-${route.params.slug}`, () =>
  queryCollection(collectionFor(locale.value)).path(`${basePath(locale.value)}/${route.params.slug}`).first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

// Gegenstück in der anderen Sprache über den gemeinsamen key finden
const otherLocale = computed(() => locale.value === 'en' ? 'de' : 'en')
const { data: alternate } = await useAsyncData(() => `guide-alt-${locale.value}-${route.params.slug}`, () =>
  queryCollection(collectionFor(otherLocale.value)).where('key', '=', page.value.key).select('path').first()
)

const setI18nParams = useSetI18nParams()
setI18nParams({
  [locale.value]: { slug: String(route.params.slug) },
  ...(alternate.value ? { [otherLocale.value]: { slug: alternate.value.path.split('/').pop() } } : {})
})

const mode = computed(() => page.value.game === 'forever' ? 'forever' : 'retail')

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => page.value.title,
  ogSubtitle: () => page.value.description,
  classes: page.value.classes,
  mode: mode.value,
  image: page.value.image,
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
      { name: t('nav.guides'), item: localePath('ratgeber') },
      { name: page.value.title }
    ]
  })
])

// Bildnachweis nur, wenn der Ratgeber offizielle Blizzard-Bilder zeigt
const hasBlizzardImages = computed(() => !!page.value?.image || /class-art|race-gallery/.test(JSON.stringify(page.value?.body || '')))
const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <nav class="mb-4 text-[14px] text-neutral-400" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('ratgeber')" class="hover:text-gold">{{ $t('nav.guides') }}</NuxtLink>
      <span class="mx-2">›</span>
      <span>{{ mode === 'forever' ? 'WoW Forever' : 'WoW Midnight' }}</span>
    </nav>

    <article>
      <header>
        <PageHero v-if="page.image" :image="page.image" :alt="page.imageAlt || page.title">
          <h1 class="wow-title text-3xl [filter:drop-shadow(0_2px_3px_#000)] sm:text-4xl">{{ page.title }}</h1>
        </PageHero>
        <h1 v-else class="wow-title text-3xl sm:text-4xl">{{ page.title }}</h1>
        <p class="mt-2 text-[14px] text-neutral-500">
          {{ page.updated ? $t('common.updated') : $t('common.published') }}:
          <time :datetime="page.updated || page.date">{{ formatDate(page.updated || page.date) }}</time>
        </p>
      </header>

      <!-- Kurzantwort zuerst: hilft Lesern und KI-Antworten -->
      <section v-if="page.summary" class="wow-objective mt-6">
        <h2 class="font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('common.summary') }}</h2>
        <p class="mt-1 text-neutral-100">{{ page.summary }}</p>
      </section>

      <ContentProse class="mt-6">
        <ContentRenderer :value="page" />
      </ContentProse>
      <p v-if="hasBlizzardImages" class="mt-2 text-right text-[12px] text-neutral-500">{{ $t('art.credit') }}</p>
    </article>

    <section v-if="page.faq?.length" class="mt-12">
      <h2 class="wow-title text-2xl">{{ $t('common.faqTitle') }}</h2>
      <FaqList :items="page.faq" class="mt-4" />
    </section>

    <section v-if="page.classes?.length" class="mt-12">
      <h2 class="wow-title mb-4 text-2xl">{{ $t('common.relatedClasses') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <ClassCard v-for="id in page.classes" :key="id" :class-id="id" :mode="mode" />
      </div>
      <div class="mt-8">
        <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: page.classes.join(',') } })" class="wow-btn wow-btn-lg">
          ⚔ {{ $t('common.fightInPicker') }}
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
