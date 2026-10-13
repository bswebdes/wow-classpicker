<script setup>
const props = defineProps({
  mode: { type: String, default: 'retail' }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()
const classes = computed(() => getClassList(props.mode))
const k = (key) => props.mode === 'forever' ? `forever.classes.${key}` : `classesPage.${key}`

usePageSeo({
  title: () => t(k('title')),
  description: () => t(k('description')),
  ogTitle: () => t(k('heading')),
  mode: props.mode,
  pageType: 'CollectionPage'
})

useSchemaOrg([
  defineItemList({
    itemListElement: classes.value.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t(`classes.${c.id}.name`),
      url: localePath({ name: routeNameFor('klassen-slug', props.mode), params: { slug: c.slug[locale.value] } })
    }))
  })
])

const factions = ['alliance', 'horde']
</script>

<template>
  <main class="max-w-5xl w-[92%] mx-auto mt-10">
    <h1 class="wow-title text-3xl sm:text-4xl">{{ $t(k('heading')) }}</h1>
    <p class="mt-3 max-w-3xl text-neutral-300">{{ $t(k('intro')) }}</p>

    <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ClassCard v-for="c in classes" :key="c.id" :class-id="c.id" :mode="mode" />
    </div>

    <h2 class="wow-title mt-14 text-2xl">{{ $t('classesPage.tableTitle') }}</h2>
    <div class="wow-frame mt-4 wow-scroll overflow-x-auto !p-0" tabindex="0" role="region" :aria-label="$t('classesPage.tableTitle')">
      <table class="w-full text-left text-[15px]">
        <thead class="border-b border-gold-border/60 font-display text-gold">
          <tr>
            <th class="p-3">{{ $t('nav.classes') }}</th>
            <th class="p-3">{{ $t('common.roles_label') }}</th>
            <th class="p-3">{{ $t('common.armorType') }}</th>
            <th class="p-3">{{ mode === 'forever' ? $t('forever.talentTrees') : $t('common.specs') }}</th>
            <th class="p-3 whitespace-nowrap">{{ $t('common.difficulty') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in classes" :key="c.id" class="border-t border-white/5">
            <td class="p-3 font-display font-bold whitespace-nowrap">
              <NuxtLink :to="localePath({ name: routeNameFor('klassen-slug', mode), params: { slug: c.slug[locale] } })" :style="{ color: c.color }" class="hover:underline">
                {{ $t(`classes.${c.id}.name`) }}
              </NuxtLink>
            </td>
            <td class="p-3 text-neutral-300">{{ classRoles(c).map(r => $t(`common.roles.${r}`)).join(', ') }}</td>
            <td class="p-3 text-neutral-300">{{ $t(`common.armor.${c.armor}`) }}</td>
            <td class="p-3 text-neutral-300">{{ c.specs.map(s => s.name[locale]).join(', ') }}</td>
            <td class="p-3"><RatingDots :value="6 - c.difficulty" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-[13px] text-neutral-500">{{ $t('common.ratingNote') }}</p>

    <!-- Forever: Völker-Klassen-Matrix -->
    <template v-if="mode === 'forever'">
      <h2 id="voelker" class="wow-title mt-14 text-2xl">{{ $t('forever.classes.matrixTitle') }}</h2>
      <p class="mt-3 max-w-3xl text-neutral-300">{{ $t('forever.classes.matrixIntro', { count: foreverComboCount }) }}</p>
      <div class="wow-frame mt-4 wow-scroll overflow-x-auto !p-0" tabindex="0" role="region" :aria-label="$t('forever.classes.matrixTitle')">
        <table class="w-full text-center text-[14px]">
          <thead class="border-b border-gold-border/60">
            <tr>
              <th class="p-2 text-left font-display text-gold">{{ $t('forever.race') }}</th>
              <th v-for="c in classes" :key="c.id" class="p-2" :title="$t(`classes.${c.id}.name`)">
                <img :src="c.icon" :alt="$t(`classes.${c.id}.name`)" width="28" height="28" class="mx-auto h-7 w-7 rounded-[3px]" />
              </th>
            </tr>
          </thead>
          <tbody v-for="f in factions" :key="f">
            <tr>
              <th :colspan="classes.length + 1" class="p-2 text-left font-display text-[13px] uppercase tracking-widest" :class="f === 'alliance' ? 'text-[#4a8cff]' : 'text-[#e83a3a]'">{{ $t(`forever.factions.${f}`) }}</th>
            </tr>
            <tr v-for="r in foreverRaces.filter(r => r.faction === f)" :key="r.id" class="border-t border-white/5">
              <th class="p-2 text-left font-semibold text-neutral-200 whitespace-nowrap">{{ r.name[locale] }}</th>
              <td v-for="c in classes" :key="c.id" class="p-2">
                <span v-if="r.newClasses?.includes(c.id)" class="font-bold text-quality-uncommon" :title="$t('forever.newCombo')">✦</span>
                <span v-else-if="r.classes.includes(c.id)" class="text-gold" aria-label="✓">✓</span>
                <span v-else class="text-neutral-700" aria-label="–">–</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-[13px] text-neutral-400"><span class="font-bold text-quality-uncommon">✦</span> {{ $t('forever.newCombo') }} · {{ $t('forever.betaNote') }}</p>
    </template>

    <ContentBlock :name="mode === 'forever' ? 'forever-classes' : 'classes'" class="mt-12" />
  </main>
</template>
