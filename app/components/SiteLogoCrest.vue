<script setup>
// Nur das Wappen ohne Schriftzug (z. B. als Ornament im Footer)
defineProps({
  mode: { type: String, default: 'retail' }
})
const uid = useId()
</script>

<template>
  <span class="block h-10 w-[38px] [&>svg]:h-full [&>svg]:w-full" aria-hidden="true" v-html="crestSvg(mode, uid)" />
</template>
