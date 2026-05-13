<script setup lang="ts">
const layoutStore = useLayoutStore();

/** Variables **/
const route = useRoute();
const slugPath = computed(() => route.path);
</script>

<template>
  <main
    :data-theme="layoutStore.theme"
    class="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center bg-(--color-secondary) text-(--color-primary)"
  >
    <h1 class="text-4xl font-bold">Du ville besøge</h1>
    <p class="text-[2rem] italic">
      {{ slugPath }}
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
    <LayoutSettings />
  </main>
</template>
