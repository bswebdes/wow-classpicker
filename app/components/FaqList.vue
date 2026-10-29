<script setup>
defineProps({
  items: { type: Array, required: true }
})
const { addToSet, unlock } = useAchievements()
// Erfolg „Neugierig wie ein Gnom“: verschiedene aufgeklappte Fragen zählen
const onToggle = (event, q) => {
  if (!event.target.open) return
  trackEvent('faq_open', { question: q })
  if (addToSet('faqs', q) >= achievementThresholds.faqs) unlock('curious')
}
</script>

<template>
  <!-- FAQ im Questlog-Stil: goldenes Quest-Fragezeichen, aufgeklappt leuchtet die Kante -->
  <div class="space-y-2.5">
    <details v-for="(item, i) in items" :key="item.q" v-reveal="i" class="faq-item group" @toggle="onToggle($event, item.q)">
      <summary class="flex cursor-pointer list-none items-center gap-3.5 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span class="faq-marker" aria-hidden="true">?</span>
        <h3 class="min-w-0 flex-1 font-display text-[16px] font-bold leading-snug text-gold transition-colors group-hover:text-gold-light">{{ item.q }}</h3>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-gold-dark transition-transform duration-200 group-open:rotate-180" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </summary>
      <div class="mx-4 border-t border-gold-border/40 pb-4 pt-3 sm:ml-[3.75rem]">
        <p class="leading-relaxed text-neutral-200">{{ item.a }}</p>
      </div>
    </details>
  </div>
</template>
