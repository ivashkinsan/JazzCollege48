import { asset } from '../utils/asset';
import type { ExtendedNewsItem } from '../types/college';
import { parseMarkdown, parseGallery } from './parser';

const newsModules = import.meta.glob('../news/**/*.md', { query: '?raw', import: 'default' });

export const news: ExtendedNewsItem[] = [];
let newsLoaded = false;
let newsLoading = false;

export async function loadNews(): Promise<ExtendedNewsItem[]> {
  if (newsLoaded) return news;
  if (newsLoading) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (newsLoaded) {
          clearInterval(interval);
          resolve(news);
        }
      }, 50);
    });
  }

  newsLoading = true;
  const loadedItems: ExtendedNewsItem[] = [];
  for (const path in newsModules) {
    const rawContent = await newsModules[path]() as string;
    const content = rawContent;
    const parsed = parseMarkdown(content);

    if (parsed) {
        const { frontmatter, body } = parsed;
        const { title, date, category, cover } = frontmatter;

        if (title && date) {
            loadedItems.push({
                id: `${date}-${title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`,
                title,
                date,
                description: body.slice(0, 250).replace(/[#*_~`]/g, '').trim(),
                content: body,
                category,
                cover: cover ? asset(cover) : undefined,
                gallery: parseGallery(body)
            });
        }
    }
  }

  loadedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  news.splice(0, news.length, ...loadedItems);
  newsLoaded = true;
  newsLoading = false;
  return news;
}
