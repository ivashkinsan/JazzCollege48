import { asset } from '../utils/asset';
import type { AfishaItem } from '../types/college';
import { parseMarkdown, parseGallery } from './parser';

const afishaModules = import.meta.glob('../afisha/**/*.md', { query: '?raw', import: 'default' });

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
        const content = rawContent;
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
