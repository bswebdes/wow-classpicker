<script setup>
definePageMeta({
  i18n: { paths: { de: '/ratgeber', en: '/guides' } }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: () => t('guidesPage.title'),
  description: () => t('guidesPage.description'),
  ogTitle: () => t('guidesPage.heading')
})

const { data: guides } = await useAsyncData(() => `guides-${locale.value}`, () =>
  (locale.value === 'en' ? queryCollection('guides_en') : queryCollection('guides_de'))
    .order('order', 'ASC')
    .select('path', 'title', 'description', 'classes', 'stem')
    .all()
)

const slugOf = (path) => path.split('/').pop()
</script>

<template>
  <main class="max-w-5xl w-[90%] mx-auto mt-8">
    <h1 class="text-3xl font-extrabold text-yellow-400">{{ $t('guidesPage.heading') }}</h1>
    <p class="mt-3 text-neutral-300 max-w-3xl">{{ $t('guidesPage.description') }}</p>

    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <NuxtLink
        v-for="g in guides"
        :key="g.path"
        :to="localePath({ name: 'ratgeber-slug', params: { slug: slugOf(g.path) } })"
        class="section block hover:border-yellow-500/60 transition-colors"
      >
        <h2 class="font-bold text-lg text-white">{{ g.title }}</h2>
        <p class="mt-2 text-sm text-neutral-400">{{ g.description }}</p>
        <div v-if="g.classes?.length" class="mt-3 flex gap-1.5">
          <img
            v-for="id in g.classes.slice(0, 6)"
            :key="id"
            :src="getClassInfo(id)?.icon"
            alt=""
            width="24"
            height="24"
            class="w-6 h-6 rounded-sm"
          />
        </div>
        <span class="mt-3 inline-block text-sm font-semibold text-yellow-400">{{ $t('common.readMore') }} →</span>
      </NuxtLink>
    </div>
  </main>
</template>
