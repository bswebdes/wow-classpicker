<script setup>
// Thalgrims Tipps während eines Turnier-Kampfes, wie die Ladebildschirm-Tipps im Spiel.
// Tipps zu den kämpfenden Klassen kommen bevorzugt, bereits gezeigte Tipps merkt sich die Sitzung.
import { tips } from '~/data/tips'

const props = defineProps({
  mode: { type: String, default: 'retail' },
  // Klassen-IDs der Kämpfer
  classIds: { type: Array, default: () => [] }
})

const { locale } = useI18n()
const localePath = useLocalePath()
const { increment, unlock } = useAchievements()

const DURATION = 9000
const SEEN_KEY = 'fym_seen_tips'

const shuffle = list => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const readSeen = () => {
  try { return JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]') } catch { return [] }
}
const markSeen = (id) => {
  try {
    const seen = new Set(readSeen())
    seen.add(id)
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]))
  } catch { /* privater Modus: dann eben ohne Gedächtnis */ }
}

// Reihenfolge: zwei passende Tipps zu den Kämpfern, dann ein allgemeiner; Gesehenes zuletzt
const queue = ref([])
const buildQueue = () => {
  const seen = new Set(readSeen())
  const pool = tips.filter(t => t.mode === 'both' || t.mode === props.mode)
  const fresh = pool.filter(t => !seen.has(t.id))
  const source = fresh.length >= 6 ? fresh : pool
  const fighting = new Set(props.classIds)
  const matching = shuffle(source.filter(t => t.classes?.some(c => fighting.has(c))))
  const general = shuffle(source.filter(t => !t.classes?.some(c => fighting.has(c))))
  const out = []
  while (matching.length || general.length) {
    if (matching.length) out.push(matching.shift())
    if (matching.length) out.push(matching.shift())
    if (general.length) out.push(general.shift())
  }
  queue.value = out
}

const index = ref(0)
const current = computed(() => queue.value[index.value])
const elapsed = ref(0)
const hovered = ref(false)
const pausedByUser = ref(false)
const paused = computed(() => hovered.value || pausedByUser.value)

// Als gelesen zählt ein Tipp, der mindestens 4 Sekunden zu sehen war
const countRead = () => {
  if (elapsed.value >= 4000 && increment('tips') >= achievementThresholds.tips) unlock('tip_reader')
}
const go = (step) => {
  countRead()
  index.value = (index.value + step + queue.value.length) % queue.value.length
  elapsed.value = 0
}

let timer
onMounted(() => {
  buildQueue()
  timer = setInterval(() => {
    if (paused.value || document.hidden || !queue.value.length) return
    elapsed.value += 100
    if (elapsed.value >= DURATION) go(1)
  }, 100)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  countRead()
})
watch(current, (tip) => { if (tip) markSeen(tip.id) }, { immediate: true })

const link = computed(() => {
  const l = current.value?.link
  if (!l) return null
  const loc = locale.value === 'en' ? 'en' : 'de'
  if (l === 'class') {
    const info = getClassInfo(current.value.classes?.[0], props.mode)
    return info ? localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: info.slug[loc] } }) : null
  }
  if ('spec' in l) {
    const info = getClassInfo(current.value.classes?.[0], 'retail')
    const spec = info?.specs.find(s => s.id === l.spec)
    return spec ? localePath({ name: 'klassen-slug-spec', params: { slug: info.slug[loc], spec: specSlug(spec, loc) } }) : null
  }
  if ('path' in l) return l.path[loc]
  return modeRoutes.includes(l.route) ? localePath(routeNameFor(l.route, props.mode)) : localePath(l.route)
})
</script>

<template>
  <section
    v-if="current"
    class="wow-frame !py-3"
    :aria-label="$t('tips.title')"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="hovered = true"
    @focusout="hovered = false"
  >
    <div class="flex items-start gap-3">
      <ThalgrimPortrait :size="48" class="mt-0.5" />
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <p class="font-display text-[13px] font-bold uppercase tracking-[0.2em] text-gold">{{ $t('tips.title') }}</p>
          <p class="text-[12px] text-quality-uncommon">{{ $t('quest.npcName') }}</p>
        </div>
        <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-200" leave-to-class="opacity-0">
          <p :key="current.id" class="mt-1 text-[16px] leading-snug text-neutral-100">
            {{ current[locale === 'en' ? 'en' : 'de'] }}
            <NuxtLink v-if="link" :to="link" target="_blank" class="whitespace-nowrap font-semibold text-gold underline decoration-dotted underline-offset-2 hover:text-gold-light">
              {{ $t('tips.more') }} ›<span class="sr-only"> ({{ $t('tips.newTab') }})</span>
            </NuxtLink>
          </p>
        </Transition>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <div class="h-1 flex-1 overflow-hidden rounded-full bg-black/60" aria-hidden="true">
        <div class="h-full bg-gradient-to-r from-gold-dark to-gold transition-[width] duration-100 ease-linear" :style="{ width: `${Math.min(100, (elapsed / DURATION) * 100)}%` }" />
      </div>
      <button type="button" class="tip-btn" :aria-label="$t('tips.prev')" @click="go(-1)">‹</button>
      <button type="button" class="tip-btn" :aria-label="pausedByUser ? $t('tips.resume') : $t('tips.pause')" :aria-pressed="pausedByUser" @click="pausedByUser = !pausedByUser">
        <span aria-hidden="true">{{ pausedByUser ? '▶' : '❚❚' }}</span>
      </button>
      <button type="button" class="tip-btn" :aria-label="$t('tips.next')" @click="go(1)">›</button>
    </div>
  </section>
</template>

<style scoped>
.tip-btn {
  display: flex;
  height: 1.75rem;
  min-width: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--color-gold-border);
  background: rgba(0, 0, 0, 0.5);
  padding: 0 0.4rem;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-gold);
}
.tip-btn:hover { border-color: var(--color-gold); color: #fff; }
</style>
