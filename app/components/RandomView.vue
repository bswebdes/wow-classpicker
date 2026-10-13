<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, locale } = useI18n()
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

const result = ref(null)
const rolling = ref(false)

const pick = () => pool.value[Math.floor(Math.random() * pool.value.length)]

const roll = async () => {
  if (rolling.value || !pool.value.length) return
  rolling.value = true
  // Kurzer Slot-Machine-Effekt
  for (let i = 0; i < 14; i++) {
    result.value = pick()
    await new Promise(r => setTimeout(r, 50 + i * 12))
  }
  result.value = pick()
  rolling.value = false
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track('Random - Roll', { class: result.value.classId, spec: result.value.spec.id, race: result.value.race?.id, mode: props.mode })
  }
}

const resultInfo = computed(() => result.value ? getClassInfo(result.value.classId, props.mode) : null)
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

      <div class="mt-8 flex min-h-[240px] flex-col items-center justify-center gap-5">
        <p v-if="!pool.length" class="text-neutral-400">{{ $t('random.noResult') }}</p>

        <div v-else-if="result" class="flex flex-col items-center gap-2 text-center" aria-live="polite">
          <span class="font-display text-[12px] font-bold uppercase tracking-widest text-neutral-400">{{ $t('random.result') }}</span>
          <img
            :src="resultInfo.icon"
            :alt="$t(`classes.${resultInfo.id}.name`)"
            width="96"
            height="96"
            class="wow-slot h-24 w-24 !border-gold transition-transform"
            :class="{ 'scale-95 opacity-80': rolling }"
          />
          <span class="font-display text-2xl font-bold" :style="{ color: resultInfo.color, textShadow: '0 2px 0 #000' }">
            <template v-if="result.race">{{ result.race.name[locale] }} · </template>{{ result.spec.name[locale] }} {{ $t(`classes.${resultInfo.id}.name`) }}
          </span>
          <span class="text-[15px] text-neutral-400">
            <template v-if="result.race"><span :class="result.race.faction === 'alliance' ? 'text-[#9cc2ff]' : 'text-[#ff9c9c]'">{{ $t(`forever.factions.${result.race.faction}`) }}</span> · </template>{{ $t(`common.roles.${result.spec.role}`) }} · {{ $t(`common.range.${result.spec.range}`) }} · {{ $t(`common.armor.${resultInfo.armor}`) }}
          </span>
        </div>

        <button v-if="pool.length" class="wow-btn wow-btn-lg" :disabled="rolling" @click="roll">
          🎲 {{ result ? $t('random.rollAgain') : $t('random.roll') }}
        </button>

        <ClassCard v-if="result && !rolling" :class-id="result.classId" :mode="mode" class="w-full sm:w-auto" />
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-random' : 'random'" class="mt-12" />
  </main>
</template>
