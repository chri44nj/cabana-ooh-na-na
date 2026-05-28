<script setup lang="ts">
import type { ArticleItem } from "~/types/api";

const layoutStore = useLayoutStore();

const {
  item,
  showMedia = true,
  showLinks = true,
} = defineProps<{
  item: ArticleItem;
  showMedia?: boolean;
  showLinks?: boolean;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);

const preferredMotion = usePreferredReducedMotion();

const shouldAutoplay = computed(() => {
  return (
    preferredMotion.value !== "reduce" &&
    (!layoutStore.showBackgroundMedia ||
      layoutStore.backgroundMediaType !== "video")
  );
});

const syncVideoPlayback = async () => {
  await nextTick();

  if (!videoRef.value) return;

  if (shouldAutoplay.value) {
    await videoRef.value.play().catch(() => {});
  } else {
    videoRef.value.pause();
  }
};

onMounted(syncVideoPlayback);

watch([shouldAutoplay, () => item.video?.url], syncVideoPlayback, {
  flush: "post",
});
</script>

<template>
  <article
    class="w-full h-full max-w-xl bg-(--color-secondary) text-(--color-primary) rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
  >
    <div
      v-if="showMedia && (item.image || item.video)"
      class="overflow-hidden aspect-5/2"
    >
      <video
        v-if="item.video"
        ref="videoRef"
        :src="item.video.url"
        :poster="item.video.poster"
        :title="item.video.alt"
        class="w-full h-full object-cover"
        :autoplay="shouldAutoplay"
        muted
        loop
        playsinline
      />

      <NuxtImg
        v-else-if="item.image"
        :src="item.image.url"
        :alt="item.image.alt"
        format="webp"
        quality="75"
        sizes="320px sm:520px md:50vw lg:600px"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="flex flex-col gap-2 p-6">
      <h2 class="text-xl font-semibold leading-snug">
        {{ item.title }}
      </h2>

      <p class="text-sm leading-relaxed">
        {{ item.description }}
      </p>

      <div
        v-if="showLinks && item.links?.length"
        class="flex flex-wrap gap-4 mt-1"
      >
        <NuxtLink
          v-for="link in item.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {{ link.label }}

          <Icon
            name="material-symbols:arrow-right-alt-rounded"
            class="text-2xl"
          />
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
