<script setup>
// Bild im Fließtext eines Ratgebers (offizielle Blizzard-Bilder aus public/images, nur verkleinert)
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, default: '' }
})
</script>

<template>
  <figure class="not-prose my-6">
    <img
      :src="src"
      :alt="alt"
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
      class="aspect-video w-full rounded-md border-2 border-[#8a6d2b] object-cover shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
    >
    <figcaption v-if="caption" class="mt-1.5 text-[14px] italic text-[#5a4320]">{{ caption }}</figcaption>
  </figure>
</template>
