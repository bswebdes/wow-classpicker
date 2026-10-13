<script setup>
definePageMeta({
  i18n: { paths: { de: '/impressum', en: '/imprint' } }
})

const { t } = useI18n()

// Rechtstexte: erreichbar, aber nicht in Suchergebnissen
useSeoMeta({
  title: () => `${t('footer.imprint')} – Find Your Main`,
  robots: 'noindex, follow'
})
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('footer.imprint') }}</h1>
    <ContentBlock name="impressum" class="mt-8" />
  </main>
</template>
