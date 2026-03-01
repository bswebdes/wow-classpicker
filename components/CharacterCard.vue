<script setup>
const props = defineProps({
  character: Object
})

const hpPercent = computed(() => Math.max(0, (props.character.hp / props.character.maxHp) * 100))

const hpBarColor = computed(() => {
  if (hpPercent.value < 20) return '#f44336'
  if (hpPercent.value < 50) return '#ffeb3b'
  return '#4caf50'
})
</script>

<template>
  <div :id="character.id" :class="[character.id, { 'opacity-30 grayscale scale-95 rotate-3': !character.alive, 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]': character.isShaking }]" class="flex flex-col items-center transition-transform duration-200 w-28 mb-5">
    <div class="w-24 h-4 bg-neutral-700 border-2 border-black rounded overflow-hidden mb-2">
      <div 
        class="h-full transition-[width,background-color] duration-300"
        :style="{ width: hpPercent + '%', backgroundColor: hpBarColor }"
      ></div>
    </div>
    <div class="w-16 h-16 mb-2">
      <img :src="character.icon" :alt="character.className" class="w-full h-full object-contain" />
    </div>
    <div class="font-bold text-sm text-center line-clamp-1" :title="character.name">{{ character.name }}</div>
    <div v-if="character.name !== character.className" class="text-[0.6rem] text-neutral-500 uppercase font-bold">{{ $t(`classes.${character.classId}.name`) }}</div>
    <div class="text-neutral-400 text-xs h-5">{{ character.status }}</div>
  </div>
</template>
