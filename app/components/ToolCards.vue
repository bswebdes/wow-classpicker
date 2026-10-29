<script setup>
// Werkzeuge zur Klassenwahl als Gegenstands-Tooltips: Name in Qualitätsfarbe, grüne „Benutzen“-Zeile, Flavor-Text
const props = defineProps({
  mode: { type: String, default: 'retail' }
})
const localePath = useLocalePath()
const { t } = useI18n()

const tools = computed(() => [
  { key: 'quiz', icon: 'quiz', quality: '#a335ee', to: localePath(routeNameFor('quiz', props.mode)), title: t('nav.quiz'), text: t('home.quizTeaser') },
  { key: 'random', icon: 'random', quality: '#0070dd', to: localePath(routeNameFor('zufall', props.mode)), title: t('nav.random'), text: props.mode === 'forever' ? t('forever.home.randomTeaser') : t('home.randomTeaser') },
  { key: 'classes', icon: 'classes', quality: '#1eff00', to: localePath(routeNameFor('klassen', props.mode)), title: t('nav.classes'), text: props.mode === 'forever' ? t('forever.home.classesTeaser') : t('home.classesTeaser') },
  { key: 'compare', icon: 'compare', quality: '#ff8000', to: localePath(routeNameFor('klassen-vergleich', props.mode)), title: t('compare.nav'), text: t('tools.compareTeaser') },
  { key: 'names', icon: 'names', quality: '#e6cc80', to: localePath(routeNameFor('namensgenerator', props.mode)), title: t('nav.names'), text: props.mode === 'forever' ? t('forever.home.namesTeaser') : t('home.namesTeaser') }
])
const classCount = computed(() => getClassList(props.mode).length)
</script>

<template>
  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
    <li v-for="(tool, i) in tools" :key="tool.key" v-reveal="i" class="flex">
      <NuxtLink :to="tool.to" class="tool-card group" :style="{ '--q': tool.quality }">
        <span class="flex items-start gap-3">
          <span class="wow-slot flex h-12 w-12 shrink-0 items-center justify-center !border-[color:var(--q)]/70" :style="{ color: tool.quality }">
            <NavIcon :name="tool.icon" :size="26" />
          </span>
          <span class="min-w-0">
            <span class="block font-display text-[17px] font-bold leading-tight" :style="{ color: tool.quality }">{{ tool.title }}</span>
            <span class="mt-0.5 block text-[13px] text-neutral-300">{{ $t(`tools.meta.${tool.key}`, { n: classCount }) }}</span>
          </span>
        </span>
        <span class="mt-3 block text-[15px] leading-snug text-quality-uncommon">{{ $t('tools.use') }} {{ tool.text }}</span>
        <span class="mt-2 block flex-1 text-[14px] italic leading-snug text-gold">{{ $t(`tools.flavor.${tool.key}`) }}</span>
        <span class="mt-3 flex items-center justify-end gap-1 font-display text-[13px] font-bold uppercase tracking-wider text-neutral-400 transition-colors group-hover:text-gold">
          {{ $t('tools.open') }} <span aria-hidden="true" class="transition-transform group-hover:translate-x-0.5">›</span>
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>
