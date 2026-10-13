<script setup>
// Rendert einen Textblock aus content/<locale>/blocks/<name>.md inkl. optionaler FAQ
const props = defineProps({
  name: { type: String, required: true }
})

const { locale } = useI18n()
const { data: block } = await useAsyncData(() => `block-${props.name}-${locale.value}`, () =>
  queryCollection(locale.value === 'en' ? 'blocks_en' : 'blocks_de').path(`/${props.name}`).first()
)

// FAQ als strukturierte Daten, damit Suchmaschinen und KI-Systeme die Antworten zuordnen können
if (block.value?.faq?.length) {
  useSchemaOrg([
    defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
    ...block.value.faq.map(item => defineQuestion({ name: item.q, acceptedAnswer: item.a }))
  ])
}
</script>

<template>
  <div v-if="block">
    <ContentProse>
      <ContentRenderer :value="block" />
    </ContentProse>
    <section v-if="block.faq?.length" class="mt-10">
      <h2 class="wow-title text-2xl">{{ $t('common.faqTitle') }}</h2>
      <FaqList :items="block.faq" class="mt-4" />
    </section>
  </div>
</template>
