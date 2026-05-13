export type HeroLayout = "default" | "split" | "minimal";

export type HeroTheme =
  | "neutral"
  | "nordic"
  | "forest"
  | "ocean"
  | "sunset"
  | "midnight"
  | "sand"
  | "plum";

export type HeroSpacing = "small" | "medium" | "large";

export type HeroSearch = "small" | "medium" | "large";

export interface LayoutState {
  settingsVisible: boolean;
  showHeader: boolean;
  theme: HeroTheme;
  spacing: HeroSpacing;
  layout: HeroLayout;
  showSearch: boolean;
  searchSize: HeroSearch;
  contentFirst: boolean;
  showSecondaryArticle: boolean;
  showLinks: boolean;
  showMedia: boolean;
}
