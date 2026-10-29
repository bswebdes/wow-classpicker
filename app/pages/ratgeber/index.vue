<script setup>
definePageMeta({
  i18n: { paths: { de: '/ratgeber', en: '/guides' } }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

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

// Filter nach Spiel, steht in der URL (?spiel=forever), damit man ihn verlinken kann
const games = ['retail', 'forever']
const filter = ref('all')
onMounted(() => {
  if (games.includes(String(route.query.spiel))) filter.value = String(route.query.spiel)
})
watch(filter, (value) => {
  router.replace({ query: value === 'all' ? {} : { spiel: value } })
})
const filterOptions = computed(() => [
  { value: 'all', label: t('guidesPage.filterAll') },
  { value: 'retail', label: 'Midnight', color: '#c9b3ff' },
  { value: 'forever', label: 'Forever', color: '#f0c27a' }
])

const gameOf = g => g.game === 'forever' ? 'forever' : 'retail'
const visible = computed(() => (guides.value || []).filter(g => filter.value === 'all' || gameOf(g) === filter.value))
const slugOf = path => path.split('/').pop()

// Sichtbarer Unterschied der Karten: Farbe, Flagge und Landschaft im Hintergrund (Leerensturm bzw. Mulgore)
const style = {
  retail: { name: 'WoW Midnight', image: '/images/hero/voidstorm-800.webp', flag: 'border-[#7b5cd6]/70 bg-[#2a1d4a]/80 text-[#c9b3ff]', accent: 'before:bg-[#7b5cd6]' },
  forever: { name: 'WoW Forever', image: '/images/hero/mulgore-800.webp', flag: 'border-[#c08a3e]/70 bg-[#3a2610]/80 text-[#f0c27a]', accent: 'before:bg-[#c08a3e]' }
}
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('guidesPage.heading') }}</h1>
    <p class="mt-3 max-w-3xl text-neutral-300">{{ $t('guidesPage.description') }}</p>

    <FilterChips v-model="filter" :label="$t('guidesPage.filterLabel')" :options="filterOptions" class="mt-8" />

    <ul class="mt-6 grid gap-4 md:grid-cols-2">
      <li v-for="(g, i) in visible" :key="g.path" v-reveal="i % 2">
        <NuxtLink
          :to="localePath({ name: 'ratgeber-slug', params: { slug: slugOf(g.path) } })"
          class="wow-tooltip relative flex h-full flex-col overflow-hidden !pl-6 transition-colors before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-[''] hover:border-gold"
          :class="style[gameOf(g)].accent"
        >
          <!-- Landschaft als Deko: nur rechts sichtbar, läuft nach links transparent aus -->
          <img
            :src="style[gameOf(g)].image"
            alt=""
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
            class="pointer-events-none absolute inset-y-0 right-0 h-full w-3/5 object-cover opacity-40 [mask-image:linear-gradient(to_left,black_20%,transparent)]"
          >
          <span class="relative self-start rounded-[3px] border px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-widest" :class="style[gameOf(g)].flag">
            {{ style[gameOf(g)].name }}
          </span>
          <h2 class="relative mt-2 font-display text-lg font-bold text-gold">{{ g.title }}</h2>
          <p class="relative mt-2 text-[15px] text-neutral-300">{{ g.description }}</p>
          <div v-if="g.classes?.length" class="relative mt-auto flex gap-1.5 pt-3">
            <img v-for="id in g.classes.slice(0, 7)" :key="id" :src="getClassInfo(id, gameOf(g))?.icon" alt="" width="26" height="26" class="h-[26px] w-[26px] rounded-[3px] border border-black" />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
