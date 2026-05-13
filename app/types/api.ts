export interface HeroResponse {
  meta: Meta;
  items: HeroItem[];
}

export interface Meta {
  municipality: string;
  language: string;
  lastUpdated: string;
}

export type HeroItem = ArticleItem | SearchItem;

export interface ArticleItem {
  id: string;
  type: "article";
  title: string;
  description: string;

  image?: {
    url: string;
    alt: string;
  };

  video?: {
    url: string;
    poster: string;
    alt: string;
  };

  links: {
    label: string;
    url: string;
  }[];
}

export interface SearchItem {
  id: string;
  type: "search";

  search: {
    placeholder: string;
    action: string;
    suggestions: string[];
  };
}
