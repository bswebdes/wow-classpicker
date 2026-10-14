<script setup>
// Freiwillige Unterstützung per PayPal: einfache Links, kein PayPal-Skript (keine Daten vor dem Klick).
// PayPal.me übernimmt Betrag und Währung aus dem Link (…/5EUR), der Betrag bleibt dort änderbar.
defineProps({
  // „band“: schmale Leiste über dem Footer, sonst Kasten (z. B. auf der Über-uns-Seite)
  band: { type: Boolean, default: false }
})
const { locale } = useI18n()
const base = 'https://www.paypal.com/paypalme/benjay85'
// Deutsch in Euro, Englisch in US-Dollar
const currency = computed(() => locale.value === 'en' ? 'USD' : 'EUR')
const money = n => new Intl.NumberFormat(locale.value === 'en' ? 'en-US' : 'de-DE', { style: 'currency', currency: currency.value, maximumFractionDigits: 0 }).format(n)
const potions = [
  { key: 'small', amount: 1, size: 'h-6 w-6' },
  { key: 'normal', amount: 5, size: 'h-7 w-7' },
  { key: 'large', amount: 10, size: 'h-8 w-8' }
]
const track = amount => trackEvent('donate_click', { value: amount || 0, donation_currency: currency.value })
</script>

<template>
  <div
    class="not-prose rounded-md border border-gold-border/60 bg-gradient-to-b from-[#1f160b] to-[#0f0a05] shadow-[inset_0_0_0_1px_#000]"
    :class="band ? 'flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center' : 'my-6 p-4'"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <svg class="h-10 w-10 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12 3h8v2h-1v6.2l6.6 10.4A4.5 4.5 0 0 1 21.8 28H10.2a4.5 4.5 0 0 1-3.8-6.4L13 11.2V5h-1z" fill="#2a1d08" stroke="#c9a14a" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M9.2 20.5h13.6l1.4 2.2A2.6 2.6 0 0 1 21.8 26H10.2a2.6 2.6 0 0 1-2.4-3.3z" fill="#d6283c" />
        <circle cx="13.5" cy="22.5" r="1" fill="#ff8a96" />
        <circle cx="17.5" cy="23.8" r=".7" fill="#ff8a96" />
      </svg>
      <div class="min-w-0">
        <p class="font-display text-[15px] font-bold text-gold">{{ $t('support.title') }}</p>
        <p class="mt-0.5 text-[14px] text-neutral-300">{{ $t('support.text') }}</p>
      </div>
    </div>

    <div class="shrink-0">
      <p class="sr-only">{{ $t('support.pick') }}</p>
      <ul class="grid grid-cols-3 gap-2 sm:flex sm:justify-end">
        <li v-for="p in potions" :key="p.key">
          <a
            :href="`${base}/${p.amount}${currency}`"
            target="_blank"
            rel="noopener"
            class="potion-btn"
            :title="$t(`support.sizes.${p.key}`)"
            @click="track(p.amount)"
          >
            <svg :class="p.size" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M12 3h8v2h-1v6.2l6.6 10.4A4.5 4.5 0 0 1 21.8 28H10.2a4.5 4.5 0 0 1-3.8-6.4L13 11.2V5h-1z" fill="#2a1d08" stroke="#c9a14a" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M9.2 20.5h13.6l1.4 2.2A2.6 2.6 0 0 1 21.8 26H10.2a2.6 2.6 0 0 1-2.4-3.3z" fill="#d6283c" />
            </svg>
            <span class="font-display text-[15px] font-bold text-gold">{{ money(p.amount) }}</span>
            <span class="sr-only">{{ $t(`support.sizes.${p.key}`) }}, {{ $t('support.newTab') }}</span>
          </a>
        </li>
      </ul>
      <p class="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px] text-neutral-500 sm:justify-end">
        <a :href="base" target="_blank" rel="noopener" class="text-neutral-300 underline decoration-dotted underline-offset-2 hover:text-gold" @click="track(0)">
          {{ $t('support.custom') }} ›<span class="sr-only"> ({{ $t('support.newTab') }})</span>
        </a>
        <span>{{ $t('support.note') }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.potion-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  min-width: 4.5rem;
  height: 4.25rem;
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid var(--color-gold-border);
  background: linear-gradient(180deg, #3a2a12, #1a120a);
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.potion-btn:hover, .potion-btn:focus-visible {
  border-color: var(--color-gold);
  box-shadow: 0 0 12px rgba(214, 40, 60, 0.45);
  transform: translateY(-1px);
}
</style>
