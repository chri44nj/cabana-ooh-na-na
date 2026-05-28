<script setup lang="ts">
import type { SearchItem } from "~/types/api";

const { item } = defineProps<{
  item: SearchItem;
}>();

const layoutStore = useLayoutStore();

const query = ref("");
const searchId = useId();
const open = ref(false);
const focused = ref(false);
const animatedPlaceholder = ref(item.search.placeholder);
const preferredMotion = usePreferredReducedMotion();
let placeholderTimer: ReturnType<typeof setTimeout> | undefined;
let suggestionIndex = 0;
let characterIndex = 0;
let deleting = false;

const filteredSuggestions = computed(() => {
  const suggestions = item.search.suggestions ?? [];

  if (!query.value.trim()) {
    return suggestions;
  }

  return suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.value.toLowerCase()),
  );
});

const searchInputSize = computed(() => {
  switch (layoutStore.searchSize) {
    case "small":
      return "max-w-xl";

    case "large":
      return "max-w-6xl";

    case "medium":
    default:
      return "max-w-2xl";
  }
});

const searchRowClass = computed(() => {
  switch (layoutStore.searchSize) {
    case "small":
      return "sm:h-10";

    case "large":
      return "sm:h-16";

    case "medium":
    default:
      return "sm:h-12";
  }
});

const searchInputNuxtSize = computed(() => {
  switch (layoutStore.searchSize) {
    case "small":
      return "md";

    case "large":
      return "xl";

    case "medium":
    default:
      return "lg";
  }
});

const clearPlaceholderTimer = () => {
  if (!placeholderTimer) return;

  clearTimeout(placeholderTimer);
  placeholderTimer = undefined;
};

const startPlaceholderAnimation = () => {
  const suggestions = item.search.suggestions ?? [];

  if (
    !layoutStore.searchNudging ||
    preferredMotion.value === "reduce" ||
    focused.value ||
    query.value.trim() ||
    !suggestions.length
  ) {
    animatedPlaceholder.value = item.search.placeholder;
    return;
  }

  const tick = () => {
    const suggestion = suggestions[suggestionIndex] ?? "";

    animatedPlaceholder.value = suggestion.slice(0, characterIndex);

    if (!deleting && characterIndex < suggestion.length) {
      characterIndex += 1;
      placeholderTimer = setTimeout(tick, 85);
      return;
    }

    if (!deleting && characterIndex === suggestion.length) {
      deleting = true;
      placeholderTimer = setTimeout(tick, 1300);
      return;
    }

    if (deleting && characterIndex > 0) {
      characterIndex -= 1;
      placeholderTimer = setTimeout(tick, 35);
      return;
    }

    deleting = false;
    suggestionIndex = (suggestionIndex + 1) % suggestions.length;
    placeholderTimer = setTimeout(tick, 300);
  };

  clearPlaceholderTimer();
  tick();
};

const resetPlaceholderAnimation = () => {
  clearPlaceholderTimer();
  animatedPlaceholder.value = item.search.placeholder;

  if (!focused.value && !query.value.trim()) {
    startPlaceholderAnimation();
  }
};

const handleSubmit = async () => {
  const searchQuery = query.value.trim();

  if (!searchQuery) return;

  await navigateTo({
    path: item.search.action,
    query: {
      q: searchQuery,
    },
  });
};

const selectSuggestion = (suggestion: string) => {
  query.value = suggestion;
};

const handleFocus = () => {
  focused.value = true;
  clearPlaceholderTimer();
  animatedPlaceholder.value = item.search.placeholder;
};

const handleBlur = () => {
  focused.value = false;
  open.value = false;
  resetPlaceholderAnimation();
};

const isPlaceholderAnimating = computed(() => {
  return (
    layoutStore.searchNudging &&
    preferredMotion.value !== "reduce" &&
    !focused.value &&
    !query.value.trim() &&
    !!item.search.suggestions?.length
  );
});

onMounted(resetPlaceholderAnimation);
onBeforeUnmount(clearPlaceholderTimer);

watch([preferredMotion, query], resetPlaceholderAnimation);

watch(() => layoutStore.searchNudging, resetPlaceholderAnimation);
</script>

<template>
  <div class="w-full" :class="searchInputSize">
    <label :for="searchId" class="sr-only"> Søg på hjemmesiden </label>

    <form
      role="search"
      class="flex items-center flex-col sm:flex-row gap-2"
      :class="searchRowClass"
      @submit.prevent="handleSubmit"
    >
      <UInputMenu
        :id="searchId"
        v-model="query"
        v-model:open="open"
        autocomplete
        open-on-focus
        ignore-filter
        :items="filteredSuggestions"
        :placeholder="animatedPlaceholder"
        class="flex-1 h-full w-full"
        :ui="{
          base: 'h-full w-full rounded-2xl bg-(--color-secondary) text-(--color-primary) placeholder:text-(--color-primary) ring-transparent focus-visible:ring-(--color-surface)',
          leadingIcon: 'text-(--color-primary)',
          trailingIcon: 'text-(--color-primary)',
          trailingClear: 'text-(--color-primary) hover:text-(--color-surface)',
          itemLeadingIcon: 'text-(--color-primary)',
        }"
        :size="searchInputNuxtSize"
        leading-icon="material-symbols:search-rounded"
        clear-icon="material-symbols:close-rounded"
        :content="{
          hideWhenEmpty: true,
        }"
        clear
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <UButton
        label="Søg"
        type="submit"
        :aria-label="`Søg efter ${query || 'indhold'}`"
        class="h-full px-8 rounded-2xl sm:w-auto w-full justify-center bg-transparent border-(--color-secondary) focus-visible:text-(--color-primary) focus-visible:bg-(--color-secondary) border text-(--color-secondary) hover:text-(--color-primary) hover:bg-(--color-secondary) active:bg-(--color-primary) focus-visible:outline-none"
        :size="searchInputNuxtSize"
      />
    </form>
    <span :id="`${searchId}-shortcuts-label`" class="sr-only">
      Hurtige søgeforslag
    </span>
    <ul
      v-if="item.search.suggestions?.length"
      :aria-labelledby="`${searchId}-shortcuts-label`"
      class="flex flex-wrap justify-center gap-2 list-none mt-4"
    >
      <li
        v-for="(suggestion, index) in item.search.suggestions"
        :key="suggestion"
      >
        <UButton
          :label="suggestion"
          type="button"
          variant="soft"
          class="rounded-full bg-(--color-secondary) text-(--color-primary) hover:bg-(--color-surface) hover:text-(--color-secondary) focus-visible:bg-(--color-surface) focus-visible:text-(--color-secondary) transition-colors duration-500 hover:duration-300"
          :class="
            (isPlaceholderAnimating && index === suggestionIndex) ||
            query.trim().toLowerCase() === suggestion.toLowerCase()
              ? 'bg-(--color-surface) text-(--color-secondary) duration-1000'
              : ''
          "
          :aria-label="`Søg efter ${suggestion}`"
          @click="selectSuggestion(suggestion)"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
input[type="search"]::-webkit-search-cancel-button {
  display: none;
}
</style>
