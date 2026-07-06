import type { Achievement } from '../types/college';

const achievementsCache = new Map<string, Achievement[]>();
const loadingPromises = new Map<string, Promise<Achievement[]>>();

export async function loadAchievements(): Promise<Achievement[]> {
    const category = 'achievements'; // For consistency with contentCache keys

    if (achievementsCache.has(category)) {
        return Promise.resolve(achievementsCache.get(category)!);
    }

    if (loadingPromises.has(category)) {
        return loadingPromises.get(category)!;
    }

    const promise = (async () => {
        try {
            const response = await fetch('/data/achievements.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch static achievements data. Status: ${response.status}`);
            }
            const data = await response.json();
            achievementsCache.set(category, data);
            return data;
        } catch (error) {
            console.error(`Error loading static achievements content:`, error);
            return [];
        } finally {
            loadingPromises.delete(category);
        }
    })();

    loadingPromises.set(category, promise);
    return promise;
}