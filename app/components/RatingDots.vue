<script setup>
defineProps({
  value: { type: Number, required: true },
  color: { type: String, default: '#FFD100' }
})
</script>

<template>
  <span class="inline-flex gap-1">
    <span class="sr-only">{{ value }}/5</span>
    <span
      v-for="i in 5"
      :key="i"
      aria-hidden="true"
      class="w-3 h-3 rounded-full border border-neutral-600"
      :style="i <= value ? { backgroundColor: color, borderColor: color } : {}"
    />
  </span>
</template>
