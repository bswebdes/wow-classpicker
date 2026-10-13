<script setup>
// Rendert einen Textblock aus content/<locale>/blocks/<name>.md inkl. optionaler FAQ
const props = defineProps({
  name: { type: String, required: true }
})

const { locale } = useI18n()
const { data: block } = await useAsyncData(() => `block-${props.name}-${locale.value}`, () =>
  queryCollection(locale.value === 'en' ? 'blocks_en' : 'blocks_de').path(`/${props.name}`).first()
)
</script>

<template>
  <div v-if="block">
    <ContentProse>
      <ContentRenderer :value="block" />
    </ContentProse>
    <div v-if="block.faq?.length" class="mt-8 space-y-3">
      <details v-for="item in block.faq" :key="item.q" class="section">
        <summary class="cursor-pointer font-bold text-white">{{ item.q }}</summary>
        <p class="mt-2 text-neutral-300">{{ item.a }}</p>
      </details>
    </div>
  </div>
</template>
