import type { Post, PostMeta, PostFrontmatter, TagCount } from '../types/post';

// ── Vite 5 新语法：as: 'raw' 替代 ?raw query ──
const rawModules = import.meta.glob('/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * 简易 YAML frontmatter 解析器
 */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const trimmed = raw.trimStart();
  if (!trimmed.startsWith('---')) {
    return { data: {}, content: raw };
  }

  const end = trimmed.indexOf('---', 3);
  if (end === -1) {
    return { data: {}, content: raw };
  }

  const fmBlock = trimmed.slice(3, end).trim();
  const content = trimmed.slice(end + 3).trim();
  const data: Record<string, unknown> = {};

  const lines = fmBlock.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    if (typeof value === 'string' && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }

    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''));
    }

    if (value === 'true') value = true;
    if (value === 'false') value = false;

    data[key] = value;
  }

  return { data, content };
}

function computeReadingTime(text: string): number {
  const wpm = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wpm));
}

function slugFromPath(filepath: string): string {
  return filepath.split('/').pop()!.replace(/\.md$/, '');
}

const allPosts: Post[] = Object.entries(rawModules)
  .map(([filepath, raw]) => {
    const slug = slugFromPath(filepath);
    const { data, content } = parseFrontmatter(raw);
    const fm = data as unknown as PostFrontmatter;
    return { slug, frontmatter: fm, content, readingTime: computeReadingTime(content) };
  })
  .filter((p) => !p.frontmatter.draft)
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

// ── Public API ──

export function getAllPosts(): Post[] {
  return allPosts;
}

export function getAllPostMeta(): PostMeta[] {
  return allPosts.map(({ slug, frontmatter, readingTime }) => ({
    slug,
    frontmatter,
    readingTime,
  }));
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  return getAllPostMeta().filter(
    (p) => p.frontmatter.category === categorySlug
  );
}

export function getCategoryPostCount(categorySlug: string): number {
  return getPostsByCategory(categorySlug).length;
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostMeta().filter((p) =>
    p.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getAllTags(): TagCount[] {
  const tagMap = new Map<string, number>();
  for (const p of allPosts) {
    for (const t of p.frontmatter.tags) {
      tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
    }
  }
  return [...tagMap.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
