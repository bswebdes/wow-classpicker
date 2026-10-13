<script setup>
definePageMeta({
  i18n: { paths: { de: '/datenschutz', en: '/privacy' } }
})

const { t } = useI18n()

// Rechtstexte: erreichbar, aber nicht in Suchergebnissen
useSeoMeta({
  title: () => `${t('footer.privacy')} – Find Your Main`,
  robots: 'noindex, follow'
})
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('footer.privacy') }}</h1>
    <ContentBlock name="datenschutz" class="mt-8" />
  </main>
</template>
