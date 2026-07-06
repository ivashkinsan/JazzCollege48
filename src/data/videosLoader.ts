import type { Video } from '../types/college';

const videosCache = new Map<string, Video[]>();
const loadingPromises = new Map<string, Promise<Video[]>>();

export async function loadVideos(): Promise<Video[]> {
    const category = 'videos'; // For consistency with contentCache keys

    if (videosCache.has(category)) {
        return Promise.resolve(videosCache.get(category)!);
    }

    if (loadingPromises.has(category)) {
        return loadingPromises.get(category)!;
    }

    const promise = (async () => {
        try {
            const response = await fetch('/data/videos.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch static videos data. Status: ${response.status}`);
            }
            const data = await response.json();
            videosCache.set(category, data);
            return data;
        } catch (error) {
            console.error(`Error loading static videos content:`, error);
            return [];
        } finally {
            loadingPromises.delete(category);
        }
    })();

    loadingPromises.set(category, promise);
    return promise;
}