<script setup>
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value)

const onLocaleChange = (code) => {
  setLocale(code)
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex gap-2">
    <button 
      v-for="l in availableLocales"
      :key="l.code"
      @click="onLocaleChange(l.code)"
      class="arcade-btn group !px-3 !py-2 !min-w-[50px] transition-all"
      :class="{ 'scale-110 ring-2 ring-yellow-400': locale === l.code, 'opacity-70 hover:opacity-100': locale !== l.code }"
      :title="l.name"
    >
      <span class="relative z-10 flex items-center justify-center">
        <!-- SVG Flagge statt Emoji -->
        <svg v-if="l.code === 'de'" class="w-6 h-4 shadow-sm" viewBox="0 0 5 3">
          <rect width="5" height="3" y="0" fill="#000"/>
          <rect width="5" height="2" y="1" fill="#D00"/>
          <rect width="5" height="1" y="2" fill="#FFCE00"/>
        </svg>
        <svg v-else-if="l.code === 'en'" class="w-6 h-4 shadow-sm" viewBox="0 0 7410 3900">
          <rect width="7410" height="3900" fill="#3C3B6E"/>
          <path d="M0,450H7410M0,1050H7410M0,1650H7410M0,2250H7410M0,2850H7410M0,3450H7410" stroke="#FFF" stroke-width="300"/>
          <path d="M0,150H7410M0,750H7410M0,1350H7410M0,1950H7410M0,2550H7410M0,3150H7410M0,3750H7410" stroke="#B22234" stroke-width="300"/>
          <rect width="2964" height="2100" fill="#3C3B6E"/>
          <g fill="#FFF">
            <g id="s18">
              <g id="s9">
                <g id="s5">
                  <g id="s">
                    <path id="v" d="M247,90 317.53423,307.08204 132.87322,172.91796H361.12678L176.46577,307.08204z"/>
                  </g>
                  <use xlink:href="#s" x="494"/>
                  <use xlink:href="#s" x="988"/>
                  <use xlink:href="#s" x="1482"/>
                  <use xlink:href="#s" x="1976"/>
                </g>
                <use xlink:href="#s5" x="247" y="150"/>
              </g>
              <use xlink:href="#s9" y="300"/>
            </g>
            <use xlink:href="#s18" y="600"/>
            <use xlink:href="#s9" y="1200"/>
            <use xlink:href="#s5" y="1350"/>
          </g>
        </svg>
      </span>
      <div 
        class="absolute inset-0 transform skew-x-[-12deg] transition-colors"
        :class="l.code === 'de' ? 'bg-red-700 group-hover:bg-red-600' : 'bg-blue-700 group-hover:bg-blue-600'"
      ></div>
    </button>
  </div>
</template>

<style scoped>
.arcade-btn {
  /* Kleine Anpassungen für den Picker */
  border: none;
}
</style>
