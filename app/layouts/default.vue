<script setup>
const localePath = useLocalePath()
const { t } = useI18n()
const { mode, modeBase, routeName } = useGameMode()

// hreflang, canonical und lang-Attribut für alle Seiten
const i18nHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang, 'data-game': mode.value },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))

const navItems = computed(() => [
  { to: localePath(routeName('index')), label: t('nav.picker') },
  { to: localePath(routeName('klassen')), label: t('nav.classes') },
  { to: localePath(routeName('quiz')), label: t('nav.quiz') },
  { to: localePath(routeName('zufall')), label: t('nav.random') },
  { to: localePath('ratgeber'), label: t('nav.guides') }
])

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
watch(() => route.fullPath, () => { menuOpen.value = false })
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menuOpen.value = false
  })
})

const modes = computed(() => [
  { id: 'retail', label: 'Retail', sub: 'Midnight', to: switchTarget('retail') },
  { id: 'forever', label: 'Forever', sub: 'Classic+', to: switchTarget('forever') }
])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Tastatur: direkt zum Inhalt springen -->
    <a href="#inhalt" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-[4px] focus:border-2 focus:border-gold focus:bg-black focus:px-4 focus:py-2 focus:font-display focus:font-bold focus:text-gold">{{ $t('nav.skip') }}</a>

    <header class="md:sticky md:top-0 z-40 border-b-2 border-gold-border/70 bg-[#0b0805]/95 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
      <div class="max-w-6xl w-[92%] mx-auto flex items-center justify-between gap-x-6 pt-3 max-md:pb-3">
        <NuxtLink :to="localePath(routeName('index'))" class="flex items-center md:pb-3" aria-label="Find Your Main">
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
            :title="m.label + ' · ' + m.sub"
            @click="mode !== m.id && trackEvent('mode_switch', { from_mode: mode, to_mode: m.id })"
          >
            <GameLogo :mode="m.id" :height="46" eager :class="mode === m.id ? '' : 'opacity-60 grayscale-[60%]'" />
            <span class="font-display text-[11px] font-bold uppercase tracking-widest">{{ m.label }}</span>
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
          <LanguagePicker class="flex" />
          <button class="text-[15px] text-neutral-400 underline underline-offset-2" @click="$showCookieSettings?.()">{{ $t('footer.cookies') }}</button>
        </div>
      </div>

      <!-- Desktop: Hauptnavigation -->
      <div class="hidden border-t border-gold-border/40 bg-black/50 md:block">
        <div class="max-w-6xl w-[92%] mx-auto flex flex-wrap items-center justify-between gap-3 py-2">
          <nav :aria-label="$t('nav.menu')" class="flex flex-wrap items-center gap-x-5 font-display text-[15px] font-semibold">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="text-neutral-300 hover:text-gold transition-colors"
              active-class="!text-gold"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
          <div class="flex items-center gap-3">
            <ClientOnly><AchievementCounter /></ClientOnly>
            <LanguagePicker class="flex" />
          </div>
        </div>
      </div>
    </header>

    <div id="inhalt" class="flex-1" tabindex="-1">
      <slot />
    </div>

    <footer class="mt-20 border-t-2 border-gold-border/60 bg-black/60 text-neutral-400">
      <div class="max-w-6xl w-[92%] mx-auto py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <SiteLogo :mode="mode" small />
          <p class="mt-3 text-[15px]">{{ $t('footer.tagline') }}</p>
        </div>
        <div>
          <p class="font-display font-bold text-gold mb-2">Retail · Midnight</p>
          <ul class="space-y-1">
            <li><NuxtLink :to="localePath('index')" class="hover:text-gold">{{ $t('nav.picker') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('klassen')" class="hover:text-gold">{{ $t('nav.classes') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('quiz')" class="hover:text-gold">{{ $t('nav.quiz') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('zufall')" class="hover:text-gold">{{ $t('nav.random') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="font-display font-bold text-gold mb-2">WoW Forever</p>
          <ul class="space-y-1">
            <li><NuxtLink :to="localePath('forever')" class="hover:text-gold">{{ $t('nav.picker') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('forever-klassen')" class="hover:text-gold">{{ $t('nav.classes') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('forever-quiz')" class="hover:text-gold">{{ $t('nav.quiz') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('forever-zufall')" class="hover:text-gold">{{ $t('nav.random') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="font-display font-bold text-gold mb-2">{{ $t('footer.content') }}</p>
          <ul class="space-y-1">
            <li><NuxtLink :to="localePath('ratgeber')" class="hover:text-gold">{{ $t('nav.guides') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('ueber')" class="hover:text-gold">{{ $t('nav.about') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('impressum')" class="hover:text-gold">{{ $t('footer.imprint') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('datenschutz')" class="hover:text-gold">{{ $t('footer.privacy') }}</NuxtLink></li>
            <li><button class="hover:text-gold" @click="$showCookieSettings?.()">{{ $t('footer.cookies') }}</button></li>
            <li><NuxtLink :to="localePath('erfolge')" class="hover:text-gold">{{ $t('footer.achievements') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <p class="max-w-6xl w-[92%] mx-auto pb-10 text-xs text-neutral-500">
        {{ $t('footer.disclaimer') }}
        {{ $t('footer.madeBy') }} <a href="https://frysch.studio" class="underline hover:text-gold">frysch.studio</a>.
      </p>
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
