<script setup lang="ts">
const layoutStore = useLayoutStore();

/** Variables **/
const route = useRoute();
const searchQuery = computed(() => route.query.q || "");
</script>

<template>
  <main
    id="search-results"
    :data-theme="layoutStore.theme"
    class="h-screen w-full bg-(--color-secondary) text-(--color-primary) flex flex-col items-center justify-center gap-4 p-4 sm:p-8 text-center"
  >
    <h1 class="sm:text-[1.5rem] font-bold">Du har søgt på</h1>
    <p class="text-[2rem] italic">
      {{ searchQuery }}
    </p>
    <p class="text-lg">
      Men siden findes ikke... Det var bare for at vise jer, at jeg vidste
      hvordan man lavede en slug page. Kan I så komme tilbage til forsiden!
    </p>
    <NuxtLink
      href="/"
      class="font-medium hover:underline focus-visible:underline"
    >
      Tilbage til forsiden
    </NuxtLink>
  </main>
</template>
