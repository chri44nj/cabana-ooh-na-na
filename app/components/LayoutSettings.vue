<script setup lang="ts">
import {
  layoutOptions,
  themeOptions,
  spacingOptions,
  searchOptions,
  backgroundMediaOptions,
} from "~/constants/layoutOptions";

const panel = ref<HTMLElement | null>(null);

let popperOpen = false;

onMounted(() => {
  const observer = new MutationObserver(() => {
    popperOpen = !!document.querySelector(
      "[data-radix-popper-content-wrapper], [data-reka-popper-content-wrapper]",
    );
  });

  observer.observe(document.body, { childList: true, subtree: true });

  onUnmounted(() => observer.disconnect());
});

onClickOutside(panel, (event) => {
  const target = event.target as Element;

  const isInsidePopper = target?.closest?.(
    "[data-radix-popper-content-wrapper], [data-reka-popper-content-wrapper]",
  );

  if (isInsidePopper || popperOpen) return;

  layoutStore.settingsVisible = false;
});

const layoutStore = useLayoutStore();

const showContentFirst = computed(() => {
  return (
    layoutStore.layout !== "minimal" &&
    !(layoutStore.layout === "default" && !layoutStore.showSearch)
  );
});

const canHideHeader = computed(() => layoutStore.showSearch);
const canHideHeroSearch = computed(() => layoutStore.showHeader);

watch(
  () => [layoutStore.showHeader, layoutStore.showSearch],
  ([showHeader, showSearch]) => {
    if (!showHeader && !showSearch) {
      layoutStore.showSearch = true;
    }
  },
);
</script>

<template>
  <!-- Vores aside er det eneste element, der ikke skifter farve baseret på temaet;
så er det lettere at se det som en separat del af appen -->

  <aside
    id="layout-settings-panel"
    aria-labelledby="settings-heading"
    class="fixed top-0 left-0 z-50 h-screen w-full bg-(--neutral-secondary) p-4 shadow-xl transition-transform duration-500 ease-in-out sm:w-fit sm:p-8 pr-0 sm:pr-0 flex flex-col justify-between"
    :class="layoutStore.settingsVisible ? 'translate-x-0' : '-translate-x-full'"
    ref="panel"
  >
    <div class="mb-4 pr-4 sm:pr-8">
      <div class="flex items-center justify-between w-full">
        <h2 id="settings-heading" class="text-2xl font-semibold">
          Layoutindstillinger
        </h2>
        <UButton
          v-if="layoutStore.settingsVisible"
          type="button"
          aria-controls="layout-settings-panel"
          :aria-expanded="layoutStore.settingsVisible"
          aria-label="Luk layoutindstillinger"
          class="sm:transition-all duration-500 sm:text-(--color-secondary) sm:bg-(--color-primary)/50 sm:ring-(--color-primary)"
          :class="[
            layoutStore.settingsVisible
              ? 'sm:absolute top-0 sm:h-full w-8 sm:w-8 h-8 sm:-right-8 sm:rounded-none'
              : 'bg-transparent h-full w-8 -right-8 top-0 absolute rounded-none',
          ]"
          :icon="
            layoutStore.settingsVisible
              ? 'material-symbols:chevron-left-rounded'
              : 'material-symbols:chevron-right-rounded'
          "
          @click="layoutStore.settingsVisible = !layoutStore.settingsVisible"
        />
      </div>

      <p class="text-sm my-4">
        Denne menu simulerer nogle af de indstillinger, en redaktør kunne
        justere på i Umbraco, for at distinguishe deres hero fra andres.
      </p>
    </div>

    <div
      class="overflow-y-auto overflow-x-hidden flex flex-col gap-8 min-h-0 flex-1 pr-4 sm:pr-8"
      :inert="!layoutStore.settingsVisible"
      :aria-hidden="!layoutStore.settingsVisible"
    >
      <div class="flex flex-col gap-3">
        <h3 class="font-bold uppercase">Design</h3>
        <UFormField label="Tema" name="theme">
          <USelect
            v-model="layoutStore.theme"
            :items="themeOptions"
            :ui="{
              content: 'min-w-fit',
            }"
          />
        </UFormField>
        <UFormField label="Billede som baggrund" name="showBackgroundMedia">
          <USwitch v-model="layoutStore.showBackgroundMedia" />
        </UFormField>

        <URadioGroup
          v-if="layoutStore.showBackgroundMedia"
          v-model="layoutStore.backgroundMediaType"
          :items="backgroundMediaOptions"
          legend="Baggrundstype"
          orientation="horizontal"
        />
      </div>

      <UIDivider />

      <div class="flex flex-col gap-3">
        <h3 class="font-bold uppercase">Layout</h3>
        <UFormField label="Hero Layout" name="layout">
          <USelect
            v-model="layoutStore.layout"
            :items="layoutOptions"
            :ui="{
              content: 'min-w-fit',
            }"
          />
        </UFormField>

        <URadioGroup
          v-model="layoutStore.spacing"
          :items="spacingOptions"
          legend="Spacing"
          orientation="horizontal"
        />

        <UFormField
          v-if="showContentFirst"
          label="Indhold vises først"
          name="contentFirst"
        >
          <USwitch v-model="layoutStore.contentFirst" />
        </UFormField>

        <UFormField label="Vis header" name="showHeader">
          <p
            v-if="!canHideHeader"
            class="text-xs my-2 text-(--neutral-warning)"
          >
            Headeren kan ikke skjules, når søgefeltet i heroen er slået fra.
          </p>
          <USwitch
            v-model="layoutStore.showHeader"
            :disabled="!canHideHeader"
          />
        </UFormField>
      </div>

      <UIDivider />

      <div class="flex flex-col gap-3">
        <h3 class="font-bold uppercase">Søgning</h3>

        <UFormField label="Vis søgefelt i hero" name="showSearch">
          <p
            v-if="!canHideHeroSearch"
            class="text-xs my-2 text-(--neutral-warning)"
          >
            Søgefeltet kan ikke skjules, når headeren er slået fra.
          </p>
          <USwitch
            v-model="layoutStore.showSearch"
            :disabled="!canHideHeroSearch"
          />
        </UFormField>

        <URadioGroup
          v-if="layoutStore.showSearch"
          v-model="layoutStore.searchSize"
          :items="searchOptions"
          legend="Søgebar størrelse"
          orientation="horizontal"
        />
      </div>

      <UIDivider v-if="layoutStore.layout !== 'minimal'" />

      <div class="flex flex-col gap-3" v-if="layoutStore.layout !== 'minimal'">
        <h3 class="font-bold uppercase">Artikler</h3>

        <UFormField label="Vis medier i artikler" name="showMedia">
          <USwitch v-model="layoutStore.showMedia" />
        </UFormField>

        <UFormField label="Vis links i artikler" name="showLinks">
          <USwitch v-model="layoutStore.showLinks" />
        </UFormField>
        <UFormField label="Vis sekundær artikel" name="showSecondaryArticle">
          <USwitch v-model="layoutStore.showSecondaryArticle" />
        </UFormField>
      </div>

      <UButton type="button" block @click="layoutStore.resetSettings()">
        Nulstil
      </UButton>
    </div>

    <UButton
      v-if="!layoutStore.settingsVisible"
      type="button"
      aria-controls="layout-settings-panel"
      :aria-expanded="layoutStore.settingsVisible"
      :aria-label="
        layoutStore.settingsVisible
          ? 'Luk layoutindstillinger'
          : 'Åbn layoutindstillinger'
      "
      class="sm:transition-all animate-pulse hover:animate-none duration-500 text-(--color-secondary) bg-(--color-primary)/25 ring-(--color-primary)"
      :class="[
        layoutStore.settingsVisible
          ? 'sm:absolute top-0 sm:h-full w-8 sm:w-8 h-8 sm:-right-8 sm:rounded-none'
          : ' h-full w-8 -right-8 top-0 absolute rounded-none',
      ]"
      :icon="
        layoutStore.settingsVisible
          ? 'material-symbols:chevron-left-rounded'
          : 'material-symbols:chevron-right-rounded'
      "
      @click="layoutStore.settingsVisible = !layoutStore.settingsVisible"
    />
  </aside>
</template>
