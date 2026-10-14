// Zählt Seitenbesuche für Erfolge (Klassenseiten, Ratgeber, Forever, Rechtstexte …)
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const getRouteBaseName = useRouteBaseName()
  const { unlock, addToSet } = useAchievements()
  const t = achievementThresholds

  const handle = (to: ReturnType<typeof useRoute>) => {
    const name = String(getRouteBaseName(to) || '')
    if (addToSet('pages', name + JSON.stringify(to.params)) >= t.pages) unlock('first_steps')

    if (name === 'klassen-slug') {
      const size = addToSet('retailClasses', String(to.params.slug))
      if (size >= t.classPages) unlock('class_tourist')
      if (size >= getClassList('retail').length) unlock('all_classes')
    }
    if (name === 'forever-klassen-slug' && addToSet('retailClasses', `forever:${to.params.slug}`) >= t.classPages) unlock('class_tourist')
    if (name === 'klassen-slug-spec') {
      const slug = String(to.params.slug), specParam = String(to.params.spec)
      if (addToSet('specs', `${slug}/${specParam}`) >= t.specPages) unlock('spec_scholar')
      const found = getSpecBySlug(slug, specParam, 'de') || getSpecBySlug(slug, specParam, 'en')
      if (found?.cls.id === 'druid' && addToSet('druidSpecs', found.spec.id) >= 4) unlock('shapeshifter')
      if (found?.spec.id === 'devourer') unlock('void_touched')
    }
    if (name === 'forever' || name.startsWith('forever-')) unlock('forever')
    if (name === 'ratgeber-slug') {
      const guides = addToSet('guides', String(to.params.slug))
      if (guides >= t.guides) unlock('reader')
      if (guides >= t.guidesMany) unlock('bookworm')
    }
    if ((name === 'klassen-vergleich-pair' || name === 'forever-klassen-vergleich-pair') && addToSet('comparisons', `${name}:${to.params.pair}`) >= t.comparisons) unlock('comparer')
    if (name === 'impressum' || name === 'datenschutz') unlock('fine_print')
  }

  router.afterEach(to => handle(to as ReturnType<typeof useRoute>))
  // Einstiegsseite mitzählen
  nuxtApp.hook('app:mounted', () => handle(router.currentRoute.value as ReturnType<typeof useRoute>))

  nuxtApp.hook('i18n:localeSwitched', () => unlock('polyglot'))

  // Stammgast: Besuche an verschiedenen Tagen (zählt nur dauerhaft, wenn Erfolge gespeichert werden dürfen)
  nuxtApp.hook('app:mounted', () => {
    const d = new Date()
    const day = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    if (addToSet('days', day) >= t.days) unlock('regular')
  })

  // Nachtschwärmer: Besuch zwischen Mitternacht und 4 Uhr
  const hour = new Date().getHours()
  if (hour < 4) setTimeout(() => unlock('night_owl'), 4000)
})
