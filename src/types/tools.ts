export type LayoutType = "icons" | "cards" | "bricks";

export interface FiltersProps {
  allTags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  onToggleTag: (tagName: string) => void;
  onClearFilters: () => void;
}

export interface LayoutSwitcherProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ResourceWithTags extends Resource {
  resourceTags: {
    tag: Tag;
  }[];
}
