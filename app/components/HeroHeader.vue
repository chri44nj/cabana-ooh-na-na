<script setup lang="ts">
import { themeOptions } from "~/constants/layoutOptions";

const { title } = defineProps<{
  title: string;
}>();

const layoutStore = useLayoutStore();

const currentTheme = computed(() =>
  themeOptions.find((theme) => theme.value === layoutStore.theme),
);

const searchOpen = ref(false);
const burgerOpen = ref(false);
</script>

<template>
  <header
    class="h-(--header-height) w-full bg-(--color-secondary) text-(--color-primary) flex items-center justify-between px-4 sm:px-8 relative"
  >
    <NuxtLink class="flex items-center gap-2 h-full font-bold text-lg" href="/">
      <NuxtImg
        src="/forrest-logo.webp"
        format="webp"
        width="90"
        height="72"
        sizes="72px"
        class="h-[75%] transition-all duration-500"
        :class="{ invert: currentTheme?.logoInvert }"
        alt="Skov Kommunes logo, der forestiller et stort træ i blomstring"
      />
      {{ title }}
    </NuxtLink>

    <nav aria-label="Primær navigation">
      <ul class="items-center gap-4 hidden sm:flex">
        <li v-for="i in 5" :key="i">
          <NuxtLink
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline focus-visible:underline font-medium"
          >
            Randomlink{{ i }}
          </NuxtLink>
        </li>

        <!-- Søgeknappen er ikke funktionel og eksisterer blot for at illustrere
        hvordan søgefunktionaliteten kunne rykkes op i headeren, hvis den
        skjultes i heroen (I havde snakket om, at den tit var to steder hvilket
        var lidt dobbeltkonfekt) -->

        <li v-if="!layoutStore.showSearch">
          <UButton
            type="button"
            icon="material-symbols:search-rounded"
            :aria-expanded="searchOpen"
            aria-controls="header-search"
            aria-label="Åbn søgefelt"
            class="bg-transparent text-(--color-primary) hover:bg-(--color-primary)/10"
            @click="searchOpen = !searchOpen"
          />
        </li>
      </ul>

      <!-- Burgermenu er ikke funktionel og eksisterer blot for at illustrere
      hvordan det kunne se ud på mobil -->

      <UButton
        aria-label="Åbn burgermenu"
        :aria-expanded="burgerOpen"
        class="flex flex-col gap-1 sm:hidden bg-transparent active:bg-transparent"
        @click="burgerOpen = !burgerOpen"
      >
        <span v-for="i in 3" :key="i" class="w-8 h-1 bg-(--color-primary)" />
      </UButton>
    </nav>
  </header>
</template>
