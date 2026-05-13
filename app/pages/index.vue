<script setup lang="ts">
import type { HeroResponse, ArticleItem, SearchItem } from "~/types/api";

const { data, pending, error } = await useFetch<HeroResponse>(
  "https://cabana-assignment-api-rw48.vercel.app/api/hero",
);

/** Stores **/
const layoutStore = useLayoutStore();

/** Variables **/
const municipality = data.value?.meta.municipality;
const articles = data.value?.items.filter(
  (item): item is ArticleItem => item.type === "article",
);
const primaryArticle = articles?.[0];

/** SEO **/
useHead({
  htmlAttrs: {
    lang: "da",
  },
});

useSeoMeta({
  title: municipality,
  description: primaryArticle?.description,
  ogTitle: `${municipality}`,
  ogDescription: primaryArticle?.description,
  ogImage: primaryArticle?.image?.url,
  ogImageAlt: primaryArticle?.image?.alt,
  ogType: "website",
  ogLocale: "da_DK",
  twitterCard: "summary_large_image",
  twitterTitle: `${municipality}`,
  twitterDescription: primaryArticle?.description,
  twitterImage: primaryArticle?.image?.url,
});
</script>

<template>
  <div class="flex flex-col">
    <HeroHeader
      v-if="layoutStore.showHeader"
      :data-theme="layoutStore.theme"
      :title="data?.meta?.municipality || 'Placeholder Kommune'"
      :inert="layoutStore.settingsVisible"
    />
    <main :data-theme="layoutStore.theme" class="relative">
      <p v-if="pending">Loading...</p>
      <p v-else-if="error">Something went wrong</p>
      <HeroSystem
        v-else-if="data"
        :data="data"
        :inert="layoutStore.settingsVisible"
      />

      <LayoutSettings />
    </main>
  </div>
</template>
