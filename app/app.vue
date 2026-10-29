<template>
  <NuxtLayout>
    <!-- Seitenwechsel weich überblenden (CSS .page-* in tailwind.css) -->
    <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
  </NuxtLayout>
</template>
