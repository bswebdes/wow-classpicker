<script setup>
definePageMeta({
  i18n: { paths: { de: '/ratgeber', en: '/guides' } }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: () => t('guidesPage.title'),
  description: () => t('guidesPage.description'),
  ogTitle: () => t('guidesPage.heading'),
  pageType: 'CollectionPage'
})

const { data: guides } = await useAsyncData(() => `guides-${locale.value}`, () =>
  (locale.value === 'en' ? queryCollection('guides_en') : queryCollection('guides_de'))
    .order('order', 'ASC')
    .select('path', 'title', 'description', 'classes', 'game')
    .all()
)

const slugOf = (path) => path.split('/').pop()
const groups = computed(() => [
  { game: 'retail', title: 'World of Warcraft: Midnight', items: (guides.value || []).filter(g => g.game !== 'forever') },
  { game: 'forever', title: 'WoW Forever', items: (guides.value || []).filter(g => g.game === 'forever') }
].filter(g => g.items.length))
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('guidesPage.heading') }}</h1>
    <p class="mt-3 max-w-3xl text-neutral-300">{{ $t('guidesPage.description') }}</p>

    <section v-for="group in groups" :key="group.game" class="mt-10">
      <h2 class="wow-title text-2xl">{{ group.title }}</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="g in group.items"
          :key="g.path"
          :to="localePath({ name: 'ratgeber-slug', params: { slug: slugOf(g.path) } })"
          class="wow-tooltip block transition-colors hover:border-gold"
        >
          <h3 class="font-display text-lg font-bold text-gold">{{ g.title }}</h3>
          <p class="mt-2 text-[15px] text-neutral-300">{{ g.description }}</p>
          <div v-if="g.classes?.length" class="mt-3 flex gap-1.5">
            <img v-for="id in g.classes.slice(0, 7)" :key="id" :src="getClassInfo(id)?.icon" alt="" width="26" height="26" class="h-[26px] w-[26px] rounded-[3px] border border-black" />
          </div>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
