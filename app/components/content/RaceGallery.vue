<script setup>
// Offizielle Volksporträts von Blizzard (nur Völker mit Bild)
const props = defineProps({
  mode: { type: String, default: 'retail' }
})
const withImage = new Set(['dwarf', 'gnome', 'human', 'nightelf', 'draenei', 'worgen', 'lightforged', 'voidelf', 'darkiron', 'kultiran', 'mechagnome', 'pandaren', 'dracthyr', 'earthen', 'haranir', 'orc', 'tauren', 'troll', 'undead', 'bloodelf', 'goblin', 'highmountain', 'nightborne', 'maghar', 'vulpera', 'zandalari'])
const races = computed(() => getRaces(props.mode).filter(r => withImage.has(r.id)))
const factionColor = { alliance: 'text-[#9cc2ff]', horde: 'text-[#ff9c9c]', neutral: 'text-neutral-300' }
</script>

<template>
  <ul class="not-prose my-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" :aria-label="$t('art.galleryLabel')">
    <li v-for="r in races" :key="r.id" class="overflow-hidden rounded-md border border-[#8a6d2b] bg-[#120d07] shadow-md">
      <img
        :src="`/images/races/${r.id}.webp`"
        :alt="`${r.name[$i18n.locale]}: ${$t(`art.races.${r.id}`)}`"
        width="300"
        height="342"
        loading="lazy"
        decoding="async"
        class="aspect-[400/456] w-full bg-gradient-to-b from-[#2a2010] to-[#120d07] object-cover object-top"
      >
      <div class="px-2 py-1.5">
        <span class="block whitespace-nowrap text-[14px] font-bold leading-tight text-neutral-100">{{ r.name[$i18n.locale] }}</span>
        <span class="block text-[12px]" :class="factionColor[r.faction]">{{ $t(`races.factions.${r.faction}`).split(' (')[0] }}</span>
      </div>
    </li>
  </ul>
</template>
