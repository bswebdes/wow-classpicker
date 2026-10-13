<template>
  <!-- Fließtext auf Pergament, wie im Questlog -->
  <div class="wow-parchment prose max-w-none text-[17px] prose-headings:font-display [&_:is(h2,h3)]:clear-both [&_:is(h2,h3)_a]:no-underline [&_:is(h2,h3)_a]:text-inherit [&_:is(h2,h3)_a]:font-bold prose-headings:text-[#4a2408] prose-h2:mt-8 prose-h2:first:mt-0 prose-p:text-ink prose-li:text-ink prose-strong:text-[#2a1606] prose-a:text-[#8b1a0a] prose-a:font-semibold prose-th:text-[#4a2408] prose-td:text-ink prose-thead:border-[#8a6d2b] prose-tr:border-[#b89a5e] prose-code:text-[#4a2408] prose-code:before:content-none prose-code:after:content-none prose-ol:marker:text-[#4a2408] prose-ul:marker:text-[#8a6d2b] prose-blockquote:not-italic prose-blockquote:font-normal prose-blockquote:rounded-r prose-blockquote:border-l-4 prose-blockquote:border-[#8a6d2b] prose-blockquote:bg-[#8a6d2b]/10 prose-blockquote:py-1 prose-blockquote:text-ink [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none">
    <slot />
  </div>
</template>
