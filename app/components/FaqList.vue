<script setup>
defineProps({
  items: { type: Array, required: true }
})
</script>

<template>
  <div class="space-y-2">
    <details v-for="item in items" :key="item.q" class="wow-tooltip group !py-3">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-3 font-display font-bold text-gold">
        <h3 class="text-[16px]">{{ item.q }}</h3>
        <span class="text-gold-dark transition-transform group-open:rotate-90" aria-hidden="true">▶</span>
      </summary>
      <p class="mt-2 text-neutral-200">{{ item.a }}</p>
    </details>
  </div>
</template>
