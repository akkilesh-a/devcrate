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
