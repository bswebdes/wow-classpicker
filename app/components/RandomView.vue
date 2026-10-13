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

const specMatches = (s) => roleFilter.value === 'any' || s.role === roleFilter.value
const raceMatches = (r) => factionFilter.value === 'any' || r.faction === factionFilter.value

// Alle Kombinationen aus Klasse, Spezialisierung (und in Forever: Volk), die zu den Filtern passen
const pool = computed(() => getClassList(props.mode).flatMap(c =>
  c.specs
    .filter(specMatches)
    .filter(() => armorFilter.value === 'any' || c.armor === armorFilter.value)
    .flatMap(s => {
      if (props.mode !== 'forever') return [{ classId: c.id, spec: s }]
      return racesForClass(c.id).filter(raceMatches).map(r => ({ classId: c.id, spec: s, race: r }))
    })
))

const { unlock, increment } = useAchievements()
const result = ref(null)
const rolling = ref(false)
const history = ref([])
const pick = (list = pool.value) => list[Math.floor(Math.random() * list.length)]
const d100 = () => Math.ceil(Math.random() * 100)

// Walzen-Animation: Ein Band aus Klassen-Icons läuft durch und stoppt unter der Markierung
const SLOT = 72 // Icon 64px + Abstand 8px
const WIN_INDEX = 32
const reel = ref([])
const offset = ref(0)
const animate = ref(false)
const viewport = ref(null)

const reducedMotion = () => import.meta.client && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const finish = (final) => {
  result.value = final
  rolling.value = false
  history.value = [final, ...history.value].slice(0, 5)
  if (increment('rolls') >= achievementThresholds.rolls) unlock('gambler')
  trackEvent('random_roll', { class_id: final.classId, spec: final.spec.id, race: final.race?.id, game_mode: props.mode })
}

const roll = async () => {
  if (rolling.value || !pool.value.length) return
  const final = { ...pick(), roll: d100() }
  if (reducedMotion()) return finish(final)

  rolling.value = true
  result.value = null
  reel.value = Array.from({ length: WIN_INDEX + 5 }, (_, i) => i === WIN_INDEX ? final : pick())
  animate.value = false
  offset.value = 0
  await nextTick()
  // Erst nach dem Zurücksetzen animieren, damit der Browser die Startposition kennt
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const width = viewport.value?.clientWidth || 600
    // kleine Zufallsabweichung, damit es nicht immer exakt mittig stoppt
    const jitter = Math.round((Math.random() - 0.5) * 36)
    animate.value = true
    offset.value = -(WIN_INDEX * SLOT - width / 2 + SLOT / 2 + jitter)
    setTimeout(() => finish(final), 3300)
  }))
}

// Gezielt nachwürfeln: Klasse behalten, nur Spezialisierung bzw. Volk neu
const info = (r) => getClassInfo(r.classId, props.mode)
const otherSpecs = computed(() => result.value ? info(result.value).specs.filter(s => specMatches(s) && s.id !== result.value.spec.id) : [])
const otherRaces = computed(() => result.value?.race ? racesForClass(result.value.classId).filter(r => raceMatches(r) && r.id !== result.value.race.id) : [])
const rerollSpec = () => { if (otherSpecs.value.length) finish({ ...result.value, spec: pick(otherSpecs.value), roll: d100() }) }
const rerollRace = () => { if (otherRaces.value.length) finish({ ...result.value, race: pick(otherRaces.value), roll: d100() }) }

const resultInfo = computed(() => result.value ? info(result.value) : null)
const classLink = (r) => {
  const i = info(r)
  return i ? localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: i.slug[locale.value] } }) : null
}
// DE: „Priester – Disziplin“, EN: „Discipline Priest“
const titleOf = (r) => {
  const cls = t(`classes.${r.classId}.name`)
  const spec = r.spec.name[locale.value]
  const main = locale.value === 'de' ? `${cls} – ${spec}` : `${spec} ${cls}`
  return r.race ? `${r.race.name[locale.value]} · ${main}` : main
}
const factionColor = (f) => f === 'alliance' ? '#6ea8ff' : '#ff5a5a'
// Startbild der Walze: alle Klassen zweimal, ohne Animation
const idleReel = computed(() => [...getClassList(props.mode), ...getClassList(props.mode)])
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t(k('intro')) }}</p>

    <section class="wow-frame mt-8">
      <!-- Filter -->
      <h2 class="sr-only">{{ $t('random.filtersTitle') }}</h2>
      <div class="flex flex-col gap-4">
        <FilterChips
          v-if="mode === 'forever'"
          v-model="factionFilter"
          :label="$t('forever.faction')"
          :options="[
            { value: 'any', label: $t('common.any') },
            { value: 'alliance', label: $t('forever.factions.alliance'), color: '#6ea8ff' },
            { value: 'horde', label: $t('forever.factions.horde'), color: '#ff5a5a' }
          ]"
        />
        <FilterChips
          v-model="roleFilter"
          :label="$t('random.filterRole')"
          :options="[{ value: 'any', label: $t('common.any') }, ...['tank', 'healer', 'dps'].map(r => ({ value: r, label: $t(`common.roles.${r}`) }))]"
        />
        <FilterChips
          v-model="armorFilter"
          :label="$t('random.filterArmor')"
          :options="[{ value: 'any', label: $t('common.any') }, ...['plate', 'mail', 'leather', 'cloth'].map(a => ({ value: a, label: $t(`common.armor.${a}`) }))]"
        />
      </div>

      <div class="wow-divider" />

      <p v-if="!pool.length" class="text-center text-neutral-400">{{ $t('random.noResult') }}</p>

      <template v-else>
        <!-- Walze -->
        <div ref="viewport" class="relative mx-auto h-[92px] overflow-hidden rounded-md border-2 border-gold-border bg-black/70 shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]" aria-hidden="true">
          <div
            class="absolute left-0 top-1/2 flex gap-2"
            :style="{
              transform: `translate(${offset}px, -50%)`,
              transition: animate ? 'transform 3.2s cubic-bezier(0.12, 0.75, 0.15, 1)' : 'none'
            }"
          >
            <template v-if="reel.length">
              <img v-for="(r, i) in reel" :key="i" :src="info(r).icon" alt="" width="64" height="64" class="wow-slot h-16 w-16 shrink-0" :style="{ borderColor: info(r).color }" />
            </template>
            <template v-else>
              <img v-for="(c, i) in idleReel" :key="i" :src="c.icon" alt="" width="64" height="64" class="wow-slot h-16 w-16 shrink-0 opacity-40" />
            </template>
          </div>
          <!-- Markierung in der Mitte -->
          <div class="pointer-events-none absolute inset-y-1 left-1/2 w-[72px] -translate-x-1/2 rounded-md border-2 border-gold shadow-[0_0_16px_rgba(255,209,0,0.6)]" />
          <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
          <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />
        </div>

        <div class="mt-5 flex justify-center">
          <button class="wow-btn wow-btn-lg" :disabled="rolling" @click="roll">
            🎲 {{ rolling ? $t('random.rolling') : (result ? $t('random.rollAgain') : $t('random.need')) }}
          </button>
        </div>

        <!-- Ergebnis als Item-Tooltip -->
        <div aria-live="polite">
          <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95 translate-y-2">
            <div v-if="result && !rolling" :key="titleOf(result) + result.roll" class="mx-auto mt-6 max-w-md">
              <div class="wow-tooltip !p-4 flex gap-4">
                <img
                  :src="resultInfo.icon"
                  :alt="$t(`classes.${resultInfo.id}.name`)"
                  width="64"
                  height="64"
                  class="wow-slot h-16 w-16 shrink-0 !border-2"
                  :style="{ borderColor: resultInfo.color, boxShadow: `0 0 18px ${resultInfo.color}80` }"
                />
                <div class="min-w-0 flex-1 text-[15px] leading-snug">
                  <div class="font-display text-xl font-bold leading-tight [text-shadow:0_1px_0_#000]" :style="{ color: resultInfo.color }">{{ titleOf(result) }}</div>
                  <div class="text-white">{{ $t('random.bound') }}</div>
                  <dl class="mt-1 text-white">
                    <div class="flex justify-between gap-3"><dt>{{ $t('random.statRole') }}</dt><dd>{{ $t(`common.roles.${result.spec.role}`) }}</dd></div>
                    <div class="flex justify-between gap-3"><dt>{{ $t('random.statRange') }}</dt><dd>{{ $t(`common.range.${result.spec.range}`) }}</dd></div>
                    <div class="flex justify-between gap-3"><dt>{{ $t('random.statArmor') }}</dt><dd>{{ $t(`common.armor.${resultInfo.armor}`) }}</dd></div>
                    <template v-if="result.race">
                      <div class="flex justify-between gap-3"><dt>{{ $t('random.statRace') }}</dt><dd>{{ result.race.name[locale] }}</dd></div>
                      <div class="flex justify-between gap-3"><dt>{{ $t('random.statFaction') }}</dt><dd :style="{ color: factionColor(result.race.faction) }">{{ $t(`forever.factions.${result.race.faction}`) }}</dd></div>
                    </template>
                  </dl>
                  <NuxtLink :to="classLink(result)" class="mt-2 block text-quality-uncommon hover:underline" @click="trackEvent('result_class_click', { source: 'random', class_id: result.classId, game_mode: mode })">
                    {{ $t('random.use') }}
                  </NuxtLink>
                  <p class="mt-2 italic text-gold">{{ locale === 'de' ? `„${$t(`classes.${result.classId}.description`)}“` : `"${$t(`classes.${result.classId}.description`)}"` }}</p>
                  <p class="mt-2 text-[13px] text-neutral-400">{{ $t('random.rollLabel', { n: result.roll }) }}</p>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap justify-center gap-2">
                <button v-if="otherSpecs.length" class="wow-btn wow-btn-sm wow-btn-stone" @click="rerollSpec">↻ {{ $t('random.rerollSpec') }}</button>
                <button v-if="otherRaces.length" class="wow-btn wow-btn-sm wow-btn-stone" @click="rerollRace">↻ {{ $t('random.rerollRace') }}</button>
                <NuxtLink :to="classLink(result)" class="wow-btn wow-btn-sm" @click="trackEvent('result_class_click', { source: 'random', class_id: result.classId, game_mode: mode })">
                  {{ $t('result.learnMore', { class: $t(`classAccusative.${result.classId}`) }) }} ›
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </template>

      <!-- Verlauf der letzten Würfe -->
      <div v-if="history.length > 1" class="mx-auto mt-8 max-w-md">
        <h2 class="font-display text-[13px] font-bold uppercase tracking-wider text-neutral-400">{{ $t('random.history') }}</h2>
        <ul class="mt-2 space-y-1">
          <li v-for="(h, i) in history.slice(1)" :key="i" class="flex items-center gap-2 text-[14px]">
            <img :src="info(h).icon" alt="" width="22" height="22" class="wow-slot h-[22px] w-[22px]" />
            <NuxtLink :to="classLink(h)" class="truncate hover:underline" :style="{ color: info(h).color }">{{ titleOf(h) }}</NuxtLink>
            <span class="ml-auto shrink-0 tabular-nums text-neutral-500">{{ h.roll }}</span>
          </li>
        </ul>
      </div>
    </section>

    <ContentBlock :name="mode === 'forever' ? 'forever-random' : 'random'" class="mt-12" />
  </main>
</template>
