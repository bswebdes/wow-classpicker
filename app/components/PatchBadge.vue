<script setup>
// Spielstand der Inhalte, z. B. „Spielstand: Patch 12.1.5“ (Daten in app/utils/gameVersion.ts)
const props = defineProps({
  mode: { type: String, default: 'retail' }
})
const { locale, t } = useI18n()
const checked = computed(() => new Date(gameVersion[props.mode].checked).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'de-DE', { year: 'numeric', month: 'long', day: 'numeric' }))
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full border border-gold-border/60 bg-black/40 px-2.5 py-0.5 text-[13px] text-neutral-300" :title="t('version.checked', { date: checked })">
    <span class="h-1.5 w-1.5 rounded-full bg-quality-uncommon shadow-[0_0_6px_#1eff00]" aria-hidden="true" />
    {{ $t('version.state') }}: <strong class="font-semibold text-gold">{{ versionLabel(mode, locale) }}</strong>
  </span>
</template>
