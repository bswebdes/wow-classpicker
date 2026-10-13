<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  classes?: string[]
  mode?: 'retail' | 'forever'
  // Hauptbild als Hintergrund, Klassen-Artwork rechts (Pfade in public/)
  image?: string
  art?: string
}>(), {
  title: 'Find Your Main',
  subtitle: '',
  classes: () => [],
  mode: 'retail',
  image: '',
  art: ''
})

const icons = computed(() => {
  const list = props.classes.length ? props.classes.map(id => getClassInfo(id, props.mode)).filter(Boolean) : getClassList(props.mode)
  return list.slice(0, 13)
})
const accent = computed(() => props.classes.length === 1 ? getClassInfo(props.classes[0]!, props.mode)?.color ?? '#FFD100' : '#FFD100')
</script>

<template>
  <div class="w-full h-full flex relative" style="color: #f5f5f5;" :style="{ background: mode === 'forever' ? 'linear-gradient(135deg, #0b0805 0%, #1f160b 55%, #4a2a08 100%)' : 'linear-gradient(135deg, #0b0805 0%, #1a1020 55%, #2a0e3d 100%)' }">
    <img v-if="image" :src="image" width="1200" height="630" class="absolute" style="left: 0; top: 0; width: 1200px; height: 630px; object-fit: cover;">
    <div v-if="image" class="absolute flex" style="left: 0; top: 0; width: 1200px; height: 630px; background: linear-gradient(90deg, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.62) 48%, rgba(8,6,4,0.12) 100%);" />

    <div class="absolute flex flex-col justify-between p-16" style="left: 0; top: 0; width: 1200px; height: 630px; border: 6px solid #8a6d2b;">
      <div class="flex items-center gap-4">
        <div class="flex" style="width: 14px; height: 56px; background: #ffd100;" />
        <span class="text-[34px] font-bold uppercase" style="letter-spacing: 0.08em; color: #d4c08a;">Find Your Main</span>
        <span class="text-[26px] font-bold uppercase" style="letter-spacing: 0.08em; color: #8a6d2b;">· {{ mode === 'forever' ? 'Forever' : 'Midnight' }}</span>
      </div>

      <div class="flex flex-col gap-6" :style="{ width: art ? '700px' : '1060px' }">
        <span class="text-[72px] font-bold" :style="{ color: accent, lineHeight: 1.05, textShadow: '0 3px 8px #000' }">{{ title }}</span>
        <span v-if="subtitle" class="text-[30px]" style="color: #e5e5e5; line-height: 1.35; text-shadow: 0 2px 6px #000;">{{ subtitle }}</span>
      </div>

      <div class="flex gap-3">
        <img
          v-for="c in (art ? [] : icons)"
          :key="c!.id"
          :src="c!.icon"
          :width="icons.length > 6 ? 72 : 110"
          :height="icons.length > 6 ? 72 : 110"
          :style="{ borderRadius: '12px', border: `3px solid ${c!.color}` }"
        >
      </div>
    </div>

    <img v-if="art" :src="art" width="340" height="340" class="absolute" :style="{ right: '70px', top: '145px', width: '340px', height: '340px', borderRadius: '16px', border: `5px solid ${accent}` }">
  </div>
</template>
