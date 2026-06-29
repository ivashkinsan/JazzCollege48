import type { AfishaItem, Photo, PhotoAlbum } from '../types/college';
import { parseMarkdown, parseGalleryIds, stripGallery } from './parser';
import mediaManifest from './media-manifest.json';

// Create a lookup map for efficient access to media items by ID.
const allPhotos = (mediaManifest as PhotoAlbum[]).flatMap(album => album.photos);
const mediaMap = new Map<string, Photo>(allPhotos.map(photo => [photo.id, photo]));

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
    try {
        const response = await fetch('/media/manifest.json');
        if (!response.ok) {
            throw new Error('Failed to fetch content manifest');
        }
        const manifest = await response.json() as string[];

        const fetchPromises = manifest.map(path => fetch(path).then(res => res.text()));
        const allRawContent = await Promise.all(fetchPromises);

        const loadedItems: AfishaItem[] = [];
        for (const rawContent of allRawContent) {
            const parsed = parseMarkdown(rawContent);

            if (parsed && parsed.frontmatter.category?.replace(/[\[\]"]/g, '').split(',').map(c => c.trim()).includes('afisha')) {
                const { frontmatter, body } = parsed;
                const { title, date, time, venue, coverImageId, tags: tagsStr } = frontmatter;
                
                const galleryIds = parseGalleryIds(body);
                const cleanedBody = stripGallery(body);

                if (title && date) {
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
    } catch (error) {
        console.error("Error loading afisha content:", error);
        afishaLoaded = true; // Prevent retries on failure
    } finally {
        afishaLoading = false;
    }
    return afisha;
}
