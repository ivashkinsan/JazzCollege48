import type { ExtendedNewsItem } from '../types/college';

// --- In-Memory Cache ---
const contentCache = new Map<string, ExtendedNewsItem[]>();
const loadingPromises = new Map<string, Promise<ExtendedNewsItem[]>>();

/**
 * A generic function to load content from static JSON files by category.
 * It includes in-memory caching to avoid redundant fetch calls.
 * @param category - The category to load (e.g., 'news', 'afisha').
 */
function loadContent(category: 'news' | 'afisha'): Promise<ExtendedNewsItem[]> {
  if (contentCache.has(category)) {
    return Promise.resolve(contentCache.get(category)!);
  }

  if (loadingPromises.has(category)) {
    return loadingPromises.get(category)!;
  }

  const promise = (async () => {
    try {
      const response = await fetch(`/data/${category}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch static ${category} data. Status: ${response.status}`);
      }
      const data = await response.json();
      contentCache.set(category, data);
      return data;
    } catch (error) {
      console.error(`Error loading static '${category}' content:`, error);
      return []; // Return empty array on error
    } finally {
      loadingPromises.delete(category);
    }
  })();

  loadingPromises.set(category, promise);
  return promise;
}

// --- Exported Loader Functions ---

export function loadNews(): Promise<ExtendedNewsItem[]> {
  return loadContent('news');
}

export function loadAfisha(): Promise<ExtendedNewsItem[]> {
  return loadContent('afisha');
}

// Immediately start loading both for faster perceived performance
loadNews();
loadAfisha();
