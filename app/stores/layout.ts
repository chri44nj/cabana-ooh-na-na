import type {
  LayoutState,
  HeroLayout,
  HeroTheme,
  HeroSpacing,
  HeroSearch,
} from "~/types/layout";

export const useLayoutStore = defineStore("layoutStore", {
  state: (): LayoutState => ({
    settingsVisible: false,
    showHeader: true,
    theme: "neutral",
    spacing: "medium",
    layout: "default",
    showSearch: true,
    searchSize: "large",
    contentFirst: true,
    showSecondaryArticle: true,
    showLinks: true,
    showMedia: true,
  }),

  actions: {
    resetSettings() {
      this.showHeader = true;
      this.layout = "default";
      this.theme = "neutral";
      this.spacing = "medium";
      this.showSearch = true;
      this.searchSize = "large";
      this.contentFirst = true;
      this.showSecondaryArticle = true;
      this.showLinks = true;
      this.showMedia = true;
    },
  },
});
