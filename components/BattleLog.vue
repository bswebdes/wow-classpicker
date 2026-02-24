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
  <div ref="logRef" id="battle-log" class="battle-log">
    <div 
      v-for="entry in logEntries" 
      :key="entry.id" 
      class="log-entry" 
      :class="entry.type"
      v-html="'> ' + entry.message"
    ></div>
  </div>
</template>
