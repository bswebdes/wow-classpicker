// Nächtlicher Job für den Namensgenerator (Zeitplan in nuxt.config.ts → nitro.scheduledTasks):
// erst gemeldete Namen prüfen, dann den Vorrat auffüllen. Payload maxNames erlaubt einen größeren Lauf (Startvorrat).
export default defineTask({
  meta: { name: 'names:refill', description: 'Gemeldete Namen prüfen und Namensvorrat mit Claude Haiku auffüllen' },
  async run({ payload }) {
    const review = await reviewReported().catch(e => ({ error: String(e) }))
    const maxNames = Number(payload?.maxNames) || undefined
    const refill = await refillNames({ maxNames })
    console.log('[names] Prüfung', review, 'Nachschub', refill)
    return { result: { review, refill } }
  }
})
