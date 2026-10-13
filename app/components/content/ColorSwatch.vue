<script setup>
// Farbfeld mit Hex-Code für Ratgeber-Tabellen, Klick kopiert den Code
defineProps({
  hex: { type: String, required: true }
})
const { copied, copy } = useCopyText()
</script>

<template>
  <button type="button" class="inline-flex items-center gap-2 whitespace-nowrap rounded px-1 align-middle hover:bg-black/10" :title="$t('colors.copy')" @click="copy(hex)">
    <span class="inline-block h-4 w-4 shrink-0 rounded-sm border border-black/50" :style="{ backgroundColor: hex }" aria-hidden="true" />
    <code>{{ hex }}</code>
    <span class="w-3 text-[12px] text-gold" aria-live="polite">{{ copied ? '✓' : '' }}<span v-if="copied" class="sr-only">{{ $t('colors.copied') }}</span></span>
  </button>
</template>
