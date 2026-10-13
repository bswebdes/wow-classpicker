<script setup>
defineProps({
  mode: { type: String, default: 'retail' },
  small: { type: Boolean, default: false }
})
</script>

<template>
  <span class="flex items-center gap-2.5">
    <!-- Eigenes Wappen: Schild mit Gold-Rand, Farbe je Spielmodus -->
    <svg :width="small ? 30 : 40" :height="small ? 36 : 48" viewBox="0 0 40 48" aria-hidden="true" class="shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff3b0" />
          <stop offset="0.5" stop-color="#ffd100" />
          <stop offset="1" stop-color="#8a6d2b" />
        </linearGradient>
        <linearGradient id="logo-retail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4b1d6e" />
          <stop offset="1" stop-color="#14061f" />
        </linearGradient>
        <linearGradient id="logo-forever" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9e1414" />
          <stop offset="1" stop-color="#3e0404" />
        </linearGradient>
      </defs>
      <path d="M20 2 L37 8 V22 C37 34 29 42 20 46 C11 42 3 34 3 22 V8 Z" :fill="mode === 'forever' ? 'url(#logo-forever)' : 'url(#logo-retail)'" stroke="url(#logo-gold)" stroke-width="2.5" />
      <path d="M20 10 L23 21 L33 24 L23 27 L20 38 L17 27 L7 24 L17 21 Z" fill="url(#logo-gold)" />
    </svg>
    <span class="flex flex-col leading-none">
      <span class="font-display text-[11px] font-bold uppercase tracking-[0.35em] text-neutral-400">World of Warcraft</span>
      <span class="wow-title uppercase" :class="small ? 'text-lg' : 'text-2xl'">Class Picker</span>
    </span>
  </span>
</template>
