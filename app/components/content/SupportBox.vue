<script setup>
// Freiwillige Unterstützung per PayPal: einfacher Link, kein PayPal-Skript (keine Daten vor dem Klick)
defineProps({
  // „band“: schmale Leiste über dem Footer, sonst Kasten (z. B. auf der Über-uns-Seite)
  band: { type: Boolean, default: false }
})
const url = 'https://www.paypal.com/paypalme/benjay85'
</script>

<template>
  <div
    class="not-prose rounded-md border border-gold-border/60 bg-gradient-to-b from-[#1f160b] to-[#0f0a05] shadow-[inset_0_0_0_1px_#000]"
    :class="band ? 'flex flex-col items-center gap-3 px-5 py-4 text-center sm:flex-row sm:text-left' : 'my-6 p-4'"
  >
    <!-- Heiltrank als kleine Grafik statt Emoji (sieht überall gleich aus) -->
    <svg :class="band ? 'h-10 w-10 shrink-0' : 'mb-2 h-9 w-9'" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M12 3h8v2h-1v6.2l6.6 10.4A4.5 4.5 0 0 1 21.8 28H10.2a4.5 4.5 0 0 1-3.8-6.4L13 11.2V5h-1z" fill="#2a1d08" stroke="#c9a14a" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M9.2 20.5h13.6l1.4 2.2A2.6 2.6 0 0 1 21.8 26H10.2a2.6 2.6 0 0 1-2.4-3.3z" fill="#d6283c" />
      <circle cx="13.5" cy="22.5" r="1" fill="#ff8a96" />
      <circle cx="17.5" cy="23.8" r=".7" fill="#ff8a96" />
    </svg>
    <div class="min-w-0 flex-1">
      <p class="font-display text-[15px] font-bold text-gold">{{ $t('support.title') }}</p>
      <p class="mt-0.5 text-[14px] text-neutral-300">{{ $t('support.text') }}</p>
    </div>
    <div :class="band ? 'shrink-0 sm:text-right' : 'mt-3'">
      <a
        :href="url"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-2 rounded-[4px] border border-gold-border bg-gradient-to-b from-[#3a2a12] to-[#1a120a] px-4 py-2 font-display text-[14px] font-bold text-gold transition-colors hover:border-gold hover:text-white"
      >
        {{ $t('support.button') }}
        <span class="sr-only">({{ $t('support.newTab') }})</span>
      </a>
      <p class="mt-1.5 text-[12px] text-neutral-500">{{ $t('support.note') }}</p>
    </div>
  </div>
</template>
