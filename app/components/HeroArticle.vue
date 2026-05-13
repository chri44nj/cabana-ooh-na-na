<script setup lang="ts">
import type { ArticleItem } from "~/types/api";

const {
  item,
  showMedia = true,
  showLinks = true,
} = defineProps<{
  item: ArticleItem;
  showMedia?: boolean;
  showLinks?: boolean;
}>();
</script>

<template>
  <article
    class="w-full max-w-xl bg-(--color-secondary) text-(--color-primary) rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
  >
    <div
      v-if="showMedia && (item.image || item.video)"
      class="overflow-hidden aspect-5/2"
    >
      <video
        v-if="item.video"
        :src="item.video.url"
        :poster="item.video.poster"
        :title="item.video.alt"
        class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      />

      <NuxtImg
        v-else-if="item.image"
        :src="item.image.url"
        :alt="item.image.alt"
        format="webp"
        quality="80"
        sizes="sm:100vw md:50vw lg:600px"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

    <div class="flex flex-col gap-3 p-6">
      <h2 class="text-xl font-semibold leading-snug">
        {{ item.title }}
      </h2>

      <p class="text-sm leading-relaxed">
        {{ item.description }}
      </p>

      <div
        v-if="showLinks && item.links?.length"
        class="flex flex-wrap gap-2 mt-1"
      >
        <NuxtLink
          v-for="link in item.links"
          :key="link.url"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {{ link.label }}

          <Icon
            name="material-symbols:arrow-right-alt-rounded"
            class="w-3.5 h-3.5"
          />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
