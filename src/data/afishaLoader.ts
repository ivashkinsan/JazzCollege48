import type { AfishaItem, Photo, PhotoAlbum } from '../types/college';
import { parseMarkdown, parseGalleryIds, stripGallery } from './parser';
import mediaManifest from './media-manifest.json';

// Create a lookup map for efficient access to media items by ID.
const allPhotos = (mediaManifest as PhotoAlbum[]).flatMap(album => album.photos);
const mediaMap = new Map<string, Photo>(allPhotos.map(photo => [photo.id, photo]));

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
        const parsed = parseMarkdown(rawContent);

        if (parsed) {
            const { frontmatter, body } = parsed;
            const { title, date, time, venue, coverImageId, tags: tagsStr } = frontmatter;
            
            const galleryIds = parseGalleryIds(body);
            const cleanedBody = stripGallery(body);

            if (title && date) {
                // Look up media objects from the manifest
                const coverPhoto = coverImageId ? mediaMap.get(coverImageId) : undefined;
                const galleryPhotos = galleryIds
                    .map(id => mediaMap.get(id))
                    .filter((item): item is Photo => !!item);

                loadedItems.push({
                    id: `${date}-${title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}`,
                    title,
                    date,
                    time: time || undefined,
                    venue: venue || undefined,
                    cover: coverPhoto,
                    content: cleanedBody,
                    gallery: galleryPhotos,
                    tags: tagsStr ? tagsStr.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean) : []
                });
            }
        }
    }

    loadedItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    afisha.splice(0, afisha.length, ...loadedItems);
    afishaLoaded = true;
    afishaLoading = false;
    return afisha;
}
