<script setup>
const localePath = useLocalePath()
const { t, locale } = useI18n()
const { mode, modeBase, routeName } = useGameMode()

// hreflang, canonical und lang-Attribut für alle Seiten
const i18nHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang, 'data-game': mode.value },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))

const navItems = computed(() => [
  { key: 'index', icon: 'arena', to: localePath(routeName('index')), label: t('nav.picker'), short: t('nav.short.picker') },
  { key: 'klassen', icon: 'classes', to: localePath(routeName('klassen')), label: t('nav.classes'), short: t('nav.short.classes') },
  { key: 'quiz', icon: 'quiz', to: localePath(routeName('quiz')), label: t('nav.quiz'), short: t('nav.short.quiz') },
  { key: 'zufall', icon: 'random', to: localePath(routeName('zufall')), label: t('nav.random'), short: t('nav.short.random') },
  { key: 'ratgeber', icon: 'guides', to: localePath('ratgeber'), label: t('nav.guides'), short: t('nav.short.guides') }
])

// Aktiver Menüpunkt, auch auf Unterseiten (Klassen- und Spec-Seiten, Vergleiche, einzelne Ratgeber)
const getRouteBaseName = useRouteBaseName()
const activeKey = computed(() => {
  const name = String(getRouteBaseName(route) || '').replace(/^forever-?/, '') || 'index'
  if (name.startsWith('klassen')) return 'klassen'
  if (name.startsWith('ratgeber')) return 'ratgeber'
  return name
})

// Klassen-Menü am Desktop: öffnet bei Hover und Tastaturfokus, schließt nach einem Klick
const megaClosed = ref(false)
const megaClasses = computed(() => getClassList(mode.value))
const nuxtApp = useNuxtApp()
const footerColumns = computed(() => [
  {
    title: 'Retail · Midnight',
    links: [
      { to: localePath('index'), label: t('nav.picker') },
      { to: localePath('klassen'), label: t('nav.classes') },
      { to: localePath('quiz'), label: t('nav.quiz') },
      { to: localePath('zufall'), label: t('nav.random') },
      { to: localePath('klassen-vergleich'), label: t('compare.nav') }
    ]
  },
  {
    title: 'WoW Forever',
    links: [
      { to: localePath('forever'), label: t('nav.picker') },
      { to: localePath('forever-klassen'), label: t('nav.classes') },
      { to: localePath('forever-quiz'), label: t('nav.quiz') },
      { to: localePath('forever-zufall'), label: t('nav.random') },
      { to: localePath('forever-klassen-vergleich'), label: t('compare.nav') }
    ]
  },
  {
    title: t('footer.content'),
    links: [
      { to: localePath('ratgeber'), label: t('nav.guides') },
      { to: localePath('erfolge'), label: t('footer.achievements') },
      { to: localePath('ueber'), label: t('nav.about') },
      { to: localePath('impressum'), label: t('footer.imprint') },
      { to: localePath('datenschutz'), label: t('footer.privacy') },
      { label: t('footer.cookies'), action: () => nuxtApp.$showCookieSettings?.() }
    ]
  }
])
const classPath = c => localePath({ name: routeName('klassen-slug'), params: { slug: c.slug[locale.value] } })

// Ziel im anderen Modus: gleiche Seite, falls es sie dort gibt, sonst Startseite
const route = useRoute()
const switchTarget = (target) => {
  const base = modeBase.value
  if (!base) return localePath(routeNameFor('index', target))
  if (base === 'klassen-slug') {
    const exists = getClassList(target).some(c => Object.values(c.slug).includes(String(route.params.slug)))
    return exists
      ? localePath({ name: routeNameFor('klassen-slug', target), params: { slug: route.params.slug } })
      : localePath(routeNameFor('klassen', target))
  }
  return localePath(routeNameFor(base, target))
}

// Mobiles Menü: schließt bei Seitenwechsel und mit Escape
const menuOpen = ref(false)
watch(() => route.fullPath, () => {
  menuOpen.value = false
  megaClosed.value = true
  if (import.meta.client) document.activeElement?.blur?.()
})
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menuOpen.value = false
  })
})

// Modus-Reiter zeigen den Spielstand, auf dem die Inhalte beruhen (app/utils/gameVersion.ts)
const modes = computed(() => [
  { id: 'retail', label: 'Retail', sub: `Midnight · ${gameVersion.retail.patch}`, short: gameVersion.retail.patch, version: versionLabel('retail', locale.value), to: switchTarget('retail') },
  { id: 'forever', label: 'Forever', sub: versionLabel('forever', locale.value), short: gameVersion.forever.status === 'live' ? gameVersion.forever.patch : 'Beta', version: versionLabel('forever', locale.value), to: switchTarget('forever') }
])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Tastatur: direkt zum Inhalt springen -->
    <a href="#inhalt" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-[4px] focus:border-2 focus:border-gold focus:bg-black focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:text-gold">{{ $t('nav.skip') }}</a>

    <header class="md:sticky md:top-0 z-40 border-b-2 border-gold-border/70 bg-[#0b0805]/95 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
      <div class="max-w-6xl w-[92%] mx-auto flex items-center justify-between gap-x-6 pt-3 max-md:pb-3">
        <NuxtLink :to="localePath(routeName('index'))" class="flex items-center md:pb-3">
          <span class="md:hidden"><SiteLogo :mode="mode" small /></span>
          <span class="hidden md:block"><SiteLogo :mode="mode" /></span>
        </NuxtLink>

        <!-- Desktop: Umschalter Retail / Forever im Stil der Reiter am Charakterfenster -->
        <nav :aria-label="$t('nav.gameMode')" class="hidden items-end gap-1 self-end md:flex">
          <NuxtLink
            v-for="m in modes"
            :key="m.id"
            :to="m.to"
            class="flex flex-col items-center rounded-t-md border-2 border-b-0 px-2.5 pt-1 pb-0.5 transition-all"
            :class="mode === m.id
              ? 'border-gold-border bg-gradient-to-b from-[#3a2a12] to-[#1a120a] text-gold'
              : 'border-neutral-700 bg-neutral-900/80 text-neutral-400 hover:text-gold-light'"
            :aria-current="mode === m.id ? 'page' : undefined"
            :title="`${m.label} · ${m.version}`"
            @click="mode !== m.id && trackEvent('mode_switch', { from_mode: mode, to_mode: m.id })"
          >
            <GameLogo :mode="m.id" :height="46" eager :class="mode === m.id ? '' : 'opacity-60 grayscale-[60%]'" />
            <span class="font-display text-[11px] font-bold uppercase tracking-widest">{{ m.label }}</span>
            <span class="text-[10px] leading-none tracking-wide opacity-80">{{ m.short }}</span>
          </NuxtLink>
        </nav>

        <!-- Mobil: Erfolge und Menü-Button -->
        <div class="flex items-center gap-2 md:hidden">
          <ClientOnly><AchievementCounter /></ClientOnly>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold-border/70 bg-black/60 text-gold"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            :aria-label="menuOpen ? $t('nav.closeMenu') : $t('nav.openMenu')"
            @click="menuOpen = !menuOpen"
          >
            <svg v-if="!menuOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      <!-- Mobil: Spielmodus immer sichtbar, zwei gleich breite Reiter -->
      <nav :aria-label="$t('nav.gameMode')" class="grid grid-cols-2 gap-1.5 px-3 md:hidden">
        <NuxtLink
          v-for="m in modes"
          :key="m.id"
          :to="m.to"
          class="flex items-center justify-center gap-2 rounded-t-md border-2 border-b-0 py-1.5"
          :class="mode === m.id
            ? 'border-gold-border bg-gradient-to-b from-[#3a2a12] to-[#1a120a] text-gold'
            : 'border-neutral-700 bg-neutral-900/80 text-neutral-400'"
          :aria-current="mode === m.id ? 'page' : undefined"
          @click="mode !== m.id && trackEvent('mode_switch', { from_mode: mode, to_mode: m.id })"
        >
          <GameLogo :mode="m.id" :height="30" eager :class="mode === m.id ? '' : 'opacity-60 grayscale-[60%]'" />
          <span class="flex flex-col leading-tight">
            <span class="font-display text-[13px] font-bold uppercase tracking-wider">{{ m.label }}</span>
            <span class="text-[11px] uppercase tracking-widest opacity-70">{{ m.sub }}</span>
          </span>
        </NuxtLink>
      </nav>

      <!-- Mobil: aufklappbares Menü -->
      <div v-if="menuOpen" id="mobile-menu" class="border-t border-gold-border/60 bg-[#0b0805] md:hidden">
        <nav :aria-label="$t('nav.menu')">
          <ul>
            <li v-for="item in navItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="flex items-center justify-between border-b border-white/5 px-5 py-3.5 font-display text-[17px] font-semibold text-neutral-200"
                active-class="!text-gold bg-gold/5"
              >
                {{ item.label }}
                <span class="text-gold-dark" aria-hidden="true">›</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('erfolge')" class="flex items-center justify-between border-b border-white/5 px-5 py-3.5 font-display text-[17px] font-semibold text-neutral-200" active-class="!text-gold bg-gold/5">
                {{ $t('footer.achievements') }}
                <span class="text-gold-dark" aria-hidden="true">›</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="flex items-center justify-between gap-3 px-5 py-3">
          <LanguagePicker class="flex" full />
          <button class="text-[15px] text-neutral-400 underline underline-offset-2" @click="$showCookieSettings?.()">{{ $t('footer.cookies') }}</button>
        </div>
      </div>

      <!-- Desktop: Hauptnavigation als Reiterleiste -->
      <div class="hidden border-t border-gold-border/40 bg-gradient-to-b from-black/70 to-black/40 md:block">
        <div class="max-w-6xl w-[92%] mx-auto flex items-center justify-between gap-3">
          <nav :aria-label="$t('nav.menu')" class="flex items-stretch font-display text-[15px] font-semibold">
            <template v-for="item in navItems" :key="item.key">
              <!-- Klassen mit Megamenü -->
              <!-- Unter lg richtet sich das Menü am Header aus, damit es nicht rechts übersteht -->
              <div v-if="item.key === 'klassen'" class="group flex lg:relative" @mouseleave="megaClosed = false">
                <NuxtLink
                  :to="item.to"
                  class="nav-tab"
                  :class="activeKey === item.key && 'nav-tab-active'"
                  :aria-current="activeKey === item.key ? 'page' : undefined"
                  aria-haspopup="true"
                >
                  <NavIcon :name="item.icon" class="hidden lg:block" />
                  <span class="lg:hidden">{{ item.short }}</span><span class="hidden lg:inline">{{ item.label }}</span>
                  <NavIcon name="chevron" :size="14" class="opacity-60 transition-transform group-hover:rotate-180" />
                </NuxtLink>
                <div
                  class="mega-panel absolute left-[4%] top-full lg:left-0 z-50 hidden w-[min(44rem,88vw)] pt-1 group-focus-within:block group-hover:block"
                  :class="megaClosed && '!hidden'"
                >
                  <div class="wow-frame !bg-[#120d07] !p-4">
                    <p class="mb-3 font-display text-[12px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                      {{ mode === 'forever' ? `${$t('nav.classes')} · WoW Forever` : `${$t('nav.classes')} · WoW Midnight` }}
                    </p>
                    <ul class="grid grid-cols-3 gap-1 lg:grid-cols-4">
                      <li v-for="c in megaClasses" :key="c.id">
                        <NuxtLink :to="classPath(c)" class="flex items-center gap-2.5 rounded-[4px] px-2 py-1.5 transition-colors hover:bg-white/[0.06]" @click="megaClosed = true">
                          <img :src="c.icon" alt="" width="28" height="28" class="wow-slot h-7 w-7 !border" loading="lazy" />
                          <span class="font-display text-[14px] font-bold" :style="{ color: c.color }">{{ $t(`classes.${c.id}.name`) }}</span>
                        </NuxtLink>
                      </li>
                    </ul>
                    <div class="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-gold-border/40 pt-3 font-sans text-[15px] font-normal">
                      <NuxtLink :to="item.to" class="flex items-center gap-1.5 text-gold hover:text-gold-light" @click="megaClosed = true"><NavIcon name="classes" :size="16" /> {{ $t('common.allClasses') }} ›</NuxtLink>
                      <NuxtLink :to="localePath(routeName('klassen-vergleich'))" class="flex items-center gap-1.5 text-neutral-300 hover:text-gold" @click="megaClosed = true"><NavIcon name="compare" :size="16" /> {{ $t('compare.nav') }} ›</NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
              <NuxtLink
                v-else
                :to="item.to"
                class="nav-tab"
                :class="activeKey === item.key && 'nav-tab-active'"
                :aria-current="activeKey === item.key ? 'page' : undefined"
              >
                <NavIcon :name="item.icon" class="hidden lg:block" />
                <span class="lg:hidden">{{ item.short }}</span><span class="hidden lg:inline">{{ item.label }}</span>
              </NuxtLink>
            </template>
          </nav>
          <div class="flex items-center gap-3 py-2">
            <ClientOnly><AchievementCounter /></ClientOnly>
            <LanguagePicker class="flex" />
          </div>
        </div>
      </div>
    </header>

    <div id="inhalt" class="flex-1" tabindex="-1">
      <slot />
    </div>

    <!-- Freiwillige Unterstützung: eigenes, ruhiges Band über dem Footer -->
    <aside class="max-w-4xl w-[92%] mx-auto mt-20" :aria-label="$t('support.title')">
      <SupportBox band />
    </aside>

    <footer class="site-footer mt-16 text-neutral-400">
      <!-- Ornament: Linie mit Wappen in der Mitte -->
      <div class="relative flex items-center justify-center" aria-hidden="true">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent via-gold-border to-gold-border" />
        <span class="mx-4 -my-8 rounded-full border-2 border-gold-border bg-[#0b0805] p-2.5 shadow-[0_0_24px_rgba(255,209,0,0.15)]"><SiteLogoCrest :mode="mode" /></span>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent via-gold-border to-gold-border" />
      </div>

      <div class="max-w-6xl w-[92%] mx-auto pt-12">
        <!-- Alle Klassen auf einen Blick, je Spielmodus -->
        <nav :aria-label="$t('footer.allClasses')" class="text-center">
          <p class="font-display text-[12px] font-bold uppercase tracking-[0.3em] text-neutral-500">{{ $t('footer.allClasses') }} · {{ mode === 'forever' ? 'WoW Forever' : 'WoW Midnight' }}</p>
          <ul class="mt-4 flex flex-wrap justify-center gap-2">
            <li v-for="c in megaClasses" :key="c.id">
              <NuxtLink :to="classPath(c)" class="footer-class block" :title="$t(`classes.${c.id}.name`)" :style="{ '--c': c.color }">
                <img :src="c.icon" :alt="$t(`classes.${c.id}.name`)" width="40" height="40" class="wow-slot h-10 w-10" loading="lazy" />
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div class="col-span-2 lg:col-span-1">
            <SiteLogo :mode="mode" small />
            <p class="mt-4 text-[15px] leading-relaxed">{{ $t('footer.tagline') }}</p>
          </div>
          <div v-for="col in footerColumns" :key="col.title">
            <p class="footer-heading">{{ col.title }}</p>
            <ul class="mt-3 space-y-1.5">
              <li v-for="l in col.links" :key="l.label">
                <NuxtLink v-if="l.to" :to="l.to" class="footer-link">{{ l.label }}</NuxtLink>
                <button v-else class="footer-link" @click="l.action()">{{ l.label }}</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-12 border-t border-gold-border/30 bg-black/50">
        <div class="max-w-6xl w-[92%] mx-auto flex flex-col gap-4 pt-6 pb-20 text-xs text-neutral-500 sm:flex-row sm:pb-6 sm:items-center sm:justify-between">
          <p>
            {{ $t('footer.disclaimer') }}
            {{ $t('footer.madeBy') }} <a href="https://frysch.studio" class="underline hover:text-gold">frysch.studio</a>.
          </p>
          <a href="#" class="flex shrink-0 items-center gap-1.5 self-start font-display text-[13px] font-bold uppercase tracking-wider text-gold-dark hover:text-gold sm:self-auto">
            <NavIcon name="arrowUp" :size="16" /> {{ $t('footer.toTop') }}
          </a>
        </div>
      </div>
    </footer>

    <ClientOnly>
      <AchievementToast />
      <!-- Cookie-Einstellungen jederzeit wieder öffnen -->
      <button
        class="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold-border bg-[#120d07]/90 text-gold shadow-[0_4px_12px_rgba(0,0,0,0.7)] transition-colors hover:border-gold"
        :aria-label="$t('footer.cookies')"
        :title="$t('footer.cookies')"
        @click="$showCookieSettings?.()"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-3.5 7a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-1 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
        </svg>
      </button>
    </ClientOnly>
  </div>
</template>
