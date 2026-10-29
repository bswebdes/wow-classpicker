// Namensgenerator: Name kopiert (wahrscheinlich genommen) oder gemeldet. Nach einigen Kopien wird ein Name nicht mehr
// vorgeschlagen; gemeldete Namen prüft der nächtliche Job (server/utils/namesGenerate.ts), erst dann fliegen sie raus.
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { action } = await readBody<{ action?: string }>(event) ?? {}
  if (!Number.isInteger(id) || id <= 0 || (action !== 'copy' && action !== 'report')) {
    throw createError({ statusCode: 400, statusMessage: 'invalid request' })
  }
  // Melden: höchstens 5 pro Stunde und IP, Kopieren großzügiger
  if (action === 'report') rateLimit(event, 'names-report', 5, 3_600_000)
  else rateLimit(event, 'names-copy', 30)
  return { ok: await markName(id, action) }
})
