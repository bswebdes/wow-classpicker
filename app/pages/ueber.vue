<script setup>
definePageMeta({
  i18n: { paths: { de: '/ueber-uns', en: '/about' } }
})

const { t } = useI18n()

usePageSeo({
  title: () => t('about.title'),
  description: () => t('about.description'),
  ogTitle: () => t('about.heading'),
  pageType: 'AboutPage'
})
</script>

<template>
  <main class="max-w-3xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t('about.heading') }}</h1>
    <ContentBlock name="about" class="mt-8" />
  </main>
</template>
