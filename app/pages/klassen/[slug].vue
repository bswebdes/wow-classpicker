<script setup>
definePageMeta({
  i18n: { paths: { de: '/klassen/[slug]', en: '/classes/[slug]' } }
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const info = computed(() => getClassBySlug(String(route.params.slug), locale.value))
if (!info.value) {
  throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
}

const { data: page } = await useAsyncData(() => `class-${locale.value}-${route.params.slug}`, () =>
  locale.value === 'en'
    ? queryCollection('classes_en').path(`/classes/${route.params.slug}`).first()
    : queryCollection('classes_de').path(`/klassen/${route.params.slug}`).first()
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

usePageSeo({
  title: () => page.value.seo?.title || page.value.title,
  description: () => page.value.seo?.description || page.value.description,
  ogTitle: () => `${className.value} – WoW Midnight`,
  ogSubtitle: () => page.value.description,
  classes: [info.value.id]
})

useSchemaOrg([
  defineArticle({
    headline: page.value.title,
    description: page.value.description
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: t('nav.classes'), item: localePath('klassen') },
      { name: className.value }
    ]
  })
])

const otherClasses = computed(() => classInfo.filter(c => c.id !== info.value.id))
</script>

<template>
  <main class="max-w-5xl w-[90%] mx-auto mt-8">
    <nav class="text-sm text-neutral-500 mb-4">
      <NuxtLink :to="localePath('klassen')" class="hover:text-yellow-400">{{ $t('nav.classes') }}</NuxtLink>
      <span class="mx-2">/</span>
      <span :style="{ color: info.color }">{{ className }}</span>
    </nav>

    <header class="flex flex-col sm:flex-row gap-6 items-start">
      <img :src="info.icon" :alt="className" width="96" height="96" class="w-24 h-24 rounded-xl" :style="{ outline: `3px solid ${info.color}` }" />
      <div>
        <h1 class="text-3xl font-extrabold" :style="{ color: info.color }">{{ page.title }}</h1>
        <p class="mt-2 text-neutral-300 max-w-3xl">{{ page.description }}</p>
      </div>
    </header>

    <section class="mt-8 grid gap-4 md:grid-cols-2">
      <div class="section">
        <h2 class="font-bold text-white mb-3">{{ $t('common.specs') }}</h2>
        <ul class="space-y-2">
          <li v-for="s in info.specs" :key="s.id" class="flex justify-between gap-3 border-b border-neutral-800 pb-2 last:border-0">
            <span class="font-semibold" :style="{ color: info.color }">{{ s.name[locale] }}</span>
            <span class="text-sm text-neutral-400">{{ $t(`common.roles.${s.role}`) }} · {{ $t(`common.range.${s.range}`) }}</span>
          </li>
        </ul>
      </div>
      <div class="section">
        <h2 class="font-bold text-white mb-3">{{ $t('common.ourRating') }}</h2>
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between gap-3">
            <dt class="text-neutral-300">{{ $t('common.roles_label') }}</dt>
            <dd class="text-white font-semibold">{{ classRoles(info).map(r => $t(`common.roles.${r}`)).join(', ') }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt class="text-neutral-300">{{ $t('common.armorType') }}</dt>
            <dd class="text-white font-semibold">{{ $t(`common.armor.${info.armor}`) }}</dd>
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
        <p class="mt-4 text-xs text-neutral-500">{{ $t('common.ratingNote') }}</p>
      </div>
    </section>

    <ContentProse class="mt-10">
      <ContentRenderer :value="page" />
    </ContentProse>

    <div class="mt-10">
      <NuxtLink :to="localePath({ name: 'index', query: { classes: info.id } })" class="arcade-btn group relative overflow-hidden">
        <span class="relative z-10">{{ $t('common.fightInPicker') }}</span>
        <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
      </NuxtLink>
    </div>

    <section class="mt-14">
      <h2 class="text-2xl font-extrabold text-yellow-400 mb-4">{{ $t('common.otherClasses') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ClassCard v-for="c in otherClasses" :key="c.id" :class-id="c.id" />
      </div>
    </section>
  </main>
</template>
