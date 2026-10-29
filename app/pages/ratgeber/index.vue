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
    .select('path', 'title', 'description', 'classes', 'game', 'topic', 'series', 'date', 'updated')
    .all()
)

// Filter nach Spiel und Thema, stehen in der URL (?spiel=forever&thema=voelker), damit man sie verlinken kann.
// Gefiltert wird nur im Browser: Der Server liefert immer alle Ratgeber aus, und das Canonical zeigt ohne
// Parameter auf /ratgeber, damit Google keine Filter-Varianten als Duplikate sieht
const games = ['retail', 'forever']
const topics = ['class', 'roles', 'races', 'knowledge']
const topicParam = { class: 'klassenwahl', roles: 'rollen', races: 'voelker', knowledge: 'wissen' }
const game = ref('all')
const topic = ref('all')
onMounted(() => {
  if (games.includes(String(route.query.spiel))) game.value = String(route.query.spiel)
  const fromUrl = topics.find(id => topicParam[id] === route.query.thema)
  if (fromUrl) topic.value = fromUrl
})
watch([game, topic], ([g, th]) => {
  const query = {}
  if (g !== 'all') query.spiel = g
  if (th !== 'all') query.thema = topicParam[th]
  router.replace({ query })
})
const gameOptions = computed(() => [
  { value: 'all', label: t('guidesPage.filterAll') },
  { value: 'retail', label: 'Midnight', color: '#c9b3ff' },
  { value: 'forever', label: 'Forever', color: '#f0c27a' }
])
const topicOptions = computed(() => [
  { value: 'all', label: t('guidesPage.topicAll') },
  ...topics.map(id => ({ value: id, label: t(`guidesPage.topics.${id}`) }))
])

const gameOf = g => g.game === 'forever' ? 'forever' : 'retail'
const slugOf = path => path.split('/').pop()
const guideLink = g => localePath({ name: 'ratgeber-slug', params: { slug: slugOf(g.path) } })
const matchesGame = g => game.value === 'all' || gameOf(g) === game.value

// Lange Klassennamen nur an der Wortfuge trennen (Todes-ritter statt Todesrit-ter)
const shy = name => name.replace(/^(Todes|Hexen|Dämonen)/, '$1\u00AD')

// Klassen-Raster „Bestes Volk für …“: alle Klassen des Spiels, vorhandene Ratgeber verlinkt, der Rest ausgegraut
const raceGrids = computed(() => games
  .filter(mode => game.value === 'all' || game.value === mode)
  .map(mode => ({
    mode,
    tiles: getClassList(mode).map(c => ({
      id: c.id,
      icon: c.icon,
      color: c.color,
      guide: (guides.value || []).find(g => g.series === 'race' && gameOf(g) === mode && g.classes?.[0] === c.id)
    }))
  }))
)

// Abschnitte je Thema; Serien-Seiten erscheinen nicht als Karte, sondern im Klassen-Raster
const sections = computed(() => topics
  .filter(id => topic.value === 'all' || topic.value === id)
  .map(id => ({
    id,
    cards: (guides.value || []).filter(g => (g.topic || 'knowledge') === id && !g.series && matchesGame(g)),
    grids: id === 'races' ? raceGrids.value : []
  }))
  .filter(s => s.cards.length || s.grids.length)
)

// „Neu“ für Ratgeber der letzten 7 Tage. Erst im Browser berechnet, weil die Seite beim Build
// vorgerendert wird und das Datum dort sonst veraltet
const now = ref(0)
onMounted(() => { now.value = Date.now() })
const isNew = g => now.value > 0 && now.value - new Date(g.updated || g.date).getTime() < 7 * 24 * 3600 * 1000

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

    <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
      <FilterChips v-model="game" :label="$t('guidesPage.filterLabel')" :options="gameOptions" />
      <FilterChips v-model="topic" :label="$t('guidesPage.filterTopic')" :options="topicOptions" />
    </div>

    <p v-if="!sections.length" class="mt-8 text-neutral-400">{{ $t('guidesPage.empty') }}</p>

    <section v-for="s in sections" :key="s.id" class="mt-10">
      <h2 class="font-display text-xl font-bold uppercase tracking-wider text-gold">{{ $t(`guidesPage.topics.${s.id}`) }}</h2>

      <!-- Klassen-Raster der Serie „Bestes Volk für …“ -->
      <div
        v-for="grid in s.grids"
        :key="grid.mode"
        class="wow-tooltip relative mt-4 overflow-hidden !pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-['']"
        :class="style[grid.mode].accent"
      >
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-[3px] border px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-widest" :class="style[grid.mode].flag">{{ style[grid.mode].name }}</span>
          <h3 class="font-display text-lg font-bold text-gold">{{ $t('guidesPage.raceSeries') }}</h3>
        </div>
        <p class="mt-1 text-[14px] text-neutral-400">{{ $t('guidesPage.raceSeriesHint') }}</p>
        <ul class="mt-3 grid grid-cols-[repeat(auto-fill,minmax(62px,1fr))] gap-1.5">
          <li v-for="tile in grid.tiles" :key="tile.id">
            <NuxtLink
              v-if="tile.guide"
              :to="guideLink(tile.guide)"
              class="relative flex h-full flex-col items-center gap-1 rounded-[4px] border border-neutral-700 bg-black/40 px-1 py-2 text-center transition-colors hover:border-gold"
            >
              <span v-if="isNew(tile.guide)" class="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#1eff00] shadow-[0_0_6px_#1eff00]" />
              <img :src="tile.icon" alt="" width="40" height="40" class="h-10 w-10 rounded-[3px] border border-black">
              <!-- Linktext für Google und Screenreader: „Bestes Volk für Jäger“, sichtbar nur der Klassenname -->
              <span class="font-display text-[11px] font-bold leading-tight tracking-tight hyphens-manual" :style="{ color: tile.color }"><span class="sr-only">{{ $t('guidesPage.raceSeriesPrefix') }} </span>{{ shy($t(`classes.${tile.id}.name`)) }}</span>
            </NuxtLink>
            <div v-else class="flex h-full flex-col items-center gap-1 rounded-[4px] border border-neutral-800 px-1 py-2 text-center opacity-40 grayscale">
              <img :src="tile.icon" alt="" width="40" height="40" class="h-10 w-10 rounded-[3px] border border-black">
              <span class="font-display text-[11px] font-bold leading-tight tracking-tight text-neutral-400 hyphens-manual">{{ shy($t(`classes.${tile.id}.name`)) }}</span>
              <span class="text-[10px] uppercase tracking-wider text-neutral-500">{{ $t('guidesPage.comingSoon') }}</span>
            </div>
          </li>
        </ul>
      </div>

      <ul v-if="s.cards.length" class="mt-4 grid gap-4 md:grid-cols-2">
        <li v-for="(g, i) in s.cards" :key="g.path" v-reveal="i % 2">
          <NuxtLink
            :to="guideLink(g)"
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
            <span class="relative flex items-center gap-2">
              <span class="rounded-[3px] border px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-widest" :class="style[gameOf(g)].flag">
                {{ style[gameOf(g)].name }}
              </span>
              <span v-if="isNew(g)" class="rounded-[3px] border border-[#1eff00]/60 bg-[#0d2a08]/80 px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-widest text-[#1eff00]">{{ $t('guidesPage.new') }}</span>
            </span>
            <h3 class="relative mt-2 font-display text-lg font-bold text-gold">{{ g.title }}</h3>
            <p class="relative mt-2 text-[15px] text-neutral-300">{{ g.description }}</p>
            <div v-if="g.classes?.length" class="relative mt-auto flex gap-1.5 pt-3">
              <img v-for="id in g.classes.slice(0, 7)" :key="id" :src="getClassInfo(id, gameOf(g))?.icon" alt="" width="26" height="26" class="h-[26px] w-[26px] rounded-[3px] border border-black" />
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>
