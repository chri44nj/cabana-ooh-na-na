import type {
  HeroLayout,
  HeroTheme,
  HeroSpacing,
  HeroSearch,
  HeroBackgroundMedia,
} from "~/types/layout";

export const layoutOptions: {
  label: string;
  value: HeroLayout;
}[] = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Split",
    value: "split",
  },
  {
    label: "Minimalistisk",
    value: "minimal",
  },
];

export const themeOptions: {
  label: string;
  value: HeroTheme;
  logoInvert: boolean;
}[] = [
  {
    label: "Blomme",
    value: "plum",
    logoInvert: false,
  },
  {
    label: "Hav",
    value: "ocean",
    logoInvert: false,
  },
  {
    label: "Midnat",
    value: "midnight",
    logoInvert: false,
  },
  {
    label: "Neutral",
    value: "neutral",
    logoInvert: true,
  },
  {
    label: "Nordisk",
    value: "nordic",
    logoInvert: true,
  },
  {
    label: "Sand",
    value: "sand",
    logoInvert: true,
  },
  {
    label: "Skov",
    value: "forest",
    logoInvert: false,
  },
  {
    label: "Solnedgang",
    value: "sunset",
    logoInvert: false,
  },
];

export const spacingOptions: {
  label: string;
  value: HeroSpacing;
}[] = [
  {
    label: "Small",
    value: "small",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Large",
    value: "large",
  },
];

export const searchOptions: {
  label: string;
  value: HeroSearch;
}[] = [
  {
    label: "Small",
    value: "small",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Large",
    value: "large",
  },
];

export const backgroundMediaOptions: {
  label: string;
  value: HeroBackgroundMedia;
}[] = [
  {
    label: "Billede",
    value: "image",
  },
  {
    label: "Video",
    value: "video",
  },
];
