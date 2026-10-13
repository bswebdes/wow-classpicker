// Text in die Zwischenablage kopieren und kurz „kopiert“ anzeigen
export const useCopyText = () => {
  const copied = ref<string | null>(null)
  const { unlock } = useAchievements()
  let timer: ReturnType<typeof setTimeout> | undefined
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = text
      // Erfolg „Farbenlehre“, wenn eine Klassenfarbe kopiert wurde
      if (/^#[0-9a-f]{6}$/i.test(text)) unlock('color_theory')
      clearTimeout(timer)
      timer = setTimeout(() => { copied.value = null }, 1500)
    }
    catch { /* Zwischenablage nicht verfügbar */ }
  }
  return { copied, copy }
}
