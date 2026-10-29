// v-reveal: Element gleitet beim ersten Sichtbarwerden leicht herein (CSS in tailwind.css, .reveal).
// v-reveal="i" verzögert um i × 60 ms (für Listen). Ohne JavaScript, beim Vorrendern und bei
// „Bewegung reduzieren“ bleibt alles sofort sichtbar; was beim Laden schon im Bild ist, wird nicht ausgeblendet.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, { value }) {
      if (typeof IntersectionObserver === 'undefined' || reduced()) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) return
      el.style.setProperty('--reveal-delay', `${Math.min(value ?? 0, 8) * 60}ms`)
      el.classList.add('reveal')
      observer ||= new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-visible')
          observer!.unobserve(e.target)
        }
      }, { rootMargin: '0px 0px -8% 0px' })
      observer.observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    }
  })
})
