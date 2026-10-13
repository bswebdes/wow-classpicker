<script setup>
const props = defineProps({
  character: Object
})

const hpPercent = computed(() => Math.max(0, (props.character.hp / props.character.maxHp) * 100))
</script>

<template>
  <!-- Unit-Frame wie im Spiel: Portrait, Name, Lebensbalken -->
  <div
    :id="character.id"
    class="flex w-[150px] items-center gap-2 rounded-md border border-gold-border/70 bg-black/70 p-1.5 shadow-[inset_0_0_0_1px_#000] transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !character.alive, 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]': character.isShaking }"
  >
    <img :src="character.icon" :alt="character.className" width="44" height="44" class="h-11 w-11 shrink-0 rounded-full border-2 border-gold-border object-cover" />
    <div class="min-w-0 flex-1 text-left">
      <div class="truncate font-display text-[13px] font-bold" :class="`text-c-${character.classId}`" :title="character.name">{{ character.name }}</div>
      <div class="relative mt-0.5 h-3.5 overflow-hidden rounded-[2px] border border-black bg-neutral-800">
        <div class="h-full bg-gradient-to-b from-[#3cff3c] to-[#0a8a0a] transition-[width] duration-300" :style="{ width: hpPercent + '%' }" />
        <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white [text-shadow:1px_1px_0_#000]">{{ character.hp }} / {{ character.maxHp }}</span>
      </div>
      <div class="mt-0.5 h-4 truncate text-[11px] text-neutral-400">
        <i18n-t v-if="character.statusAbility" keypath="battle.status.using" scope="global">
          <template #ability>
            <a :href="character.statusAbility.url" target="_blank" rel="noopener" class="text-neutral-200 underline decoration-dotted underline-offset-2 hover:text-gold">{{ character.statusAbility.name }}</a>
          </template>
        </i18n-t>
        <template v-else>{{ character.status }}</template>
      </div>
    </div>
  </div>
</template>
