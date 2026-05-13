<script setup lang="ts">
import type { HeroResponse, ArticleItem, SearchItem } from "~/types/api";

const { data } = defineProps<{
  data: HeroResponse;
}>();

const layoutStore = useLayoutStore();

const articles = computed<ArticleItem[]>(() => {
  const filteredArticles = data.items.filter(
    (item): item is ArticleItem => item.type === "article",
  );

  return layoutStore.showSecondaryArticle
    ? filteredArticles
    : filteredArticles.slice(0, 1);
});

const primaryArticle = computed(() => articles.value[0]);
const secondaryArticle = computed(() => articles.value[1]);

const searchItem = computed<SearchItem | undefined>(() =>
  data.items.find((item): item is SearchItem => item.type === "search"),
);

const spacingClass = computed(() => {
  switch (layoutStore.spacing) {
    case "small":
      return "gap-4";

    case "large":
      return "gap-12";

    case "medium":
    default:
      return "gap-8";
  }
});

const heightBasedOnHeaderClass = computed(() => {
  switch (layoutStore.showHeader) {
    case true:
      return "min-h-[calc(100vh-var(--header-height))]";

    default:
      return "min-h-screen";
  }
});

const h1Class = computed(() => {
  switch (layoutStore.showSearch) {
    case true:
      return "text-center font-bold text-[2rem] sm:text-[3rem] text-(--color-secondary)";

    default:
      return "text-center font-bold text-[2.5rem] sm:text-[4rem]";
  }
});

const activeIndex = ref(0);

const handleArticleSlides = (direction: "previous" | "next") => {
  if (direction === "previous") {
    activeIndex.value =
      activeIndex.value <= 0
        ? articles.value.length - 1
        : activeIndex.value - 1;
  } else {
    activeIndex.value =
      activeIndex.value >= articles.value.length - 1
        ? 0
        : activeIndex.value + 1;
  }
};

watch(
  () => layoutStore.showSecondaryArticle,
  () => {
    activeIndex.value = 0;
  },
);
</script>

<template>
  <section
    class="w-full bg-(--color-primary) text-(--color-secondary) transition-colors duration-500 flex flex-col justify-center p-4 sm:p-8"
    :class="[spacingClass, heightBasedOnHeaderClass]"
  >
    <template v-if="layoutStore.layout === 'default'">
      <div class="flex flex-col items-center" :class="spacingClass">
        <h1 :class="h1Class">
          {{ data.meta.municipality }}
        </h1>
        <div
          class="w-full max-w-6xl mx-auto items-center"
          :class="[
            layoutStore.showSecondaryArticle
              ? 'grid md:grid-cols-2'
              : 'flex justify-center',
            spacingClass,
            layoutStore.contentFirst ? 'order-1' : 'order-2',
          ]"
        >
          <HeroArticle
            v-if="primaryArticle"
            :item="primaryArticle"
            :show-media="layoutStore.showMedia"
            :show-links="layoutStore.showLinks"
            class="shadow-xl"
          />

          <HeroArticle
            v-if="layoutStore.showSecondaryArticle && secondaryArticle"
            :item="secondaryArticle"
            :show-media="layoutStore.showMedia"
            :show-links="layoutStore.showLinks"
            class="shadow-xl"
          />
        </div>
        <HeroSearch
          v-if="layoutStore.showSearch && searchItem"
          :item="searchItem"
          :class="layoutStore.contentFirst ? 'order-2' : 'order-1'"
        />
      </div>
    </template>

    <template v-else-if="layoutStore.layout === 'split'">
      <div
        class="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center"
        :class="spacingClass"
      >
        <div
          v-if="articles.length"
          aria-label="Artikler"
          aria-roledescription="carousel"
          :class="[
            spacingClass,
            layoutStore.contentFirst ? 'order-1' : 'order-2',
          ]"
        >
          <div
            class="overflow-hidden shadow-xl rounded-xl"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
            >
              <div
                v-for="(article, i) in articles"
                :key="article.id"
                :id="`slide-${i}`"
                :aria-labelledby="`tab-${i}`"
                class="w-full shrink-0"
                role="group"
                :aria-roledescription="'slide'"
                :aria-label="`Artikel ${i + 1} af ${articles.length}`"
                :aria-hidden="i !== activeIndex"
              >
                <HeroArticle
                  :item="article"
                  :show-media="layoutStore.showMedia"
                  :show-links="layoutStore.showLinks"
                  :inert="i !== activeIndex"
                />
              </div>
            </div>
          </div>

          <div
            v-if="layoutStore.showSecondaryArticle"
            class="flex items-center justify-center gap-3 mt-4"
          >
            <UButton
              type="button"
              icon="material-symbols:chevron-left-rounded"
              aria-label="Forrige artikel"
              class="bg-(--color-secondary) border-(--color-primary) focus-visible:outline-(--color-secondary) border text-(--color-primary) hover:text-(--color-secondary) hover:bg-(--color-surface) active:bg-(--color-primary)"
              @click="handleArticleSlides('previous')"
            />

            <div role="tablist" aria-label="Vælg artikel" class="flex gap-2">
              <button
                v-for="(article, i) in articles"
                :key="i"
                :id="`tab-${i}`"
                role="tab"
                type="button"
                :aria-selected="i === activeIndex"
                :aria-label="`Artikel ${i + 1}: ${article.title}`"
                :aria-controls="`slide-${i}`"
                class="bg-(--color-secondary) h-2 rounded-full transition-all"
                :class="
                  i === activeIndex ? 'w-4 opacity-100' : 'w-2 opacity-50'
                "
                @click="activeIndex = i"
              />
            </div>

            <UButton
              type="button"
              icon="material-symbols:chevron-right-rounded"
              aria-label="Næste artikel"
              class="bg-(--color-secondary) focus-visible:outline-(--color-secondary) border-(--color-primary) border text-(--color-primary) hover:text-(--color-secondary) hover:bg-(--color-surface) active:bg-(--color-primary)"
              @click="handleArticleSlides('next')"
            />
          </div>
        </div>

        <div
          class="flex flex-col items-center"
          :class="[
            spacingClass,
            layoutStore.contentFirst ? 'order-2' : 'order-1',
          ]"
        >
          <h1 :class="h1Class">
            {{ data.meta.municipality }}
          </h1>
          <HeroSearch
            v-if="layoutStore.showSearch && searchItem"
            :item="searchItem"
          />
        </div>
      </div>
    </template>

    <template v-else-if="layoutStore.layout === 'minimal'">
      <div
        class="flex flex-col items-center justify-center"
        :class="spacingClass"
      >
        <h1 :class="h1Class">
          {{ data.meta.municipality }}
        </h1>

        <HeroSearch
          v-if="layoutStore.showSearch && searchItem"
          :item="searchItem"
        />
      </div>
    </template>
  </section>
</template>
