<script setup>
// Teilen: auf dem Handy das System-Menü, sonst Link kopieren
const props = defineProps({
  url: { type: String, required: true },
  text: { type: String, required: true },
  label: { type: String, required: true },
  // Für das Statistik-Ereignis "share" (Umami)
  contentType: { type: String, required: true },
  itemId: { type: String, required: true }
})
const { copied, copy } = useCopyText()
const { unlock } = useAchievements()

const share = async () => {
  if (navigator.share) {
    try {
      await navigator.share({ text: props.text, url: props.url })
      trackEvent('share', { method: 'native', content_type: props.contentType, item_id: props.itemId })
      unlock('herald')
    }
    catch { /* abgebrochen */ }
    return
  }
  await copy(`${props.text} ${props.url}`)
  trackEvent('share', { method: 'copy_link', content_type: props.contentType, item_id: props.itemId })
  unlock('herald')
}
</script>

<template>
  <button type="button" class="wow-btn wow-btn-stone" @click="share">
    <span aria-hidden="true">↗</span> {{ copied ? $t('share.copied') : label }}
    <span class="sr-only" aria-live="polite">{{ copied ? $t('share.copied') : '' }}</span>
  </button>
</template>
