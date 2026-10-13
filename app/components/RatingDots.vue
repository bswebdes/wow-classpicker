<script setup>
defineProps({
  value: { type: Number, required: true },
  color: { type: String, default: '#FACC15' }
})
</script>

<template>
  <span class="inline-flex gap-1" :aria-label="`${value}/5`" role="img">
    <span
      v-for="i in 5"
      :key="i"
      class="w-3 h-3 rounded-full border border-neutral-600"
      :style="i <= value ? { backgroundColor: color, borderColor: color } : {}"
    />
  </span>
</template>
