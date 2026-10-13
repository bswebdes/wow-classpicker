<script setup>
const localePath = useLocalePath()
const { t } = useI18n()

// hreflang, canonical und lang-Attribut für alle Seiten
const i18nHead = useLocaleHead({ seo: true })
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs.lang },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
}))

const navItems = computed(() => [
  { to: localePath('index'), label: t('nav.picker') },
  { to: localePath('klassen'), label: t('nav.classes') },
  { to: localePath('quiz'), label: t('nav.quiz') },
  { to: localePath('zufall'), label: t('nav.random') },
  { to: localePath('ratgeber'), label: t('nav.guides') }
])
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xs sticky top-0 z-40">
      <div class="max-w-5xl w-[90%] mx-auto flex flex-wrap items-center justify-between gap-3 py-3">
        <NuxtLink :to="localePath('index')" class="flex items-center gap-2 text-yellow-400 font-black tracking-tight" style="font-family: 'Permanent Marker', cursive;">
          <img src="/favicon.png" alt="" width="28" height="28" class="w-7 h-7" />
          <span>WoW Class Picker</span>
        </NuxtLink>
        <nav :aria-label="$t('nav.menu')" class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="text-neutral-300 hover:text-yellow-400 transition-colors"
            active-class="!text-yellow-400"
          >
            {{ item.label }}
          </NuxtLink>
          <LanguagePicker />
        </nav>
      </div>
    </header>

    <div class="flex-1">
      <slot />
    </div>

    <footer class="mt-16 border-t border-neutral-800 bg-neutral-950/60 text-sm text-neutral-400">
      <div class="max-w-5xl w-[90%] mx-auto py-8 grid gap-8 sm:grid-cols-3">
        <div>
          <p class="font-bold text-neutral-200 mb-2">WoW Class Picker</p>
          <p>{{ $t('footer.tagline') }}</p>
        </div>
        <div>
          <p class="font-bold text-neutral-200 mb-2">{{ $t('footer.tools') }}</p>
          <ul class="space-y-1">
            <li><NuxtLink :to="localePath('index')" class="hover:text-yellow-400">{{ $t('nav.picker') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('quiz')" class="hover:text-yellow-400">{{ $t('nav.quiz') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('zufall')" class="hover:text-yellow-400">{{ $t('nav.random') }}</NuxtLink></li>
          </ul>
        </div>
        <div>
          <p class="font-bold text-neutral-200 mb-2">{{ $t('footer.content') }}</p>
          <ul class="space-y-1">
            <li><NuxtLink :to="localePath('klassen')" class="hover:text-yellow-400">{{ $t('nav.classes') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('ratgeber')" class="hover:text-yellow-400">{{ $t('nav.guides') }}</NuxtLink></li>
          </ul>
        </div>
      </div>
      <p class="max-w-5xl w-[90%] mx-auto pb-8 text-xs text-neutral-500">{{ $t('footer.disclaimer') }}</p>
    </footer>
  </div>
</template>
