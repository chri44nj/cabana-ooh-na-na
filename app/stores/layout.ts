import type { LayoutState } from "~/types/layout";

export const useLayoutStore = defineStore("layoutStore", {
  state: (): LayoutState => ({
    settingsVisible: false,
    showHeader: true,
    theme: "forest",
    spacing: "medium",
    layout: "default",
    showSearch: true,
    searchSize: "large",
    contentFirst: true,
    showSecondaryArticle: true,
    showLinks: true,
    showMedia: true,
    showBackgroundMedia: false,
    backgroundMediaType: "image",
  }),

  actions: {
    resetSettings() {
      this.showHeader = true;
      this.layout = "default";
      this.theme = "forest";
      this.spacing = "medium";
      this.showSearch = true;
      this.searchSize = "large";
      this.contentFirst = true;
      this.showSecondaryArticle = true;
      this.showLinks = true;
      this.showMedia = true;
      this.showBackgroundMedia = false;
      this.backgroundMediaType = "image";
    },
  },
});
