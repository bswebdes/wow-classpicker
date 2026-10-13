<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const k = (key) => props.mode === 'forever' ? `forever.random.${key}` : `random.${key}`

usePageSeo({
  title: () => t(k('title')),
  description: () => t(k('description')),
  ogTitle: () => t(k('heading')),
  mode: props.mode
})

useSchemaOrg([
  defineSoftwareApp({
    name: t(k('heading')),
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    offers: { price: 0, priceCurrency: 'EUR' }
  })
])

const roleFilter = ref('any')
const armorFilter = ref('any')
const factionFilter = ref('any')

// Alle Kombinationen aus Klasse, Spezialisierung (und in Forever: Volk), die zu den Filtern passen
const pool = computed(() => getClassList(props.mode).flatMap(c =>
  c.specs
    .filter(s => roleFilter.value === 'any' || s.role === roleFilter.value)
    .filter(() => armorFilter.value === 'any' || c.armor === armorFilter.value)
    .flatMap(s => {
      if (props.mode !== 'forever') return [{ classId: c.id, spec: s }]
      return racesForClass(c.id)
        .filter(r => factionFilter.value === 'any' || r.faction === factionFilter.value)
        .map(r => ({ classId: c.id, spec: s, race: r }))
    })
))

const { unlock, increment } = useAchievements()
const result = ref(null)
const rolling = ref(false)
const history = ref([])

const pick = () => pool.value[Math.floor(Math.random() * pool.value.length)]

const roll = async () => {
  if (rolling.value || !pool.value.length) return
  rolling.value = true
  // Kurzer Slot-Machine-Effekt
  for (let i = 0; i < 14; i++) {
    result.value = { ...pick(), roll: Math.ceil(Math.random() * 100) }
    await new Promise(r => setTimeout(r, 50 + i * 12))
  }
  result.value = { ...pick(), roll: Math.ceil(Math.random() * 100) }
  rolling.value = false
  history.value = [result.value, ...history.value].slice(0, 5)
  if (increment('rolls') >= achievementThresholds.rolls) unlock('gambler')
  trackEvent('random_roll', { class_id: result.value.classId, spec: result.value.spec.id, race: result.value.race?.id, game_mode: props.mode })
}

const infoOf = (r) => getClassInfo(r.classId, props.mode)
const resultInfo = computed(() => result.value ? infoOf(result.value) : null)
const classLink = (r) => {
  const info = infoOf(r)
  return info ? localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: info.slug[locale.value] } }) : null
}
// DE: „Priester – Disziplin“, EN: „Discipline Priest“
const titleOf = (r) => {
  const cls = t(`classes.${r.classId}.name`)
  const spec = r.spec.name[locale.value]
  const main = locale.value === 'de' ? `${cls} – ${spec}` : `${spec} ${cls}`
  return r.race ? `${r.race.name[locale.value]} · ${main}` : main
}
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t(k('intro')) }}</p>

    <section class="wow-frame mt-8">
      <div class="grid gap-4" :class="mode === 'forever' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
        <label v-if="mode === 'forever'" class="flex flex-col gap-1">
          <span class="font-display text-[14px] font-bold text-gold">{{ $t('forever.faction') }}</span>
          <select v-model="factionFilter" class="rounded-[4px] border border-gold-border/70 bg-black/70 px-3 py-2 text-white">
            <option value="any">{{ $t('common.any') }}</option>
            <option v-for="f in ['alliance', 'horde']" :key="f" :value="f">{{ $t(`forever.factions.${f}`) }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="font-display text-[14px] font-bold text-gold">{{ $t('random.filterRole') }}</span>
          <select v-model="roleFilter" class="rounded-[4px] border border-gold-border/70 bg-black/70 px-3 py-2 text-white">
            <option value="any">{{ $t('common.any') }}</option>
            <option v-for="r in ['tank', 'healer', 'dps']" :key="r" :value="r">{{ $t(`common.roles.${r}`) }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1">
          <span class="font-display text-[14px] font-bold text-gold">{{ $t('random.filterArmor') }}</span>
          <select v-model="armorFilter" class="rounded-[4px] border border-gold-border/70 bg-black/70 px-3 py-2 text-white">
            <option value="any">{{ $t('common.any') }}</option>
            <option v-for="a in ['plate', 'mail', 'leather', 'cloth']" :key="a" :value="a">{{ $t(`common.armor.${a}`) }}</option>
          </select>
        </label>
      </div>

      <!-- Beutefenster -->
      <div class="mx-auto mt-8 max-w-md" aria-live="polite">
        <div class="font-display text-[12px] font-bold uppercase tracking-[0.3em] text-neutral-400">{{ $t('random.lootTitle') }}</div>
        <div class="wow-tooltip mt-2 !p-3">
          <p v-if="!pool.length" class="text-neutral-400">{{ $t('random.noResult') }}</p>
          <p v-else-if="!result" class="py-6 text-center italic text-neutral-500">{{ $t('random.emptyLoot') }}</p>
          <div v-else class="flex items-center gap-4">
            <img
              :src="resultInfo.icon"
              :alt="$t(`classes.${resultInfo.id}.name`)"
              width="72"
              height="72"
              class="h-[72px] w-[72px] shrink-0 rounded-[4px] border-2 border-quality-epic shadow-[0_0_18px_rgba(163,53,238,0.55)] transition-transform"
              :class="{ 'scale-95 opacity-80': rolling }"
            />
            <div class="min-w-0">
              <div class="font-display text-xl font-bold leading-tight text-quality-epic">{{ titleOf(result) }}</div>
              <div v-if="result.race" class="text-[14px]" :class="result.race.faction === 'alliance' ? 'text-[#9cc2ff]' : 'text-[#ff9c9c]'">{{ $t(`forever.factions.${result.race.faction}`) }}</div>
              <div class="text-[14px] text-white">{{ $t(`common.roles.${result.spec.role}`) }} · {{ $t(`common.range.${result.spec.range}`) }}</div>
              <div class="text-[14px] text-neutral-300">{{ $t(`common.armor.${resultInfo.armor}`) }}</div>
              <div class="mt-1 text-[14px] text-gold">{{ $t('random.rollText', { n: result.roll }) }}</div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-center gap-3">
          <button v-if="pool.length" class="wow-btn wow-btn-lg" :disabled="rolling" @click="roll">
            🎲 {{ $t('random.need') }}
          </button>
          <NuxtLink v-if="result && !rolling" :to="classLink(result)" class="wow-btn wow-btn-stone wow-btn-lg">
            {{ $t('random.toClass') }} ›
          </NuxtLink>
        </div>
      </div>

      <!-- Verlauf der letzten Würfe -->
      <div v-if="history.length > 1" class="mx-auto mt-8 max-w-md">
        <h2 class="font-display text-[13px] font-bold uppercase tracking-wider text-neutral-400">{{ $t('random.history') }}</h2>
        <ul class="mt-2 space-y-1">
          <li v-for="(h, i) in history.slice(1)" :key="i" class="flex items-center gap-2 text-[14px]">
            <img :src="infoOf(h).icon" alt="" width="22" height="22" class="h-[22px] w-[22px] rounded-[2px] border border-black" />
            <NuxtLink :to="classLink(h)" class="truncate text-quality-rare hover:underline">{{ titleOf(h) }}</NuxtLink>
            <span class="ml-auto shrink-0 tabular-nums text-neutral-500">{{ h.roll }}</span>
          </li>
        </ul>
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-random' : 'random'" class="mt-12" />
  </main>
</template>
