<script setup>
// Auswahl als Button-Gruppe im Ingame-Stil (statt Dropdown)
defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true }, // { value, label, color? }
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset>
    <legend class="mb-1.5 font-display text-[14px] font-bold text-gold">{{ label }}</legend>
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="rounded-[4px] border px-3 py-1.5 font-display text-[14px] font-bold transition-all"
        :class="modelValue === opt.value
          ? 'border-gold bg-gradient-to-b from-[#3a2a12] to-[#1a120a] shadow-[0_0_10px_rgba(255,209,0,0.35),inset_0_0_0_1px_#000]'
          : 'border-neutral-700 bg-gradient-to-b from-[#2a2a2a] to-[#141414] text-neutral-400 hover:border-gold-border hover:text-neutral-200'"
        :style="modelValue === opt.value ? { color: opt.color || '#ffd100' } : (opt.color ? { color: opt.color, opacity: 0.75 } : {})"
        :aria-pressed="modelValue === opt.value"
        @click="emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </fieldset>
</template>
