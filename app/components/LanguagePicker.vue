<script setup>
// Sprachumschalter als Segment-Schalter (Sprachen statt Länderflaggen)
defineProps({
  full: { type: Boolean, default: false }
})
const { locale, locales } = useI18n()
</script>

<template>
  <nav :aria-label="$t('language.switchTo')" class="items-center">
    <div class="inline-flex overflow-hidden rounded-[4px] border border-gold-border/70 bg-black/60">
      <SwitchLocalePathLink
        v-for="(l, i) in locales"
        :key="l.code"
        :locale="l.code"
        class="font-display font-bold tracking-wider transition-colors"
        :class="[
          full ? 'px-4 py-2 text-[15px]' : 'px-2.5 py-1 text-[13px]',
          i > 0 ? 'border-l border-gold-border/50' : '',
          locale === l.code
            ? 'bg-gradient-to-b from-[#3a2a12] to-[#1a120a] text-gold'
            : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100'
        ]"
        :lang="l.code"
        :hreflang="l.code"
        :aria-current="locale === l.code ? 'true' : undefined"
        :title="$t(`language.full.${l.code}`)"
      >
        <template v-if="full">{{ $t(`language.full.${l.code}`) }}</template>
        <template v-else>
          <span aria-hidden="true">{{ $t(`language.short.${l.code}`) }}</span>
          <span class="sr-only">{{ $t(`language.full.${l.code}`) }}</span>
        </template>
      </SwitchLocalePathLink>
    </div>
  </nav>
</template>
