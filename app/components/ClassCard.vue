<script setup>
const props = defineProps({
  classId: { type: String, required: true }
})

const { locale } = useI18n()
const localePath = useLocalePath()
const info = computed(() => getClassInfo(props.classId))
</script>

<template>
  <NuxtLink
    v-if="info"
    :to="localePath({ name: 'klassen-slug', params: { slug: info.slug[locale] } })"
    class="group flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-3 transition-colors hover:border-neutral-600"
  >
    <img :src="info.icon" :alt="$t(`classes.${info.id}.name`)" width="48" height="48" class="w-12 h-12 rounded-md" :style="{ outline: `2px solid ${info.color}` }" />
    <span class="flex flex-col text-left">
      <span class="font-bold" :style="{ color: info.color }">{{ $t(`classes.${info.id}.name`) }}</span>
      <span class="text-xs text-neutral-400">{{ classRoles(info).map(r => $t(`common.roles.${r}`)).join(' · ') }}</span>
    </span>
  </NuxtLink>
</template>
