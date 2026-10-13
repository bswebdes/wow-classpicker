<script setup>
// Klassenvergleich: Auswahl zweier Klassen, mit Paar in der URL (/klassen/vergleich/magier-vs-hexenmeister)
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const classes = computed(() => getClassList(props.mode))
const game = computed(() => props.mode === 'forever' ? 'WoW Forever' : 'WoW Midnight')
const baseRoute = computed(() => props.mode === 'forever' ? 'forever-klassen-vergleich' : 'klassen-vergleich')
const pairRoute = computed(() => `${baseRoute.value}-pair`)

// Paar aus der URL
const pair = computed(() => route.params.pair ? parsePairSlug(String(route.params.pair), props.mode, locale.value) : null)
if (route.params.pair && !pair.value) {
  // Umgekehrte Reihenfolge auf die eine gültige URL umleiten, sonst 404
  const any = parsePairSlugAnyOrder(String(route.params.pair), props.mode, locale.value)
  if (any) {
    await navigateTo(localePath({ name: props.mode === 'forever' ? 'forever-klassen-vergleich-pair' : 'klassen-vergleich-pair', params: { pair: pairSlug(any[0].id, any[1].id, props.mode, locale.value) } }), { redirectCode: 301, replace: true })
  }
  else {
    throw createError({ statusCode: 404, statusMessage: t('common.notFound'), fatal: true })
  }
}
const a = computed(() => pair.value?.[0])
const b = computed(() => pair.value?.[1])

if (pair.value) {
  const setI18nParams = useSetI18nParams()
  setI18nParams({
    de: { pair: pairSlug(a.value.id, b.value.id, props.mode, 'de') },
    en: { pair: pairSlug(a.value.id, b.value.id, props.mode, 'en') }
  })
}

// Auswahl als geteilter Zustand, damit sie beim Wechsel zwischen Paar-Seiten erhalten bleibt.
// Die URL hat eine feste Reihenfolge; die Auswahl behält deine Reihenfolge und folgt nur, wenn sich das Paar wirklich ändert.
const selA = useState(`compare-a-${props.mode}`, () => '')
const selB = useState(`compare-b-${props.mode}`, () => '')
const syncSelection = (p) => {
  if (!p) return
  const same = [selA.value, selB.value].sort().join() === [p[0].id, p[1].id].sort().join()
  if (!same) {
    selA.value = p[0].id
    selB.value = p[1].id
  }
}
syncSelection(pair.value)
watch(pair, syncSelection)
onMounted(() => {
  if (!pair.value) {
    // Übersicht: frisch starten, optional mit vorgewählter Klasse von der Klassenseite
    selA.value = classes.value.some(c => c.id === route.query.klasse) ? String(route.query.klasse) : ''
    selB.value = ''
  }
})
const { unlock } = useAchievements()
const pick = (side, id) => {
  if (side === 'a') selA.value = selA.value === id ? '' : id
  else selB.value = selB.value === id ? '' : id
  // Geheimer Erfolg: eine Klasse mit sich selbst vergleichen
  if (selA.value && selA.value === selB.value) unlock('mirror_match')
  if (selA.value && selB.value && selA.value !== selB.value) {
    router.push(localePath({ name: pairRoute.value, params: { pair: pairSlug(selA.value, selB.value, props.mode, locale.value) } }))
  }
}

const name = id => t(`classes.${id}.name`)
const classLink = c => localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: c.slug[locale.value] } })
const pairLink = (x, y) => localePath({ name: pairRoute.value, params: { pair: pairSlug(x, y, props.mode, locale.value) } })
const lower = text => locale.value === 'en' ? text.toLowerCase() : text
const list = items => new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items)

// Kurzantworten der beiden Klassenseiten
const { data: summaries } = await useAsyncData(() => `compare-${props.mode}-${locale.value}-${route.params.pair || 'index'}`, async () => {
  if (!pair.value) return []
  const forever = props.mode === 'forever'
  const collection = locale.value === 'en' ? (forever ? 'forever_classes_en' : 'classes_en') : (forever ? 'forever_classes_de' : 'classes_de')
  const prefix = locale.value === 'en' ? `${forever ? '/forever' : ''}/classes/` : `${forever ? '/forever' : ''}/klassen/`
  return Promise.all([a.value, b.value].map(c => queryCollection(collection).path(`${prefix}${c.slug[locale.value]}`).select('summary').first()))
})

const howKey = c => ranges(c).length > 1 ? 'both' : ranges(c)[0]

// Unterschiede als Sätze
const sentences = computed(() => {
  if (!pair.value) return []
  const f = compareFacts(a.value, b.value, props.mode)
  const out = []
  if (f.sameRoles) out.push(t('compare.sameRoles', { roles: list(classRoles(a.value).map(r => t(`compare.roleVerb.${r}`))) }))
  for (const o of f.onlyRoles) out.push(t('compare.onlyRole', { class: name(o.classId), roles: list(o.roles.map(r => t(`compare.roleVerb.${r}`))) }))
  if (howKey(a.value) === howKey(b.value)) out.push(t('compare.rangeSame', { how: t(`compare.how.${howKey(a.value)}`) }))
  else for (const c of [a.value, b.value]) out.push(t('compare.rangeOne', { class: name(c.id), how: t(`compare.how.${howKey(c)}`) }))
  out.push(f.sameArmor
    ? t('compare.armorSame', { armor: lower(t(`common.armor.${a.value.armor}`)) })
    : t('compare.armorDiff', { a: name(a.value.id), b: name(b.value.id), armorA: lower(t(`common.armor.${a.value.armor}`)), armorB: lower(t(`common.armor.${b.value.armor}`)) }))
  out.push(f.easier ? t('compare.easier', { class: name(f.easier) }) : t('compare.sameDifficulty'))
  out.push(f.betterSolo ? t('compare.betterSolo', { class: name(f.betterSolo) }) : t('compare.sameSolo'))
  if (f.racesA === f.racesB) out.push(t('compare.racesSame', { n: f.racesA }))
  else {
    const [more, n, m] = f.racesA > f.racesB ? [a.value.id, f.racesA, f.racesB] : [b.value.id, f.racesB, f.racesA]
    out.push(t('compare.racesDiff', { classAcc: t(`classAccusative.${more}`), n, m }))
  }
  return out
})

const rows = computed(() => pair.value
  ? [
      { key: 'roles', values: [a.value, b.value].map(c => classRoles(c).map(r => t(`common.roles.${r}`)).join(', ')) },
      { key: 'armor', values: [a.value, b.value].map(c => t(`common.armor.${c.armor}`)) },
      { key: 'range', values: [a.value, b.value].map(c => t(`compare.rangeShort.${howKey(c)}`)) },
      { key: 'races', values: [a.value, b.value].map(c => String(racesForClass(c.id, props.mode).length)) }
    ]
  : [])

const faq = computed(() => pair.value
  ? [
      { q: t('compare.faqBetterQ', { a: name(a.value.id), b: name(b.value.id) }), a: t('compare.faqBetterA', { facts: sentences.value.slice(-3, -1).join(' ') }) },
      { q: t('compare.faqDiffQ', { a: name(a.value.id), b: name(b.value.id) }), a: sentences.value.slice(0, -3).join(' ') }
    ]
  : [])

// SEO: Startseite indexierbar, Paare nur mit Suchvolumen
if (pair.value) {
  usePageSeo({
    title: () => t('compare.pairTitle', { a: name(a.value.id), b: name(b.value.id), game: game.value }),
    description: () => t('compare.pairDescription', { a: name(a.value.id), b: name(b.value.id) }),
    ogTitle: () => t('compare.pairHeading', { a: name(a.value.id), b: name(b.value.id) }),
    ogSubtitle: () => t('compare.pairDescription', { a: name(a.value.id), b: name(b.value.id) }),
    classes: [a.value.id, b.value.id],
    mode: props.mode,
    image: `class-${a.value.id}`,
    faq: faq.value
  })
  if (!isIndexedPair(a.value.id, b.value.id, props.mode)) useSeoMeta({ robots: 'noindex, follow' })
}
else {
  usePageSeo({
    title: () => t(props.mode === 'forever' ? 'compare.titleForever' : 'compare.title'),
    description: () => t('compare.description'),
    ogTitle: () => t('compare.heading'),
    mode: props.mode,
    pageType: 'WebPage'
  })
}

const popular = computed(() => indexedPairs[props.mode])
const everyPair = computed(() => allPairs(props.mode))
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <nav v-if="pair" class="mb-4 text-[14px] text-neutral-400" aria-label="Breadcrumb">
      <NuxtLink :to="localePath(baseRoute)" class="hover:text-gold">{{ $t('compare.heading') }}</NuxtLink>
      <span class="mx-2">›</span>
      <span>{{ $t('compare.pairHeading', { a: name(a.id), b: name(b.id) }) }}</span>
    </nav>

    <!-- Kopf: beide Klassen nebeneinander -->
    <header v-if="pair" class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
      <NuxtLink v-for="(c, i) in [a, b]" :key="c.id" :to="classLink(c)" class="group flex flex-col items-center text-center" :class="i === 1 ? 'col-start-3 row-start-1' : ''">
        <img :src="`/images/classes/${c.id}.webp`" :alt="`${name(c.id)}: ${$t(`art.classes.${c.id}`)}`" width="384" height="384" class="aspect-square w-full max-w-[220px] rounded-md border-2 object-cover shadow-[0_6px_18px_rgba(0,0,0,0.5)] transition-transform group-hover:-translate-y-0.5" :style="{ borderColor: c.color }" />
      </NuxtLink>
      <span class="col-start-2 row-start-1 font-display text-3xl font-black text-gold sm:text-5xl [text-shadow:0_2px_6px_#000]" aria-hidden="true">vs</span>
    </header>
    <h1 class="wow-title text-3xl sm:text-4xl" :class="pair ? 'mt-6 text-center' : ''">
      <template v-if="pair"><span :style="{ color: a.color }">{{ name(a.id) }}</span> <span class="text-neutral-400">vs.</span> <span :style="{ color: b.color }">{{ name(b.id) }}</span></template>
      <template v-else>{{ $t('compare.heading') }}</template>
    </h1>
    <p v-if="!pair" class="mt-3 max-w-3xl text-neutral-300">{{ $t('compare.intro') }}</p>

    <!-- Auswahl: zwei Spalten mit „vs“ dazwischen, Icons im Slot-Stil der Arena -->
    <section class="wow-frame mt-8 grid items-start gap-6 md:grid-cols-[1fr_auto_1fr]">
      <fieldset v-for="(side, i) in ['a', 'b']" :key="side" class="min-w-0" :class="i === 1 ? 'md:col-start-3 md:row-start-1' : ''">
        <legend class="sr-only">{{ side === 'a' ? $t('compare.pickA') : $t('compare.pickB') }}</legend>
        <p class="text-center font-display text-[13px] font-bold uppercase tracking-widest text-neutral-400" aria-hidden="true">{{ side === 'a' ? $t('compare.pickA') : $t('compare.pickB') }}</p>
        <p class="mt-1 h-8 text-center font-display text-xl font-bold" :style="{ color: getClassInfo(side === 'a' ? selA : selB, mode)?.color || '#6b6b6b' }" aria-live="polite">
          {{ (side === 'a' ? selA : selB) ? name(side === 'a' ? selA : selB) : '–' }}
        </p>
        <div class="mt-3 flex flex-wrap justify-center gap-2">
          <button
            v-for="c in classes"
            :key="c.id"
            type="button"
            class="wow-slot h-12 w-12 transition-all duration-150"
            :class="(side === 'a' ? selA : selB) === c.id ? 'scale-110' : 'grayscale-[85%] opacity-70 hover:grayscale-0 hover:opacity-100'"
            :style="(side === 'a' ? selA : selB) === c.id ? { borderColor: c.color, boxShadow: `0 0 12px ${c.color}99` } : {}"
            :aria-pressed="(side === 'a' ? selA : selB) === c.id"
            :aria-label="name(c.id)"
            :title="name(c.id)"
            @click="pick(side, c.id)"
          >
            <img :src="c.icon" alt="" width="48" height="48" class="h-full w-full object-cover" />
          </button>
        </div>
      </fieldset>
      <span class="hidden self-center font-display text-3xl font-black text-gold md:col-start-2 md:row-start-1 md:block [text-shadow:0_2px_6px_#000]" aria-hidden="true">vs</span>
      <p v-if="!pair" class="text-center text-[14px] text-neutral-400 md:col-span-3">{{ $t('compare.choose') }}</p>
    </section>

    <template v-if="pair">
      <!-- Unterschiede -->
      <section class="wow-objective mt-8">
        <h2 class="font-display text-[15px] font-bold uppercase tracking-wider text-gold">{{ $t('compare.differences') }}</h2>
        <ul class="mt-2 space-y-1.5 text-neutral-100">
          <li v-for="s in sentences" :key="s" class="flex gap-2"><span class="text-gold" aria-hidden="true">◆</span><span>{{ s }}</span></li>
        </ul>
      </section>

      <!-- Tabelle -->
      <section class="mt-8">
        <h2 class="wow-title text-2xl">{{ $t('compare.overview') }}</h2>
        <div class="wow-frame wow-scroll mt-4 overflow-x-auto !p-0" tabindex="0" role="region" :aria-label="$t('compare.overview')">
          <table class="w-full text-left text-[15px]">
            <thead class="border-b border-gold-border/60">
              <tr>
                <th class="p-3"><span class="sr-only">{{ $t('compare.overview') }}</span></th>
                <th v-for="c in [a, b]" :key="c.id" class="p-3 font-display text-[16px]" :style="{ color: c.color }">{{ name(c.id) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.key" class="border-t border-white/5">
                <th class="p-3 font-semibold text-neutral-300">{{ $t(`compare.row.${r.key}`) }}</th>
                <td v-for="(v, i) in r.values" :key="i" class="p-3 text-white">{{ v }}</td>
              </tr>
              <tr class="border-t border-white/5">
                <th class="p-3 font-semibold text-neutral-300">{{ mode === 'forever' ? $t('forever.talentTrees') : $t('common.specs') }}</th>
                <td v-for="c in [a, b]" :key="c.id" class="p-3 text-white">
                  <span v-for="(s, i) in c.specs" :key="s.id">{{ s.name[locale] }}<span class="text-neutral-400"> ({{ $t(`common.roles.${s.role}`) }})</span><span v-if="i < c.specs.length - 1">, </span></span>
                </td>
              </tr>
              <tr class="border-t border-white/5">
                <th class="p-3 font-semibold text-neutral-300">{{ $t('compare.row.difficulty') }}</th>
                <td v-for="c in [a, b]" :key="c.id" class="p-3"><RatingDots :value="6 - c.difficulty" :color="c.color" /></td>
              </tr>
              <tr class="border-t border-white/5">
                <th class="p-3 font-semibold text-neutral-300">{{ $t('compare.row.solo') }}</th>
                <td v-for="c in [a, b]" :key="c.id" class="p-3"><RatingDots :value="c.solo" :color="c.color" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-[13px] text-neutral-500">
          {{ $t('common.ratingNote') }}
          <NuxtLink :to="`${localePath('ueber')}#${locale === 'en' ? 'how-we-rate-classes' : 'wie-wir-klassen-bewerten'}`" class="text-neutral-300 underline decoration-dotted underline-offset-2 hover:text-gold">{{ $t('common.ratingMethod') }} ›</NuxtLink>
        </p>
      </section>

      <!-- Kurzantworten der Klassenseiten -->
      <section v-if="summaries?.length" class="mt-10">
        <h2 class="wow-title text-2xl">{{ $t('compare.summaries') }}</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div v-for="(c, i) in [a, b]" :key="c.id" class="wow-tooltip flex flex-col">
            <h3 class="font-display text-lg font-bold" :style="{ color: c.color }">{{ name(c.id) }}</h3>
            <p class="mt-2 flex-1 text-[15px] text-neutral-300">{{ summaries[i]?.summary }}</p>
            <NuxtLink :to="classLink(c)" class="mt-3 text-[15px] font-semibold text-gold hover:underline">{{ $t('result.learnMore', { class: $t(`classAccusative.${c.id}`) }) }} ›</NuxtLink>
          </div>
        </div>
      </section>

      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <NuxtLink :to="localePath({ name: routeNameFor('index', mode), query: { classes: `${a.id},${b.id}` } })" class="wow-btn wow-btn-lg">⚔ {{ $t('compare.fight') }}</NuxtLink>
        <NuxtLink :to="localePath(routeNameFor('quiz', mode))" class="wow-btn wow-btn-stone wow-btn-lg">{{ $t('nav.quiz') }}</NuxtLink>
      </div>

      <section class="mt-12">
        <h2 class="wow-title text-2xl">{{ $t('common.faqTitle') }}</h2>
        <FaqList :items="faq" class="mt-4" />
      </section>
    </template>

    <!-- Beliebte und alle Vergleiche -->
    <section class="mt-12">
      <h2 class="wow-title text-2xl">{{ $t('compare.popular') }}</h2>
      <ul class="mt-4 flex flex-wrap gap-2">
        <li v-for="[x, y] in popular" :key="`${x}-${y}`">
          <NuxtLink :to="pairLink(x, y)" class="wow-tooltip block !px-3 !py-2 font-display font-bold hover:border-gold">
            <span :style="{ color: getClassInfo(x, mode).color }">{{ name(x) }}</span> <span class="text-neutral-400">vs.</span> <span :style="{ color: getClassInfo(y, mode).color }">{{ name(y) }}</span>
          </NuxtLink>
        </li>
      </ul>
      <details class="mt-6">
        <summary class="cursor-pointer font-display font-bold text-gold">{{ $t('compare.all') }} ({{ everyPair.length }})</summary>
        <ul class="mt-3 grid gap-x-4 gap-y-1 text-[14px] sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="[x, y] in everyPair" :key="`${x}-${y}`">
            <NuxtLink :to="pairLink(x, y)" class="text-neutral-300 hover:text-gold">{{ name(x) }} vs. {{ name(y) }}</NuxtLink>
          </li>
        </ul>
      </details>
    </section>
  </main>
</template>
