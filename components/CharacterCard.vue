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
  <div :id="character.id" :class="['character', character.id, { dead: !character.alive, shake: character.isShaking }]">
    <div class="hp-bar-container">
      <div 
        class="hp-bar" 
        :style="{ width: hpPercent + '%', backgroundColor: hpBarColor }"
      ></div>
    </div>
    <div class="avatar">{{ character.emoji }}</div>
    <div class="name">{{ character.name }}</div>
    <div class="status">{{ character.status }}</div>
  </div>
</template>
