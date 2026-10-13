// Text in die Zwischenablage kopieren und kurz „kopiert“ anzeigen
export const useCopyText = () => {
  const copied = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = text
      clearTimeout(timer)
      timer = setTimeout(() => { copied.value = null }, 1500)
    }
    catch { /* Zwischenablage nicht verfügbar */ }
  }
  return { copied, copy }
}
