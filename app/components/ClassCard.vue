<script setup>
const props = defineProps({
  classId: { type: String, required: true },
  mode: { type: String, default: 'retail' }
})

const { locale } = useI18n()
const localePath = useLocalePath()
const info = computed(() => getClassInfo(props.classId, props.mode))
</script>

<template>
  <NuxtLink
    v-if="info"
    :to="localePath({ name: routeNameFor('klassen-slug', mode), params: { slug: info.slug[locale] } })"
    class="wow-tooltip group flex items-center gap-3 !p-2.5 transition-colors hover:border-gold"
  >
    <img :src="info.icon" :alt="$t(`classes.${info.id}.name`)" width="48" height="48" class="wow-slot h-12 w-12 group-hover:!border-gold-border" />
    <span class="flex flex-col text-left">
      <span class="font-display font-bold" :style="{ color: info.color }">{{ $t(`classes.${info.id}.name`) }}</span>
      <span class="text-[13px] text-neutral-400">{{ classRoles(info).map(r => $t(`common.roles.${r}`)).join(' · ') }}</span>
    </span>
  </NuxtLink>
</template>
