<script setup>
definePageMeta({
  i18n: { paths: { de: '/zufaellige-klasse', en: '/random-class-generator' } }
})

const { t, locale } = useI18n()

usePageSeo({
  title: () => t('random.title'),
  description: () => t('random.description'),
  ogTitle: () => t('random.heading')
})

const roleFilter = ref('any')
const armorFilter = ref('any')

// Alle Kombinationen aus Klasse und Spezialisierung, die zu den Filtern passen
const pool = computed(() => classInfo.flatMap(c =>
  c.specs
    .filter(s => roleFilter.value === 'any' || s.role === roleFilter.value)
    .filter(() => armorFilter.value === 'any' || c.armor === armorFilter.value)
    .map(s => ({ classId: c.id, spec: s }))
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
    window.umami.track('Random - Roll', { class: result.value.classId, spec: result.value.spec.id })
  }
}

const resultInfo = computed(() => result.value ? getClassInfo(result.value.classId) : null)
</script>

<template>
  <main class="max-w-3xl w-[90%] mx-auto mt-8">
    <h1 class="text-3xl font-extrabold text-yellow-400">{{ $t('random.heading') }}</h1>
    <p class="mt-3 text-neutral-300">{{ $t('random.intro') }}</p>

    <section class="section mt-8">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-bold text-neutral-300">{{ $t('random.filterRole') }}</span>
          <select v-model="roleFilter" class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white">
            <option value="any">{{ $t('common.any') }}</option>
            <option v-for="r in ['tank', 'healer', 'dps']" :key="r" :value="r">{{ $t(`common.roles.${r}`) }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-bold text-neutral-300">{{ $t('random.filterArmor') }}</span>
          <select v-model="armorFilter" class="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-white">
            <option value="any">{{ $t('common.any') }}</option>
            <option v-for="a in ['plate', 'mail', 'leather', 'cloth']" :key="a" :value="a">{{ $t(`common.armor.${a}`) }}</option>
          </select>
        </label>
      </div>

      <div class="mt-8 flex flex-col items-center gap-6 min-h-[220px] justify-center">
        <p v-if="!pool.length" class="text-neutral-400">{{ $t('random.noResult') }}</p>

        <div v-else-if="result" class="flex flex-col items-center gap-3" aria-live="polite">
          <span class="text-xs uppercase tracking-wider text-neutral-400 font-bold">{{ $t('random.result') }}</span>
          <img :src="resultInfo.icon" :alt="$t(`classes.${resultInfo.id}.name`)" width="96" height="96" class="w-24 h-24 rounded-xl transition-transform" :class="{ 'scale-95 opacity-80': rolling }" :style="{ outline: `3px solid ${resultInfo.color}` }" />
          <span class="text-2xl font-extrabold" :style="{ color: resultInfo.color }">
            {{ result.spec.name[locale] }} {{ $t(`classes.${resultInfo.id}.name`) }}
          </span>
          <span class="text-sm text-neutral-400">{{ $t(`common.roles.${result.spec.role}`) }} · {{ $t(`common.range.${result.spec.range}`) }} · {{ $t(`common.armor.${resultInfo.armor}`) }}</span>
        </div>

        <button v-if="pool.length" class="arcade-btn group relative overflow-hidden" :disabled="rolling" @click="roll">
          <span class="relative z-10">{{ result ? $t('random.rollAgain') : $t('random.roll') }}</span>
          <div class="absolute inset-0 bg-red-700 transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors"></div>
        </button>

        <ClassCard v-if="result && !rolling" :class-id="result.classId" class="w-full sm:w-auto" />
      </div>
    </section>

    <ContentBlock name="random" class="mt-12" />
  </main>
</template>
