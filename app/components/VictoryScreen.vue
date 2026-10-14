<script setup>
const props = defineProps({
  winner: Object,
  ranking: { type: Array, default: () => [] },
  rounds: { type: Number, default: 0 },
  mode: { type: String, default: 'retail' }
})

const emit = defineEmits(['close', 'again'])

const { t, locale } = useI18n()
const localePath = useLocalePath()

const podium = computed(() => props.ranking.slice(0, 3))
// Anzeige-Reihenfolge wie auf einem Siegertreppchen: 2 – 1 – 3
const podiumOrder = computed(() => {
  const [first, second, third] = podium.value
  return [second, first, third].filter(Boolean)
})

const classLink = (classId) => {
  const info = getClassInfo(classId, props.mode)
  return info ? localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: info.slug[locale.value] } }) : null
}
const className = (classId) => t(`classes.${classId}.name`)

// Sieger teilen: Link auf die Seite „Mein Main“ mit dem Kämpfernamen
const shareLink = useShareLink()
const shareUrl = ref('')
const shareText = computed(() => props.winner ? t('share.textArena', { class: className(props.winner.classId), game: props.mode === 'forever' ? 'WoW Forever' : 'WoW Midnight' }) : '')

// Auszeichnungen für die besten Werte im Kampf (nur wenn jemand überhaupt etwas erreicht hat)
const awards = computed(() => [
  { key: 'damage', field: 'damageDone' },
  { key: 'healing', field: 'healingDone' },
  { key: 'crits', field: 'crits' },
  { key: 'dodges', field: 'dodges' },
  { key: 'kills', field: 'kills' }
].map(a => {
  const best = [...props.ranking].sort((x, y) => (y[a.field] || 0) - (x[a.field] || 0))[0]
  return best && best[a.field] > 0 ? { ...a, fighter: best, value: best[a.field] } : null
}).filter(Boolean))

// Erfolge, die während des Dialogs fällig werden, zeigt der Dialog selbst (statt eines Toasts über dem Titel)
const { queue } = useAchievements()
const earned = ref([])
const takeAchievements = () => {
  if (!queue.value.length) return
  earned.value = [...earned.value, ...queue.value.map(id => achievementDefs.find(a => a.id === id)).filter(Boolean)]
  queue.value = []
}
watch(queue, takeAchievements, { deep: true })

const medal = { 1: 'text-[#ffd100] border-[#ffd100]', 2: 'text-[#d8d8e0] border-[#b8b8c8]', 3: 'text-[#e0a060] border-[#b87333]' }

// Fokus in den Dialog, Escape schließt ihn
const dialogRef = ref(null)
const modalOpen = useState('modal-open', () => false)
onBeforeUnmount(() => { modalOpen.value = false })
const onKey = (e) => { if (e.key === 'Escape') emit('close') }
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

onMounted(() => {
  modalOpen.value = true
  takeAchievements()
  window.addEventListener('keydown', onKey)
  nextTick(() => dialogRef.value?.focus())
  if (props.winner) {
    shareUrl.value = shareLink(props.winner.classId, props.mode, { from: 'arena', name: props.winner.name })
    trackEvent('battle_victory', { winner: props.winner.classId, game_mode: props.mode, rounds: props.rounds })
  }
})
</script>

<template>
  <div v-if="winner" class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 backdrop-blur-xs sm:p-4" role="dialog" aria-modal="true" :aria-label="$t('victory.champion')">
    <!-- Mobil scrollt der ganze Dialog, die Aktionen bleiben unten fest -->
    <div id="victory-screen" ref="dialogRef" tabindex="-1" class="outline-none wow-frame flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden !border-gold !p-0 animate-[victory-pop_0.4s_ease-out] sm:max-h-[calc(100dvh-2rem)]">
      <button class="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-neutral-400 hover:bg-white/5 hover:text-gold" :aria-label="$t('result.close')" @click="emit('close')">×</button>

      <div class="wow-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-6 sm:px-6">
        <header class="text-center">
          <div class="font-display text-[12px] font-bold uppercase tracking-[0.3em] text-neutral-400">{{ $t('victory.achievement') }}</div>
          <h2 class="wow-title mt-1 text-[2.1rem] uppercase leading-none sm:text-4xl">{{ $t('victory.champion') }}</h2>
          <p class="mt-3 text-neutral-300">
            {{ mode === 'forever' ? $t('victory.playInForever') : $t('victory.playInMidnight') }}
            <strong class="font-display" :class="`text-c-${winner.classId}`">{{ winner.name }}</strong>
            <span v-if="winner.name !== winner.className" class="text-neutral-400"> ({{ className(winner.classId) }})</span>
          </p>
        </header>

        <!-- Neu errungene Erfolge als Plaketten -->
        <ul v-if="earned.length" class="mt-4 flex flex-wrap justify-center gap-2" :aria-label="$t('achievements.earned')">
          <li v-for="a in earned" :key="a.id" class="flex items-center gap-2 rounded-full border border-gold-border bg-gradient-to-b from-[#2a2014] to-[#0d0a06] py-1 pl-1 pr-3 shadow-[0_0_14px_rgba(255,209,0,0.2)]">
            <img :src="a.icon" alt="" width="28" height="28" class="h-7 w-7 rounded-full border border-gold-border" />
            <span class="font-display text-[13px] font-bold text-gold-light">{{ $t(`achievements.list.${a.id}.name`) }}</span>
            <span class="font-display text-[12px] font-black text-gold">+{{ a.points }}</span>
          </li>
        </ul>

        <!-- Siegertreppchen -->
        <ol class="mt-5 flex items-end justify-center gap-3 sm:mt-6 sm:gap-5" :aria-label="$t('result.statsTitle')">
          <li v-for="f in podiumOrder" :key="f.id" class="flex w-[30%] max-w-[160px] flex-col items-center text-center">
            <img
              :src="f.icon"
              :alt="className(f.classId)"
              :width="f.place === 1 ? 72 : 52"
              :height="f.place === 1 ? 72 : 52"
              class="wow-slot"
              :class="f.place === 1 ? 'h-14 w-14 sm:h-[72px] sm:w-[72px] !border-gold shadow-[0_0_24px_rgba(255,209,0,0.5)]' : 'h-11 w-11 sm:h-[52px] sm:w-[52px]'"
            />
            <span class="mt-1.5 max-w-full truncate font-display text-[15px] font-bold leading-tight" :class="`text-c-${f.classId}`">{{ f.name }}</span>
            <span class="text-[12px] text-neutral-400">{{ className(f.classId) }}</span>
            <div
              class="mt-1.5 flex w-full items-start justify-center rounded-t-md border-2 border-b-0 bg-gradient-to-b from-[#2a2010] to-[#120d07] pt-1 font-display text-xl font-black"
              :class="[medal[f.place], f.place === 1 ? 'h-12' : f.place === 2 ? 'h-9' : 'h-7']"
            >
              {{ f.place }}
            </div>
          </li>
        </ol>
        <div class="h-1 bg-gradient-to-r from-transparent via-gold-border to-transparent" />

        <!-- Weiter zu den Klassenseiten -->
        <div class="mt-5 flex flex-col items-center gap-3">
          <NuxtLink v-if="classLink(winner.classId)" :to="classLink(winner.classId)" class="wow-btn wow-btn-lg w-full sm:w-auto" @click="trackEvent('result_class_click', { source: 'arena', class_id: winner.classId, place: 1, game_mode: mode }); emit('close')">
            {{ $t('result.learnMore', { class: $t(`classAccusative.${winner.classId}`) }) }} ›
          </NuxtLink>
          <p v-if="podium.length > 1" class="text-center text-[15px] text-neutral-400">
            {{ $t('result.alsoOnPodium') }}:
            <template v-for="(f, i) in podium.slice(1)" :key="f.id">
              <span v-if="i > 0"> · </span>
              <NuxtLink :to="classLink(f.classId)" class="font-semibold underline decoration-dotted underline-offset-2 hover:text-gold" :class="`text-c-${f.classId}`" @click="trackEvent('result_class_click', { source: 'arena', class_id: f.classId, place: f.place, game_mode: mode }); emit('close')">{{ className(f.classId) }}</NuxtLink>
            </template>
          </p>
        </div>

        <!-- Kampfauswertung -->
        <section class="mt-6">
          <div class="flex items-baseline justify-between gap-3">
            <h3 class="font-display text-lg font-bold text-gold">{{ $t('result.statsTitle') }}</h3>
            <span class="text-[14px] text-neutral-400">{{ $t('result.rounds', { n: rounds }) }}</span>
          </div>

          <ul v-if="awards.length" class="mt-3 grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-2" :aria-label="$t('result.awards')">
            <li v-for="a in awards" :key="a.key" class="wow-tooltip flex items-baseline justify-between gap-2 !px-3 !py-1.5 text-[13px]">
              <span class="text-gold">{{ $t(`result.award.${a.key}`) }}</span>
              <span class="min-w-0 truncate text-right"><span class="font-semibold" :class="`text-c-${a.fighter.classId}`">{{ a.fighter.name }}</span> <span class="text-neutral-400">({{ a.value }})</span></span>
            </li>
          </ul>

          <div class="wow-scroll relative mt-3 overflow-x-auto rounded-md border border-gold-border/50" tabindex="0" role="region" :aria-label="$t('result.statsTitle')">
            <table class="w-full min-w-[30rem] text-left text-[14px]">
              <thead class="bg-[#120d07] font-display text-[12px] uppercase tracking-wide text-gold shadow-[0_1px_0_rgba(138,109,43,0.6)]">
                <tr>
                  <th class="p-2">#</th>
                  <th class="p-2">{{ $t('result.fighter') }}</th>
                  <th class="p-2 text-right">{{ $t('result.damage') }}</th>
                  <th class="p-2 text-right">{{ $t('result.healing') }}</th>
                  <th class="p-2 text-right">{{ $t('result.crits') }}</th>
                  <th class="p-2 text-right">{{ $t('result.dodges') }}</th>
                  <th class="p-2 text-right">{{ $t('result.kills') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="f in ranking" :key="f.id" class="border-t border-white/5" :class="f.place === 1 ? 'bg-gold/5' : ''">
                  <td class="p-2 font-display font-bold" :class="f.place <= 3 ? medal[f.place].split(' ')[0] : 'text-neutral-500'">{{ f.place }}</td>
                  <td class="p-2">
                    <span class="font-semibold" :class="`text-c-${f.classId}`">{{ f.name }}</span>
                    <span v-if="f.name !== f.className" class="text-neutral-500"> · {{ className(f.classId) }}</span>
                  </td>
                  <td class="p-2 text-right tabular-nums">{{ f.damageDone }}</td>
                  <td class="p-2 text-right tabular-nums">{{ f.healingDone }}</td>
                  <td class="p-2 text-right tabular-nums">{{ f.crits }}</td>
                  <td class="p-2 text-right tabular-nums">{{ f.dodges }}</td>
                  <td class="p-2 text-right tabular-nums">{{ f.kills }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Aktionsleiste: kompakt, immer sichtbar -->
      <div class="grid shrink-0 grid-cols-2 gap-2 border-t border-gold-border/60 bg-black/50 p-3 sm:flex sm:justify-center sm:gap-3">
        <ShareButton v-if="shareUrl" :url="shareUrl" :text="shareText" :label="$t('share.buttonArena')" content-type="arena_winner" :item-id="winner.classId" class="wow-btn-sm !py-2 sm:!px-4" />
        <button class="wow-btn wow-btn-stone wow-btn-sm !py-2 sm:!px-4" :class="!shareUrl && 'col-span-2'" @click="emit('again')">⚔ {{ $t('result.again') }}</button>
        <button class="col-span-2 py-1 text-[14px] text-neutral-400 underline decoration-dotted underline-offset-4 hover:text-gold sm:col-span-1" @click="emit('close')">{{ $t('result.viewFight') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes victory-pop {
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
