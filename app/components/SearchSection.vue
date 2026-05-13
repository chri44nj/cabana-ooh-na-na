<script setup lang="ts">
/** Variables **/
const route = useRoute();
const searchQuery = computed(() => route.query.q || "");
</script>

<template>
  <section
    id="search-results"
    class="h-screen w-full bg-(--color-secondary) text-(--color-primary) flex flex-col items-center justify-center gap-4 p-4 sm:p-8 text-center"
  >
    <h2 class="sm:text-[1.5rem] font-bold">
      {{ searchQuery ? "Du har søgt på" : "Du har ikke søgt på noget" }}
    </h2>
    <p class="text-[2rem] italic">
      {{ searchQuery ? searchQuery : "Søg på noget og resultaterne vises her" }}
    </p>
    <p v-if="searchQuery">
      Og det kan du ikke finde her, fordi det er en dummy page :(
    </p>
    <NuxtLink
      v-if="searchQuery"
      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Prøv at søge et andet sted (åbner i ny fane)"
      class="hover:underline focus-visible:underline font-bold"
      >Prøv her i stedet</NuxtLink
    >
  </section>
</template>
