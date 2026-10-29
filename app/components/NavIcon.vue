<script setup>
// Kleine Strich-Icons für Navigation, Footer und Werkzeug-Karten (erben die Textfarbe)
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 18 }
})

const paths = {
  // Gekreuzte Schwerter
  arena: 'M4 4l9 9M4 4v3l8.5 8.5M4 4h3l8.5 8.5M20 4l-9 9M20 4v3l-4 4M20 4h-3l-4 4M14 17l3 3M17 14l3 3M10 17l-3 3M7 14l-3 3M13.5 15.5l2-2M10.5 15.5l-2-2',
  // Wappenschild
  classes: 'M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3zM12 8v8M8.5 11.5h7',
  // Schriftrolle mit Fragezeichen
  quiz: 'M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2zM10 9.5a2 2 0 113 1.7c-.7.4-1 .9-1 1.6M12 16v.01',
  // Würfel
  random: 'M5 5h14v14H5zM9 9v.01M15 9v.01M12 12v.01M9 15v.01M15 15v.01',
  // Aufgeschlagenes Buch
  guides: 'M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5M12 6c2-1.5 5-2 8-1.5V19c-3-.5-6 0-8 1.5M12 6v14.5',
  // Waage
  compare: 'M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 005 0L5 7zM19 7l-2.5 6a2.5 2.5 0 005 0L19 7z',
  // Weltkugel
  races: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3.5 9h17M3.5 15h17M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9',
  // Totenschädel
  skull: 'M12 3a7 7 0 00-7 7v3l2 2v4h10v-4l2-2v-3a7 7 0 00-7-7zM9.5 11.5v.01M14.5 11.5v.01M10.5 19v-2.5M13.5 19v-2.5M11 15h2',
  // Bierkrug
  mug: 'M6 8h9v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8zM15 11h2a2 2 0 010 4h-2M7 8c0-2 1.5-3 3-3s2 1 3 1 2-1 2 2M9 11v6M12 11v6',
  // Schreibfeder
  names: 'M20 4c-6 0-11 4-13 11l-2 5M20 4c0 6-4 10-10 11M7 15h3M13 9l-4 4',
  // Kopieren (zwei Blätter)
  copy: 'M9 9h10v11H9zM5 15V4h10',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevron: 'M6 9l6 6 6-6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6'
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0">
    <path :d="paths[name]" />
  </svg>
</template>
