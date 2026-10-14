<script setup>
// Thalgrim Eichenhorn als rundes Porträt (Quiz, Turnier-Tipps). Ausschnitt per CSS aus der Zwergenszene
// von Blizzard, die Bilddatei bleibt unverändert. Den Bildausschnitt nur hier anpassen.
defineProps({
  // Kantenlänge in Pixeln
  size: { type: Number, default: 64 },
  // Quest-Marker unten rechts, z. B. '!' oder '?'
  marker: { type: String, default: '' }
})
</script>

<template>
  <span class="relative inline-block shrink-0">
    <span
      class="relative block overflow-hidden rounded-full border-2 border-gold bg-[#2a1d08] shadow-[0_0_10px_rgba(255,209,0,0.4)]"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <img
        src="/images/thalgrim.webp"
        :alt="$t('quest.npcAlt')"
        width="1000"
        height="563"
        class="absolute max-w-none"
        style="width: 900%; left: -172%; top: -96%;"
      >
    </span>
    <span
      v-if="marker"
      class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gold bg-[#2a1d08] font-display text-[14px] font-black text-gold"
      aria-hidden="true"
    >{{ marker }}</span>
  </span>
</template>
