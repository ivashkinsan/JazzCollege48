import { ExtendedNewsItem, AfishaItem } from '../types/college';

export function searchNews(query: string, newsItems: ExtendedNewsItem[]): ExtendedNewsItem[] {
  if (!query) {
    return newsItems;
  }

  const lowerCaseQuery = query.toLowerCase();

  return newsItems.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);
    const contentMatch = item.content?.toLowerCase().includes(lowerCaseQuery);
    // Add other fields if necessary, e.g., item.description
    return titleMatch || contentMatch;
  });
}

export function searchAfisha(query: string, afishaItems: AfishaItem[]): AfishaItem[] {
  if (!query) {
    return afishaItems;
  }

  const lowerCaseQuery = query.toLowerCase();

  return afishaItems.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerCaseQuery);
    const contentMatch = item.content?.toLowerCase().includes(lowerCaseQuery);
    const venueMatch = item.venue?.toLowerCase().includes(lowerCaseQuery);
    const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(lowerCaseQuery));
    
    return titleMatch || contentMatch || venueMatch || tagsMatch;
  });
}
