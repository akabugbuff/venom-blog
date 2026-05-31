export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  category?: string;   // 对应 categories.ts 中的 slug
  tags: string[];
  draft?: boolean;
  updated?: string;
}

export interface PostMeta {
  slug: string;
  frontmatter: PostFrontmatter;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

export interface TagCount {
  tag: string;
  count: number;
}
