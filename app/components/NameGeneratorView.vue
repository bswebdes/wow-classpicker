<script setup>
// Namensgenerator im Stil der Charaktererstellung: Allianz links, Horde rechts, Geschlecht oben, Stil unten,
// in der Mitte das Volk mit genau einem Namen. Namen kommen aus dem Vorrat auf dem Server (/api/names),
// die KI füllt ihn nachts auf. Retail: nur Vorname (+ Varianten), Forever: Vor- und Nachname.
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, locale } = useI18n()
const forever = props.mode === 'forever'
const k = key => forever ? `names.forever.${key}` : `names.retail.${key}`

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

// Wie im Spiel ist immer ein Volk und ein Geschlecht gewählt
const races = computed(() => getRaces(props.mode))
const race = ref(races.value[0].id)
const gender = ref('f')
const style = ref('any')
// Deutsche Seite: deutsche Nachnamen als Standard, englische zur Wahl; englische Seite nur englisch
const lang = ref(locale.value === 'de' ? 'de' : 'en')
const selectedRace = computed(() => races.value.find(r => r.id === race.value))

const params = () => ({
  game: props.mode,
  race: race.value,
  gender: gender.value,
  style: style.value === 'any' ? undefined : style.value,
  lang: forever ? lang.value : undefined
})

// Warteschlange: angezeigt wird immer nur der erste Name, nachgeladen wird, bevor sie leer ist
const queue = ref([])
const shown = []
const history = ref([])
const loading = ref(false)
const load = async (reset = false) => {
  loading.value = true
  try {
    const exclude = [...shown, ...(reset ? [] : queue.value.map(n => n.id))].slice(-300).join(',')
    const r = await $fetch('/api/names', { query: { ...params(), exclude: exclude || undefined } })
    queue.value = reset ? r.names : [...queue.value, ...r.names.filter(n => !queue.value.some(q => q.id === n.id))]
  }
  catch { if (reset) queue.value = [] }
  finally { loading.value = false }
}
const { data: initial } = await useAsyncData(`names-${props.mode}-${locale.value}`, () => $fetch('/api/names', { query: params() }))
queue.value = initial.value?.names ?? []
// Vorgerenderte Seite: beim Laden frische Namen, damit nicht alle denselben Namen sehen.
// Links von Zufallsgenerator & Co. bringen Volk und Geschlecht mit (?race=orc&gender=m)
const route = useRoute()
onMounted(() => {
  const q = route.query
  const fromLink = typeof q.race === 'string' && races.value.some(r => r.id === q.race)
  if (fromLink) race.value = q.race
  if (q.gender === 'f' || q.gender === 'm') gender.value = q.gender
  if (!fromLink && !q.gender) load(true)
})
watch([race, gender, style, lang], () => load(true))

const current = computed(() => queue.value[0])
const { unlock, increment } = useAchievements()
const next = () => {
  if (current.value) {
    shown.push(current.value.id)
    history.value = [current.value, ...history.value].slice(0, 6)
    queue.value = queue.value.slice(1)
  }
  if (queue.value.length < 3) load()
  showVariants.value = false
  trackEvent('name_generate', { game_mode: props.mode, race: race.value, gender: gender.value, style: style.value, lang: forever ? lang.value : undefined })
  if (increment('nameRolls') >= achievementThresholds.nameRolls) unlock('name_finder')
}
// Würfel oben: zufälliges Volk und Geschlecht
const randomRace = () => {
  race.value = races.value[Math.floor(Math.random() * races.value.length)].id
  gender.value = Math.random() < 0.5 ? 'f' : 'm'
}

const fullName = n => n.last ? `${n.first} ${n.last}` : n.first
const { copied, copy } = useCopyText()
// Kurzer goldener Schimmer auf dem Namensschild beim Kopieren
const flash = ref(false)
const copyName = (n) => {
  if (!n) return
  copy(fullName(n))
  if (n.id === current.value?.id) {
    flash.value = false
    requestAnimationFrame(() => { flash.value = true })
    setTimeout(() => { flash.value = false }, 700)
  }
  $fetch(`/api/names/${n.id}`, { method: 'POST', body: { action: 'copy' } }).catch(() => {})
  trackEvent('name_copy', { game_mode: props.mode, race: race.value, style: style.value })
}
const report = (n) => {
  $fetch(`/api/names/${n.id}`, { method: 'POST', body: { action: 'report' } }).catch(() => {})
  trackEvent('name_report', { game_mode: props.mode })
  next()
}
// Retail: Varianten für Namen, die auf dem Realm schon vergeben sind
const showVariants = ref(false)
const toggleVariants = () => {
  showVariants.value = !showVariants.value
  if (showVariants.value) trackEvent('name_variant', { game_mode: props.mode })
}

// Eigener Vorname: Regel-Check und (Forever) passende Nachnamen
const ownFirst = ref('')
const ownName = computed(() => normalizeName(ownFirst.value))
const ownProblems = computed(() => ownFirst.value.trim() ? nameProblems(ownName.value) : [])
const surnames = ref([])
const surnamesLoading = ref(false)
const findSurnames = async () => {
  if (!ownName.value || ownProblems.value.length) return
  surnamesLoading.value = true
  try {
    const r = await $fetch('/api/names', { query: { ...params(), gender: undefined, first: ownName.value } })
    surnames.value = r.surnames
    trackEvent('name_surname', { race: race.value, style: style.value, lang: lang.value })
  }
  catch { surnames.value = [] }
  finally { surnamesLoading.value = false }
}
const ownVariants = computed(() => !forever && ownName.value && !ownProblems.value.length ? nameVariants(ownName.value) : [])

const styleIcons = { any: 'random', epic: 'arena', dark: 'skull', lore: 'guides', funny: 'mug' }
const factionTint = computed(() => ({ alliance: '#1d3f8f', horde: '#8f1d1d' })[selectedRace.value?.faction] || '#6b5427')
const factionText = computed(() => ({ alliance: '#9cc2ff', horde: '#ff9c9c' })[selectedRace.value?.faction] || '#d8c08a')
</script>

<template>
  <main class="max-w-4xl w-[94%] mx-auto mt-8">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t(k('intro')) }}</p>

    <!-- Charaktererstellung -->
    <section class="charscreen relative mt-6 overflow-hidden rounded-md border-2 border-gold-border bg-black" :aria-label="$t('names.filtersTitle')">
      <!-- Heimat des Volks, beim Wechsel überblendet -->
      <Transition name="scene">
        <picture :key="race" class="absolute inset-0">
          <source :srcset="raceScene(race).wide" media="(min-width: 640px)">
          <img :src="raceScene(race).tall" alt="" width="700" height="1000" class="h-full w-full object-cover" decoding="async">
        </picture>
      </Transition>
      <!-- Nur die Ränder abdunkeln (Lesbarkeit der Porträts und Knöpfe), die Mitte bleibt hell wie im Spiel -->
      <div class="absolute inset-0" :style="{ background: `radial-gradient(ellipse at 50% 38%, transparent 35%, rgba(0,0,0,0.55) 85%), linear-gradient(180deg, ${factionTint}33 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.7) 100%)` }" />

      <div class="relative px-2 pb-3 pt-2 sm:px-4 sm:pt-3">
        <!-- Kopfzeile: Fraktionen, Geschlecht, Zufall -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div class="flex items-center gap-1.5">
            <img src="/images/faction-alliance.webp" alt="" width="20" height="25" class="h-[25px] w-5 rounded-sm object-cover">
            <span class="hidden font-display text-[13px] font-bold uppercase tracking-wider text-[#9cc2ff] sm:inline">{{ $t('forever.factions.alliance') }}</span>
          </div>
          <div class="flex items-center gap-1.5" role="group" :aria-label="$t('names.gender')">
            <button
              v-for="g in ['m', 'f']"
              :key="g"
              type="button"
              class="gender-btn"
              :class="{ 'is-active': gender === g }"
              :aria-pressed="gender === g"
              :aria-label="$t(g === 'f' ? 'names.female' : 'names.male')"
              @click="gender = g"
            >{{ g === 'f' ? '♀' : '♂' }}</button>
            <button type="button" class="gender-btn !text-[15px]" :aria-label="$t('names.randomRace')" :title="$t('names.randomRace')" @click="randomRace">
              <NavIcon name="random" :size="18" />
            </button>
          </div>
          <div class="flex items-center justify-end gap-1.5">
            <span class="hidden font-display text-[13px] font-bold uppercase tracking-wider text-[#ff9c9c] sm:inline">{{ $t('forever.factions.horde') }}</span>
            <img src="/images/faction-horde.webp" alt="" width="20" height="25" class="h-[25px] w-5 rounded-sm object-cover">
          </div>
        </div>

        <!-- Völker links und rechts, Bühne in der Mitte -->
        <div class="mt-2 grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-4">
          <RacePicker v-model="race" :mode="mode" :gender="gender" faction="alliance" />

          <div class="flex min-w-0 flex-col items-center text-center" aria-live="polite">
            <!-- Namensschild -->
            <div class="flex min-h-[64px] flex-col justify-end sm:min-h-[76px]" :class="{ 'name-flash': flash }">
              <Transition name="nameplate" mode="out-in">
                <div v-if="current" :key="current.id" class="flex flex-col">
                  <span class="font-display text-[22px] font-bold leading-tight text-gold [text-shadow:0_2px_4px_#000,0_0_12px_rgba(0,0,0,0.9)] sm:text-[32px]">{{ current.first }}</span>
                  <span v-if="current.last" class="font-display text-[17px] font-bold leading-tight text-neutral-100 [text-shadow:0_2px_4px_#000] sm:text-[24px]">{{ current.last }}</span>
                </div>
                <span v-else class="text-[14px] text-neutral-300">{{ loading ? '…' : $t('names.empty') }}</span>
              </Transition>
            </div>

            <!-- Volk -->
            <div class="relative mt-2 h-[112px] w-[112px] overflow-hidden rounded-full border-[3px] border-gold shadow-[0_0_0_3px_#000,0_0_30px_rgba(255,209,0,0.35)] sm:h-[150px] sm:w-[150px]">
              <Transition name="pop" mode="out-in">
                <img :key="`${race}-${gender}`" :src="racePortrait(race, gender)" :alt="selectedRace?.name[locale]" width="150" height="150" class="h-full w-full object-cover">
              </Transition>
            </div>
            <div class="mt-2 font-display text-[16px] font-bold leading-tight text-neutral-100 [text-shadow:0_1px_3px_#000,0_0_10px_#000]">{{ selectedRace?.name[locale] }}</div>
            <div class="font-bold text-[13px] [text-shadow:0_1px_3px_#000,0_0_10px_#000]" :style="{ color: factionText }">{{ $t(`races.factions.${selectedRace?.faction}`).split(' (')[0] }}</div>

            <!-- Kleine Aktionen -->
            <div class="mt-2 flex items-center gap-1">
              <button v-if="!forever && current" type="button" class="icon-btn" :aria-expanded="showVariants" :title="$t('names.variants')" :aria-label="$t('names.variants')" @click="toggleVariants">⇄</button>
              <button v-if="current" type="button" class="icon-btn hover:!text-red-400" :title="$t('names.report')" :aria-label="$t('names.report')" @click="report(current)">⚑</button>
            </div>
            <div v-if="showVariants && current" class="mt-1 flex flex-wrap justify-center gap-1.5">
              <button v-for="v in nameVariants(current.first)" :key="v" type="button" class="rounded border border-neutral-600 bg-black/60 px-2 py-0.5 text-[14px] text-neutral-100 hover:border-gold" @click="copy(v)">
                {{ copied === v ? '✓ ' : '' }}{{ v }}
              </button>
            </div>
          </div>

          <RacePicker v-model="race" :mode="mode" :gender="gender" faction="horde" />
        </div>

        <!-- Stil wie die Klassenleiste -->
        <div class="mt-3 flex justify-center gap-2 sm:gap-4" role="group" :aria-label="$t('names.style')">
          <button
            v-for="s in ['any', ...nameStyles]"
            :key="s"
            type="button"
            class="flex w-[54px] flex-col items-center gap-1 sm:w-[64px]"
            :aria-pressed="style === s"
            @click="style = s"
          >
            <span class="style-btn" :class="{ 'is-active': style === s }"><NavIcon :name="styleIcons[s]" :size="20" /></span>
            <span class="text-[11px] font-bold leading-tight [text-shadow:0_1px_2px_#000] sm:text-[12px]" :class="style === s ? 'text-gold' : 'text-neutral-300'">{{ s === 'any' ? $t('common.any') : $t(`names.styles.${s}`) }}</span>
          </button>
        </div>

        <div v-if="forever && locale === 'de'" class="mt-2 flex items-center justify-center gap-1.5 text-[12px]">
          <span class="text-neutral-300">{{ $t('names.surnameLang') }}:</span>
          <button v-for="l in ['de', 'en']" :key="l" type="button" class="rounded border px-2 py-0.5 font-bold" :class="lang === l ? 'border-gold text-gold' : 'border-neutral-600 text-neutral-300'" :aria-pressed="lang === l" @click="lang = l">{{ l === 'de' ? 'Deutsch' : 'English' }}</button>
        </div>

        <!-- Untere Leiste wie „Zurück“ / „Anpassen“ -->
        <div class="mt-3 flex items-center justify-between gap-2">
          <button type="button" class="wow-btn wow-btn-sm min-w-[120px]" :disabled="!current" @click="copyName(current)">
            {{ current && copied === fullName(current) ? `✓ ${$t('names.copied')}` : $t('names.copyShort') }}
          </button>
          <button type="button" class="wow-btn wow-btn-sm min-w-[120px]" :disabled="loading && !queue.length" @click="next">
            {{ $t('names.more') }} ▸
          </button>
        </div>
      </div>
    </section>

    <p class="mt-3 text-center text-[13px] text-neutral-400">{{ $t(k('hint')) }}</p>

    <!-- Zuletzt gezeigte Namen, damit ein guter nicht verloren geht -->
    <div v-if="history.length" class="mx-auto mt-4 max-w-md">
      <h2 class="font-display text-[13px] font-bold uppercase tracking-wider text-neutral-400">{{ $t('names.history') }}</h2>
      <ul class="mt-2 flex flex-wrap gap-1.5">
        <li v-for="h in history" :key="h.id">
          <button type="button" class="rounded border border-neutral-700 bg-black/40 px-2 py-0.5 text-[14px] text-neutral-200 hover:border-gold-border" :title="$t('names.copy', { name: fullName(h) })" @click="copyName(h)">
            {{ copied === fullName(h) ? '✓ ' : '' }}{{ fullName(h) }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Eigener Name: Regel-Check, in Forever passende Nachnamen, in Retail Varianten -->
    <section class="wow-frame mt-8">
      <h2 class="font-display text-xl font-bold text-gold">{{ $t(k('ownTitle')) }}</h2>
      <p class="mt-1 text-[14px] text-neutral-300">{{ $t(k('ownIntro')) }}</p>
      <form class="mt-3 flex flex-col gap-2 sm:flex-row" @submit.prevent="findSurnames">
        <input
          v-model="ownFirst"
          type="text"
          maxlength="16"
          autocomplete="off"
          spellcheck="false"
          :placeholder="$t('names.ownPlaceholder')"
          :aria-label="$t('names.ownPlaceholder')"
          class="min-w-0 flex-1 rounded-[4px] border border-neutral-700 bg-[#141414] px-3 py-2 font-display text-[16px] text-neutral-100 focus:border-gold focus:outline-none"
        >
        <button v-if="forever" type="submit" class="wow-btn" :disabled="!ownName || ownProblems.length > 0 || surnamesLoading">{{ $t('names.findSurnames') }}</button>
      </form>
      <p v-if="ownFirst.trim()" class="mt-2 text-[14px]" :class="ownProblems.length ? 'text-red-400' : 'text-quality-uncommon'">
        <template v-if="ownProblems.length">✗ {{ ownProblems.map(p => $t(`names.problems.${p}`)).join(' · ') }}</template>
        <template v-else>✓ {{ $t('names.valid', { name: ownName }) }}</template>
      </p>
      <ul v-if="forever && surnames.length" class="mt-3 grid gap-2 sm:grid-cols-2">
        <li v-for="s in surnames" :key="s" class="flex items-center gap-2 rounded-[4px] border border-neutral-800 bg-black/40 px-3 py-2">
          <span class="min-w-0 flex-1 truncate font-display text-[17px] font-bold text-gold">{{ ownName }} {{ s }}</span>
          <button type="button" class="wow-btn wow-btn-sm wow-btn-stone shrink-0" :aria-label="$t('names.copy', { name: `${ownName} ${s}` })" @click="copy(`${ownName} ${s}`)">
            {{ copied === `${ownName} ${s}` ? '✓' : $t('names.copyShort') }}
          </button>
        </li>
      </ul>
      <div v-if="ownVariants.length" class="mt-3">
        <p class="text-[13px] text-neutral-400">{{ $t('names.variantsIntro') }}</p>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <button v-for="v in ownVariants" :key="v" type="button" class="rounded border border-neutral-700 px-2 py-0.5 text-[14px] text-neutral-200 hover:border-gold-border" @click="copy(v)">
            {{ copied === v ? '✓ ' : '' }}{{ v }}
          </button>
        </div>
      </div>
    </section>

    <ContentBlock :name="forever ? 'forever-names' : 'names'" class="mt-12" />
  </main>
</template>

<style scoped>
.gender-btn,
.icon-btn {
  display: inline-flex;
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid #6b5427;
  background: radial-gradient(circle at 50% 35%, #3a2a12, #0d0905);
  color: #d8c08a;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}
.icon-btn { height: 30px; width: 30px; font-size: 15px; }
.gender-btn.is-active {
  border-color: #ffd100;
  color: #ffd100;
  box-shadow: 0 0 0 2px #000, 0 0 14px rgba(255, 209, 0, 0.7);
}
.style-btn {
  display: inline-flex;
  height: 40px;
  width: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid #4a4a4a;
  background: radial-gradient(circle at 50% 35%, #2e2e2e, #0a0a0a);
  color: #bdbdbd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}
@media (min-width: 640px) {
  .style-btn { height: 48px; width: 48px; }
}
.style-btn.is-active {
  border-color: #ffd100;
  color: #ffd100;
  box-shadow: 0 0 0 2px #000, 0 0 14px rgba(255, 209, 0, 0.7);
}
.gender-btn, .icon-btn, .style-btn { transition: border-color 0.15s, color 0.15s, box-shadow 0.15s, transform 0.1s; }
.gender-btn:active, .icon-btn:active, .style-btn:active { transform: scale(0.94); }

/* Namensschild: neuer Name taucht auf wie über einem Charakter */
.nameplate-enter-active { transition: opacity 0.22s ease-out, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.22s ease-out; }
.nameplate-leave-active { transition: opacity 0.12s ease-in, transform 0.12s ease-in; }
.nameplate-enter-from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(3px); }
.nameplate-leave-to { opacity: 0; transform: translateY(-6px); }
.name-flash { animation: name-flash 0.7s ease-out; }
@keyframes name-flash {
  30% { filter: drop-shadow(0 0 10px rgba(255, 209, 0, 0.9)) brightness(1.3); }
}

/* Porträt beim Volks- oder Geschlechtswechsel */
.pop-enter-active { transition: opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.3, 1.4, 0.5, 1); }
.pop-leave-active { transition: opacity 0.1s ease-in; }
.pop-enter-from { opacity: 0; transform: scale(0.85); }
.pop-leave-to { opacity: 0; }

/* Heimat-Hintergrund überblendet */
.scene-enter-active, .scene-leave-active { transition: opacity 0.5s ease; }
.scene-enter-from, .scene-leave-to { opacity: 0; }
</style>
