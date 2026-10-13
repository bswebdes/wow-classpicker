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

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => page.value.title,
  ogSubtitle: () => page.value.description,
  classes: page.value.classes
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

const formatDate = (date) => new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <main class="max-w-3xl w-[90%] mx-auto mt-8">
    <nav class="text-sm text-neutral-500 mb-4">
      <NuxtLink :to="localePath('ratgeber')" class="hover:text-yellow-400">{{ $t('nav.guides') }}</NuxtLink>
    </nav>

    <h1 class="text-3xl font-extrabold text-yellow-400">{{ page.title }}</h1>
    <p class="mt-2 text-sm text-neutral-500">
      {{ page.updated ? $t('common.updated') : $t('common.published') }}: {{ formatDate(page.updated || page.date) }}
    </p>

    <ContentProse class="mt-8">
      <ContentRenderer :value="page" />
    </ContentProse>

    <section v-if="page.classes?.length" class="mt-12">
      <h2 class="text-2xl font-extrabold text-yellow-400 mb-4">{{ $t('common.relatedClasses') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <ClassCard v-for="id in page.classes" :key="id" :class-id="id" />
      </div>
      <div class="mt-8">
        <NuxtLink :to="localePath({ name: 'index', query: { classes: page.classes.join(',') } })" class="arcade-btn group relative overflow-hidden">
          <span class="relative z-10">{{ $t('common.fightInPicker') }}</span>
          <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
