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

const medal = { 1: 'text-[#ffd100] border-[#ffd100]', 2: 'text-[#d8d8e0] border-[#b8b8c8]', 3: 'text-[#e0a060] border-[#b87333]' }

// Fokus in den Dialog, Escape schließt ihn
const dialogRef = ref(null)
const onKey = (e) => { if (e.key === 'Escape') emit('close') }
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

onMounted(() => {
  window.addEventListener('keydown', onKey)
  nextTick(() => dialogRef.value?.focus())
  if (props.winner) {
    trackEvent('battle_victory', { winner: props.winner.classId, game_mode: props.mode, rounds: props.rounds })
  }
})
</script>

<template>
  <div v-if="winner" class="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" :aria-label="$t('victory.champion')">
    <div id="victory-screen" ref="dialogRef" tabindex="-1" class="outline-none wow-frame mx-auto my-6 w-full max-w-2xl !border-gold animate-[victory-pop_0.4s_ease-out]">
      <button class="absolute right-3 top-2 text-2xl leading-none text-neutral-400 hover:text-gold" :aria-label="$t('result.close')" @click="emit('close')">×</button>

      <header class="text-center">
        <div class="font-display text-[13px] font-bold uppercase tracking-[0.3em] text-neutral-400">{{ $t('victory.achievement') }}</div>
        <h2 class="wow-title mt-1 text-4xl uppercase">{{ $t('victory.champion') }}</h2>
        <p class="mt-2 text-neutral-300">
          {{ mode === 'forever' ? $t('victory.playInForever') : $t('victory.playInMidnight') }}
          <strong class="font-display" :class="`text-c-${winner.classId}`">{{ winner.name }}</strong>
          <span v-if="winner.name !== winner.className" class="text-neutral-400"> ({{ className(winner.classId) }})</span>
        </p>
      </header>

      <!-- Siegertreppchen -->
      <ol class="mt-6 flex items-end justify-center gap-3 sm:gap-5" :aria-label="$t('result.statsTitle')">
        <li v-for="f in podiumOrder" :key="f.id" class="flex w-[30%] max-w-[160px] flex-col items-center text-center">
          <img
            :src="f.icon"
            :alt="className(f.classId)"
            :width="f.place === 1 ? 88 : 64"
            :height="f.place === 1 ? 88 : 64"
            class="wow-slot"
            :class="f.place === 1 ? 'h-[88px] w-[88px] !border-gold shadow-[0_0_24px_rgba(255,209,0,0.5)]' : 'h-16 w-16'"
          />
          <span class="mt-2 font-display font-bold leading-tight" :class="`text-c-${f.classId}`">{{ f.name }}</span>
          <span class="text-[13px] text-neutral-400">{{ className(f.classId) }}</span>
          <div
            class="mt-2 flex w-full items-start justify-center rounded-t-md border-2 border-b-0 bg-gradient-to-b from-[#2a2010] to-[#120d07] pt-2 font-display text-2xl font-black"
            :class="[medal[f.place], f.place === 1 ? 'h-24' : f.place === 2 ? 'h-16' : 'h-11']"
          >
            {{ f.place }}
          </div>
        </li>
      </ol>
      <div class="h-1 bg-gradient-to-r from-transparent via-gold-border to-transparent" />

      <!-- Weiter zu den Klassenseiten -->
      <div class="mt-6 flex flex-col items-center gap-3">
        <NuxtLink v-if="classLink(winner.classId)" :to="classLink(winner.classId)" class="wow-btn wow-btn-lg w-full sm:w-auto" @click="trackEvent('result_class_click', { source: 'arena', class_id: winner.classId, place: 1, game_mode: mode }); emit('close')">
          {{ $t('result.learnMore', { class: className(winner.classId) }) }} ›
        </NuxtLink>
        <p v-if="podium.length > 1" class="text-[15px] text-neutral-400">
          {{ $t('result.alsoOnPodium') }}:
          <template v-for="(f, i) in podium.slice(1)" :key="f.id">
            <span v-if="i > 0"> · </span>
            <NuxtLink :to="classLink(f.classId)" class="font-semibold underline decoration-dotted underline-offset-2 hover:text-gold" :class="`text-c-${f.classId}`" @click="trackEvent('result_class_click', { source: 'arena', class_id: f.classId, place: f.place, game_mode: mode }); emit('close')">{{ className(f.classId) }}</NuxtLink>
          </template>
        </p>
      </div>

      <!-- Kampfauswertung -->
      <section class="mt-8">
        <div class="flex items-baseline justify-between">
          <h3 class="font-display text-lg font-bold text-gold">{{ $t('result.statsTitle') }}</h3>
          <span class="text-[14px] text-neutral-400">{{ $t('result.rounds', { n: rounds }) }}</span>
        </div>

        <ul v-if="awards.length" class="mt-3 flex flex-wrap gap-2" :aria-label="$t('result.awards')">
          <li v-for="a in awards" :key="a.key" class="wow-tooltip !px-3 !py-1.5 text-[13px]">
            <span class="text-gold">{{ $t(`result.award.${a.key}`) }}:</span>
            <span class="font-semibold" :class="`text-c-${a.fighter.classId}`"> {{ a.fighter.name }}</span>
            <span class="text-neutral-400"> ({{ a.value }})</span>
          </li>
        </ul>

        <div class="mt-3 wow-scroll overflow-x-auto rounded-md border border-gold-border/50" tabindex="0" role="region" :aria-label="$t('result.statsTitle')">
          <table class="w-full text-left text-[14px]">
            <thead class="bg-black/50 font-display text-[12px] uppercase tracking-wide text-gold">
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

      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button class="wow-btn wow-btn-stone" @click="emit('again')">⚔ {{ $t('result.again') }}</button>
        <button class="wow-btn wow-btn-stone" @click="emit('close')">{{ $t('result.viewFight') }}</button>
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
