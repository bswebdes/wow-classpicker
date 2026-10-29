<script setup>
// Eine Volksspalte wie in der Charaktererstellung: Porträts zweispaltig, neutrale Völker unten auf beiden Seiten.
// Porträts aus public/images/races (offizielle Blizzard-Bilder, Himmelsgeborene aus skyborne/factions.webp)
const props = defineProps({
  mode: { type: String, default: 'retail' },
  faction: { type: String, required: true }, // alliance | horde
  gender: { type: String, default: 'f' },
  modelValue: { type: String, required: true } // Volk-ID
})
const emit = defineEmits(['update:modelValue'])
const { locale } = useI18n()

const races = computed(() => [
  ...getRaces(props.mode).filter(r => r.faction === props.faction),
  ...getRaces(props.mode).filter(r => r.faction === 'neutral')
])
const ring = r => r.faction === 'neutral' ? '#b89b5e' : props.faction === 'alliance' ? '#3f6fd8' : '#c8202a'
const pick = id => emit('update:modelValue', id)
</script>

<template>
  <div class="grid grid-cols-2 content-start gap-1 sm:gap-1.5">
    <button
      v-for="r in races"
      :key="r.id"
      type="button"
      class="race-btn"
      :class="{ 'is-active': modelValue === r.id }"
      :style="{ '--ring': ring(r) }"
      :aria-pressed="modelValue === r.id"
      :aria-label="r.name[locale]"
      :title="r.name[locale]"
      @click="pick(r.id)"
    >
      <img :src="racePortrait(r.id, gender)" alt="" width="48" height="48" decoding="async">
    </button>
  </div>
</template>

<style scoped>
.race-btn {
  height: 34px;
  width: 34px;
  overflow: hidden;
  border-radius: 9999px;
  border: 2px solid var(--ring);
  background: #120d07;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  transition: transform 0.12s, box-shadow 0.12s, border-color 0.12s;
}
.race-btn img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
@media (min-width: 640px) {
  .race-btn { height: 48px; width: 48px; }
}
.race-btn:hover { transform: scale(1.06); }
.race-btn.is-active {
  border-color: #ffd100;
  box-shadow: 0 0 0 2px #000, 0 0 14px rgba(255, 209, 0, 0.8);
  transform: scale(1.1);
}
@media (prefers-reduced-motion: reduce) {
  .race-btn, .race-btn:hover, .race-btn.is-active { transition: none; transform: none; }
}
</style>
