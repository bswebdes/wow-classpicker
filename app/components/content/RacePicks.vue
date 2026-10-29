<script setup>
// Empfohlene Völker als Karten in Ratgebern: Volks-Icon, Fraktion, kurzer Grund und Link zum Namensgenerator
// mit vorausgewähltem Volk. Nutzung im Markdown: ::race-picks{races="voidelf,dwarf,troll" mode="retail"}
// Optionale Gründe je Volk: reasons="Allrounder|Bester Feuer-Magier|…" (gleiche Reihenfolge wie races)
const props = defineProps({
  races: { type: String, required: true },
  reasons: { type: String, default: '' },
  mode: { type: String, default: 'retail' }
})
const { locale } = useI18n()
const localePath = useLocalePath()

const picks = computed(() => {
  const why = props.reasons.split('|')
  return props.races.split(',').map(s => s.trim()).flatMap((id, i) => {
    const race = getRaces(props.mode).find(r => r.id === id)
    return race ? [{ race, reason: why[i]?.trim(), gender: i % 2 ? 'm' : 'f' }] : []
  })
})
const factionText = { alliance: 'text-[#9cc2ff]', horde: 'text-[#ff9c9c]', neutral: 'text-[#d8c08a]' }
const factionRing = { alliance: '#3f6fd8', horde: '#c8202a', neutral: '#b89b5e' }
const generatorLink = r => localePath({ name: routeNameFor('namensgenerator', props.mode), query: { race: r.id } })
</script>

<template>
  <ul class="not-prose my-6 grid gap-2 sm:grid-cols-2">
    <li v-for="{ race, reason, gender } in picks" :key="race.id" class="flex items-center gap-3 rounded-md border border-[#8a6d2b] bg-[#120d07]/90 p-2.5">
      <img :src="racePortrait(race.id, gender)" alt="" width="56" height="56" loading="lazy" class="h-14 w-14 shrink-0 rounded-full border-2" :style="{ borderColor: factionRing[race.faction] }">
      <div class="min-w-0 flex-1">
        <div class="font-display text-[16px] font-bold leading-tight text-neutral-100">{{ race.name[locale] }}</div>
        <div class="text-[12px]" :class="factionText[race.faction]">{{ $t(`races.factions.${race.faction}`).split(' (')[0] }}</div>
        <div v-if="reason" class="mt-0.5 text-[13px] leading-snug text-neutral-300">{{ reason }}</div>
      </div>
      <NuxtLink :to="generatorLink(race)" class="shrink-0 text-[13px] text-quality-uncommon hover:underline">✒ {{ $t('names.cta') }}</NuxtLink>
    </li>
  </ul>
</template>
