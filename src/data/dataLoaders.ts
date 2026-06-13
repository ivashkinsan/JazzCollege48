import { asset } from '../utils/asset';
import type { NewsItem, ExtendedNewsItem, AfishaItem } from '../types/college';

const newsModules = import.meta.glob('../news/**/*.md', { query: '?raw', import: 'default' });
const afishaModules = import.meta.glob('../afisha/**/*.md', { query: '?raw', import: 'default' });

/**
 * Parses gallery image paths from a markdown comment block.
 */
function parseGallery(content: string): string[] {
  const galleryMatch = content.match(new RegExp(`<!--\s*gallery\s*-->
([\s\S]*?)$`));
  if (!galleryMatch || !galleryMatch[1]) {
    return [];
  }
  return galleryMatch[1]
    .split('')
    .map(line => line.replace(/^-/, '').trim())
    .filter(Boolean)
    .map(img => asset(img));
}

/**
 * A generic markdown parser that separates frontmatter and body.
 */
function parseMarkdown(content: string): { frontmatter: Record<string, string>, body: string } | null {
    const frontmatterMatch = content.match(new RegExp(`^---([\s\S]*?)---([\s\S]*)$`));
    if (!frontmatterMatch) return null;

    const [, frontmatterStr, body] = frontmatterMatch;
    const frontmatter: Record<string, string> = {};
    const lines = frontmatterStr.split('');

    for (const line of lines) {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            frontmatter[key] = value;
        }
    }
    
    return { frontmatter, body: body.trim() };
}


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
    const content = rawContent.split('').join('');
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
                gallery: parseGallery(content)
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

export const afisha: AfishaItem[] = [];
let afishaLoaded = false;
let afishaLoading = false;

export async function loadAfisha(): Promise<AfishaItem[]> {
    if (afishaLoaded) return afisha;
    if (afishaLoading) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (afishaLoaded) {
                    clearInterval(interval);
                    resolve(afisha);
                }
            }, 50);
        });
    }

    afishaLoading = true;
    const loadedItems: AfishaItem[] = [];
    for (const path in afishaModules) {
        const rawContent = await afishaModules[path]() as string;
        const content = rawContent.split('').join('');
        const parsed = parseMarkdown(content);

        if (parsed) {
            const { frontmatter, body } = parsed;
            const { title, date, time, venue, cover, tags: tagsStr } = frontmatter;

            if (title && date) {
                loadedItems.push({
                    id: `${date}-${title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`,
                    title,
                    date,
                    time: time || undefined,
                    venue: venue || undefined,
                    cover: cover ? asset(cover) : undefined,
                    content: body,
                    gallery: parseGallery(content),
                    tags: tagsStr ? tagsStr.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean) : []
                });
            }
        }
    }

    loadedItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    afisha.splice(0, afisha.length, ...loadedItems);
    afishaLoaded = true;
    afishaLoading = false;
    console.log(`[afisha] Загружено ${afisha.length} афиш:`, afisha.map(a => `${a.date} ${a.title}`));
    return afisha;
}
