<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  classes?: string[]
  mode?: 'retail' | 'forever'
}>(), {
  title: 'WoW Class Picker',
  subtitle: '',
  classes: () => [],
  mode: 'retail'
})

const icons = computed(() => {
  const list = props.classes.length ? props.classes.map(id => getClassInfo(id, props.mode)).filter(Boolean) : getClassList(props.mode)
  return list.slice(0, 13)
})
const accent = computed(() => props.classes.length === 1 ? getClassInfo(props.classes[0]!, props.mode)?.color ?? '#FFD100' : '#FFD100')
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between p-16" style="color: #f5f5f5; border: 6px solid #8a6d2b;" :style="{ background: mode === 'forever' ? 'linear-gradient(135deg, #0b0805 0%, #1f160b 55%, #4a2a08 100%)' : 'linear-gradient(135deg, #0b0805 0%, #1a1020 55%, #2a0e3d 100%)' }">
    <div class="flex items-center gap-4">
      <div class="flex" style="width: 14px; height: 56px; background: #ffd100;" />
      <span class="text-[34px] font-bold uppercase" style="letter-spacing: 0.08em; color: #d4c08a;">WoW Class Picker</span>
      <span class="text-[26px] font-bold uppercase" style="letter-spacing: 0.08em; color: #8a6d2b;">· {{ mode === 'forever' ? 'Forever' : 'Midnight' }}</span>
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
