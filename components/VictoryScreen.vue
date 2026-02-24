<script setup>
const props = defineProps({
  winner: Object
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="winner" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div 
      id="victory-screen" 
      class="max-w-sm w-full p-8 border-4 border-yellow-400 bg-neutral-900 rounded-2xl shadow-2xl shadow-yellow-500/20 text-center animate-bounce-subtle"
    >
      <div class="text-6xl mb-4">🏆</div>
      <h2 class="text-3xl font-extrabold text-yellow-400 drop-shadow-md">CHAMPION!</h2>
      
      <div class="mt-6 flex flex-col items-center">
        <div class="text-5xl mb-2">{{ winner.emoji }}</div>
        <p class="text-xl">Du spielst in Midnight:</p>
        <p class="text-2xl font-bold mt-1" :class="`text-c-${winner.id}`">{{ winner.name }}</p>
        <p v-if="winner.name !== winner.className" class="text-sm text-neutral-500 uppercase font-bold">{{ winner.className }}</p>
      </div>

      <button 
        class="mt-8 btn-primary w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-transform hover:scale-105"
        @click="emit('close')"
      >
        NOCHMAL!
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}
</style>
