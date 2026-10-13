<script setup>
// Reihe offizieller Klassen-Artworks mit Link zur Klassenseite
const props = defineProps({
  classes: { type: String, required: true },
  mode: { type: String, default: 'retail' }
})
const { locale } = useI18n()
const localePath = useLocalePath()
const items = computed(() => props.classes.split(',').map(id => getClassInfo(id.trim(), props.mode)).filter(Boolean))
const link = c => localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: c.slug[locale.value] } })
</script>

<template>
  <ul class="not-prose my-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
    <li v-for="c in items" :key="c.id">
      <NuxtLink :to="link(c)" class="group flex h-full flex-col overflow-hidden rounded-md border border-[#8a6d2b] bg-[#120d07] shadow-md transition-transform hover:-translate-y-0.5 hover:border-gold">
        <img
          :src="`/images/classes/${c.id}.webp`"
          :alt="`${$t(`classes.${c.id}.name`)}: ${$t(`art.classes.${c.id}`)}`"
          width="384"
          height="384"
          loading="lazy"
          decoding="async"
          class="aspect-square w-full object-cover"
        >
        <span class="flex flex-1 items-center justify-center whitespace-nowrap border-t-2 px-1 py-1 text-center text-[13px] font-bold text-neutral-100" :style="{ borderColor: c.color }">{{ $t(`classes.${c.id}.name`) }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>
