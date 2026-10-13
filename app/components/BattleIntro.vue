<script setup>
const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    default: 'battle' // 'battle' (READY/FIGHT) oder 'selection' (Wähle deine Kämpfer)
  }
})

const emit = defineEmits(['finished'])

const stage = ref('')
const words = ref([])
const currentWordIndex = ref(-1)
const visible = ref(false)

const { t, tm, rt } = useI18n()

watch(() => props.show, (newVal) => {
  if (newVal) {
    runSequence()
  }
}, { immediate: true })

async function runSequence() {
  visible.value = true
  
  if (props.mode === 'selection') {
    words.value = tm('battle.selectionWords').map(w => rt(w))
  } else {
    words.value = [t('battle.ready'), t('battle.fight')]
  }

  for (let i = 0; i < words.value.length; i++) {
    currentWordIndex.value = i
    stage.value = words.value[i]
    
    // Kurze Pause zwischen den Wörtern
    const delay = props.mode === 'selection' ? 600 : 1000
    await new Promise(r => setTimeout(r, delay))
  }
  
  visible.value = false
  currentWordIndex.value = -1
  emit('finished')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-150"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-50"
  >
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden">
      <div class="relative">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-red-600 blur-[100px] opacity-30 scale-150"></div>
        
        <div 
          class="relative text-8xl md:text-9xl font-black italic tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
          :class="stage === t('battle.ready') ? 'text-yellow-400' : 'text-red-600'"
          style="font-family: 'Permanent Marker', cursive;"
        >
          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-x-full opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0"
          >
            <span :key="stage" class="block">{{ stage }}</span>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
span {
  text-shadow: 4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000;
}
</style>
