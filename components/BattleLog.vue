<script setup>
const props = defineProps({
  logEntries: Array
})

const logRef = ref(null)

watch(() => props.logEntries.length, () => {
  nextTick(() => {
    if (logRef.value) {
      logRef.value.scrollTop = logRef.value.scrollHeight
    }
  })
})
</script>

<template>
  <div ref="logRef" id="battle-log" class="mt-5 bg-black text-green-400 font-mono p-4 h-40 overflow-y-auto text-left border border-neutral-800 rounded">
    <div 
      v-for="entry in logEntries" 
      :key="entry.id" 
      class="py-1 border-b border-neutral-900 last:border-b-0"
      :class="{
        'text-yellow-300 font-bold': entry.type === 'important',
        'text-cyan-400': entry.type === 'evade',
        'text-red-400': entry.type === 'damage',
        'text-green-400': entry.type === 'heal',
      }"
      v-html="'> ' + entry.message"
    ></div>
  </div>
</template>
