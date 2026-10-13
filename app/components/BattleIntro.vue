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
        <div class="absolute inset-0 bg-amber-500 blur-[100px] opacity-25 scale-150"></div>
        
        <div 
          class="relative font-display text-6xl md:text-8xl font-black uppercase tracking-wide drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
          :class="stage === t('battle.fight') ? 'text-[#ff2a2a]' : 'wow-title'"
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
