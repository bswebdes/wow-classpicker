<script setup>
// Alle Klassenfarben als Farbkacheln, Klick kopiert den Hex-Code
const { t } = useI18n()
const { copied, copy } = useCopyText()
const colors = computed(() => [...classInfo]
  .map(c => ({ id: c.id, color: c.color, name: t(`classes.${c.id}.name`) }))
  .sort((a, b) => a.name.localeCompare(b.name)))
</script>

<template>
  <ul class="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" :aria-label="$t('colors.gridLabel')">
    <li v-for="c in colors" :key="c.id">
      <button
        type="button"
        class="block w-full overflow-hidden rounded-md border border-[#8a6d2b] bg-[#120d07] text-left shadow-md transition-transform hover:-translate-y-0.5 hover:border-gold"
        :title="$t('colors.copy')"
        @click="copy(c.color)"
      >
        <span class="block h-14 border-b border-black/60" :style="{ backgroundColor: c.color }" aria-hidden="true" />
        <span class="block px-3 py-2">
          <span class="block font-display text-[15px] font-bold leading-tight text-neutral-100">{{ c.name }}</span>
          <code class="text-[13px] text-neutral-300">{{ copied === c.color ? $t('colors.copied') : c.color }}</code>
        </span>
      </button>
    </li>
  </ul>
</template>
