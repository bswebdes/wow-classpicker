<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  classes?: string[]
}>(), {
  title: 'WoW Class Picker',
  subtitle: '',
  classes: () => []
})

const icons = computed(() => {
  const list = props.classes.length ? props.classes.map(id => getClassInfo(id)).filter(Boolean) : classInfo
  return list.slice(0, 13)
})
const accent = computed(() => props.classes.length === 1 ? getClassInfo(props.classes[0]!)?.color ?? '#FACC15' : '#FACC15')
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-16" style="background: linear-gradient(135deg, #0a0a0a 0%, #1c1917 60%, #3b0d0d 100%); color: #f5f5f5;">
    <div class="flex items-center gap-4">
      <div class="flex" style="width: 14px; height: 56px; background: #dc2626;" />
      <span class="text-[34px] font-bold uppercase" style="letter-spacing: 0.08em; color: #a3a3a3;">WoW Class Picker</span>
    </div>

    <div class="flex flex-col gap-6">
      <span class="text-[76px] font-bold" :style="{ color: accent, lineHeight: 1.05 }">{{ title }}</span>
      <span v-if="subtitle" class="text-[32px]" style="color: #d4d4d4; line-height: 1.35;">{{ subtitle }}</span>
    </div>

    <div class="flex gap-3">
      <img
        v-for="c in icons"
        :key="c!.id"
        :src="c!.icon"
        :width="icons.length > 6 ? 72 : 110"
        :height="icons.length > 6 ? 72 : 110"
        :style="{ borderRadius: '12px', border: `3px solid ${c!.color}` }"
      >
    </div>
  </div>
</template>
