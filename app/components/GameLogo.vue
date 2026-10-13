<script setup>
// Offizielle Spiellogos (Blizzard Entertainment), unverändert verkleinert ausgeliefert
const props = defineProps({
  mode: { type: String, default: 'retail' },
  width: { type: Number, default: 120 },
  eager: { type: Boolean, default: false }
})

const logos = {
  retail: { src: '/WoW_Midnight_Logo_enUS.png', alt: 'World of Warcraft: Midnight', ratio: 1794 / 2257 },
  forever: { src: '/WoW_Forever_Logo.png', alt: 'World of Warcraft: Forever', ratio: 3850 / 4550 }
}
const logo = computed(() => logos[props.mode] || logos.retail)
</script>

<template>
  <NuxtImg
    :src="logo.src"
    :alt="logo.alt"
    :width="width"
    :height="Math.round(width * logo.ratio)"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    format="webp"
    decoding="async"
    class="h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
  />
</template>
