<script setup>
// Völker-Klassen-Tabelle für Retail oder Forever (Klassenübersicht und Ratgeber)
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const classes = computed(() => getClassList(props.mode))
const races = computed(() => getRaces(props.mode))
const factions = computed(() => ['alliance', 'horde', 'neutral'].filter(f => races.value.some(r => r.faction === f)))
const factionColor = { alliance: 'text-[#4a8cff]', horde: 'text-[#e83a3a]', neutral: 'text-neutral-300' }
const hasUpcoming = computed(() => races.value.some(r => r.upcomingClasses?.length))
</script>

<template>
  <div class="not-prose wow-frame !p-0">
    <!-- relative: sonst ragen die absolut positionierten sr-only-Texte aus dem Scrollbereich und verbreitern die Seite -->
    <div class="wow-scroll relative overflow-x-auto" tabindex="0" role="region" :aria-label="$t(`races.matrixTitle.${mode}`)">
      <table class="w-full text-center text-[14px]">
        <thead class="border-b border-gold-border/60">
          <tr>
            <th class="p-2 text-left font-display text-gold">{{ $t('races.race') }}</th>
            <th v-for="c in classes" :key="c.id" class="p-2" :title="$t(`classes.${c.id}.name`)">
              <img :src="c.icon" :alt="$t(`classes.${c.id}.name`)" width="28" height="28" class="mx-auto h-7 w-7 min-w-7 rounded-[3px]" />
            </th>
          </tr>
        </thead>
        <tbody v-for="f in factions" :key="f">
          <tr>
            <th :colspan="classes.length + 1" class="p-2 text-left font-display text-[13px] uppercase tracking-widest" :class="factionColor[f]">{{ $t(`races.factions.${f}`) }}</th>
          </tr>
          <tr v-for="r in races.filter(r => r.faction === f)" :key="r.id" class="border-t border-white/5">
            <th class="whitespace-nowrap p-2 text-left font-semibold text-neutral-200">{{ r.name[$i18n.locale] }}</th>
            <td v-for="c in classes" :key="c.id" class="p-2">
              <span v-if="r.newClasses?.includes(c.id)" class="font-bold text-quality-uncommon" :title="$t(`races.newCombo.${mode}`)"><span aria-hidden="true">✦</span><span class="sr-only">{{ $t(`races.newCombo.${mode}`) }}</span></span>
              <span v-else-if="r.classes.includes(c.id)" class="text-gold"><span aria-hidden="true">✓</span><span class="sr-only">{{ $t('races.available') }}</span></span>
              <span v-else-if="r.upcomingClasses?.includes(c.id)" class="text-neutral-400" :title="$t('races.upcoming')"><span aria-hidden="true">◇</span><span class="sr-only">{{ $t('races.upcoming') }}</span></span>
              <span v-else class="text-neutral-700"><span aria-hidden="true">–</span><span class="sr-only">{{ $t('races.unavailable') }}</span></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="border-t border-gold-border/40 px-3 py-2 text-[13px] text-neutral-400">
      <span class="font-bold text-quality-uncommon">✦</span> {{ $t(`races.newCombo.${mode}`) }}
      <template v-if="hasUpcoming"> · <span class="text-neutral-300">◇</span> {{ $t('races.upcoming') }}</template>
      · {{ $t(`races.note.${mode}`) }}
    </p>
  </div>
</template>
