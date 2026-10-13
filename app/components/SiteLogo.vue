<script setup>
defineProps({
  mode: { type: String, default: 'retail' },
  small: { type: Boolean, default: false }
})
// Eindeutige IDs je Logo, sonst verweisen mehrere Logos auf denselben (evtl. versteckten) Verlauf
const uid = useId()
</script>

<template>
  <span class="flex items-center gap-2.5">
    <!-- Eigenes Wappen (app/utils/crestSvg.ts): Schild, Edelstein, Schwert und Stab; Farbe je Spielmodus -->
    <span
      class="block shrink-0 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [&>svg]:h-full [&>svg]:w-full"
      :class="small ? 'h-11 w-[41px]' : 'h-14 w-[53px]'"
      aria-hidden="true"
      v-html="crestSvg(mode, uid)"
    />
    <span class="flex flex-col leading-none">
      <span class="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">WoW Class Picker</span>
      <span class="wow-title uppercase" :class="small ? 'text-lg' : 'text-2xl'">Find Your Main</span>
    </span>
  </span>
</template>
