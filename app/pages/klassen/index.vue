<script setup>
definePageMeta({
  i18n: { paths: { de: '/klassen', en: '/classes' } }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: () => t('classesPage.title'),
  description: () => t('classesPage.description'),
  ogTitle: () => t('classesPage.heading')
})
</script>

<template>
  <main class="max-w-5xl w-[90%] mx-auto mt-8">
    <h1 class="text-3xl font-extrabold text-yellow-400">{{ $t('classesPage.heading') }}</h1>
    <p class="mt-3 text-neutral-300 max-w-3xl">{{ $t('classesPage.intro') }}</p>

    <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <ClassCard v-for="c in classInfo" :key="c.id" :class-id="c.id" />
    </div>

    <h2 class="mt-12 text-2xl font-extrabold text-yellow-400">{{ $t('classesPage.tableTitle') }}</h2>
    <div class="mt-4 overflow-x-auto rounded-lg border border-neutral-800">
      <table class="w-full text-sm text-left">
        <thead class="bg-neutral-900 text-neutral-200">
          <tr>
            <th class="p-3">{{ $t('nav.classes') }}</th>
            <th class="p-3">{{ $t('common.roles_label') }}</th>
            <th class="p-3">{{ $t('common.armorType') }}</th>
            <th class="p-3">{{ $t('common.specs') }}</th>
            <th class="p-3 whitespace-nowrap">{{ $t('common.difficulty') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in classInfo" :key="c.id" class="border-t border-neutral-800">
            <td class="p-3 font-bold whitespace-nowrap">
              <NuxtLink :to="localePath({ name: 'klassen-slug', params: { slug: c.slug[locale] } })" :style="{ color: c.color }" class="hover:underline">
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
    <p class="mt-3 text-xs text-neutral-500">{{ $t('common.ratingNote') }}</p>
  </main>
</template>
