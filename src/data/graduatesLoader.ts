import type { Graduate } from '../types/college';

const graduatesCache = new Map<string, Graduate[]>();
const loadingPromises = new Map<string, Promise<Graduate[]>>();

export async function loadGraduates(): Promise<Graduate[]> {
    const category = 'graduates'; // For consistency with contentCache keys

    if (graduatesCache.has(category)) {
        return Promise.resolve(graduatesCache.get(category)!);
    }

    if (loadingPromises.has(category)) {
        return loadingPromises.get(category)!;
    }

    const promise = (async () => {
        const baseURL = import.meta.env.BASE_URL;
        try {
            const response = await fetch(`${baseURL}data/graduates.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch static graduates data. Status: ${response.status}`);
            }
            const data = await response.json();
            graduatesCache.set(category, data);
            return data;
        } catch (error) {
            console.error(`Error loading static graduates content:`, error);
            return [];
        } finally {
            loadingPromises.delete(category);
        }
    })();

    loadingPromises.set(category, promise);
    return promise;
}
