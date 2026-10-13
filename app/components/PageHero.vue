<script setup>
// Hauptbild einer Seite mit Titel darüber (Bilder liegen in public/images/hero, je 1600 und 800 px breit)
defineProps({
  image: { type: String, required: true },
  alt: { type: String, required: true }
})
</script>

<template>
  <div class="relative overflow-hidden rounded-md border-2 border-[#8a6d2b] bg-[#120d07] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
    <img
      :src="`/images/hero/${image}-800.webp`"
      :srcset="`/images/hero/${image}-800.webp 800w, /images/hero/${image}.webp 1600w`"
      sizes="(min-width: 1100px) 1024px, 92vw"
      :alt="alt"
      width="1600"
      height="900"
      fetchpriority="high"
      class="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
    >
    <div class="absolute inset-0 hidden bg-gradient-to-t from-black/90 via-black/30 to-transparent sm:block" />
    <div class="relative p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-6">
      <slot />
    </div>
  </div>
</template>
