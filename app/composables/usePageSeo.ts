interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  // Text im generierten OG-Bild, fällt auf den Title zurück
  ogTitle?: MaybeRefOrGetter<string | undefined>
  ogSubtitle?: MaybeRefOrGetter<string | undefined>
  // Klassen-IDs, deren Icons im OG-Bild erscheinen
  classes?: MaybeRefOrGetter<string[] | undefined>
}

export const usePageSeo = (options: PageSeoOptions) => {
  useSeoMeta({
    title: () => toValue(options.title),
    ogTitle: () => toValue(options.title),
    description: () => toValue(options.description),
    ogDescription: () => toValue(options.description),
    twitterCard: 'summary_large_image'
  })

  defineOgImage('ClassPicker', {
    title: toValue(options.ogTitle) || toValue(options.title),
    subtitle: toValue(options.ogSubtitle) || toValue(options.description),
    classes: toValue(options.classes) || []
  })
}
