import type { ExtendedNewsItem } from '../types/college';

const API_BASE_URL = 'http://localhost:4000';

// --- In-Memory Cache ---
const contentCache = new Map<string, ExtendedNewsItem[]>();
const loadingPromises = new Map<string, Promise<ExtendedNewsItem[]>>();

/**
 * A generic function to load content from the API by category.
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
      console.log(`🚀 Fetching '${category}' content from API...`);
      const response = await fetch(`${API_BASE_URL}/api/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category}`);
      }
      const data = await response.json();
      contentCache.set(category, data);
      return data;
    } catch (error) {
      console.error(`Error loading '${category}' content from API:`, error);
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
