<script setup>
// Offizielles Klassen-Artwork von Blizzard, im Fließtext rechts umflossen
defineProps({
  name: { type: String, required: true }
})
</script>

<template>
  <figure class="not-prose float-right mb-2 ml-4 mt-1 w-24 sm:ml-5 sm:mb-3 sm:w-44">
    <img
      :src="`/images/classes/${name}.webp`"
      :alt="`${$t(`classes.${name}.name`)}: ${$t(`art.classes.${name}`)}`"
      width="384"
      height="384"
      loading="lazy"
      decoding="async"
      class="aspect-square w-full rounded-md border-2 border-[#8a6d2b] object-cover shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
    >
  </figure>
</template>
