import type { ExtendedNewsItem, Photo, PhotoAlbum } from '../types/college';
import { parseMarkdown, parseGalleryIds, stripGallery } from './parser';
import mediaManifest from './media-manifest.json';

// Create a lookup map for efficient access to media items by ID.
const allPhotos = (mediaManifest as PhotoAlbum[]).flatMap(album => album.photos);
const mediaMap = new Map<string, Photo>(allPhotos.map(photo => [photo.id, photo]));

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
  try {
    const response = await fetch('/media/manifest.json');
    if (!response.ok) {
        throw new Error('Failed to fetch content manifest');
    }
    const manifest = await response.json() as string[];

    const fetchPromises = manifest.map(path => fetch(path).then(res => res.text()));
    const allRawContent = await Promise.all(fetchPromises);
    
    const loadedItems: ExtendedNewsItem[] = [];
    for (const rawContent of allRawContent) {
        const parsed = parseMarkdown(rawContent);

        if (parsed && parsed.frontmatter.category?.replace(/[\[\]"]/g, '').split(',').map(c => c.trim()).includes('news')) {
            const { frontmatter, body } = parsed;
            const { title, date, category, coverImageId } = frontmatter;
            
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
                    description: cleanedBody.slice(0, 250).replace(/[#*_~`]/g, '').trim(),
                    content: cleanedBody,
                    category,
                    cover: coverPhoto,
                    gallery: galleryPhotos
                });
            }
        }
    }

    loadedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    news.splice(0, news.length, ...loadedItems);
    newsLoaded = true;

  } catch (error) {
    console.error("Error loading news content:", error);
    newsLoaded = true; // Prevent retries
  } finally {
    newsLoading = false;
  }
  
  return news;
}
