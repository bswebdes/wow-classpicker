<script setup>
const props = defineProps({
  winner: Object
})
</script>

<template>
  <div v-if="winner" id="victory-screen" class="victory-screen">
    <h2>🏆 CHAMPION GEFUNDEN! 🏆</h2>
    <p>Du spielst in Midnight: <strong>{{ winner.name }}</strong>!</p>
  </div>
</template>
