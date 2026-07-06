// src/utils/assetVersion.ts

// Get the version from package.json exposed by Vite
const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'no-version';

/**
 * Appends a version query parameter to an asset URL for cache busting.
 * @param url The original asset URL.
 * @returns The URL with the version query parameter.
 */
const BASE_URL = import.meta.env.BASE_URL;

export function getVersionedAssetUrl(url: string): string {
  if (!url) return url;

  let processedUrl = url;
  // Prepend BASE_URL if the URL is a relative path (not starting with http/https or a slash)
  // or if it starts with a slash, implying it's relative to the root of the domain,
  // but needs to be relative to the BASE_URL
  if (processedUrl.startsWith('/') && BASE_URL !== '/') {
    processedUrl = `${BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL}${processedUrl}`;
  } else if (!processedUrl.startsWith('http')) {
    // This case might be for truly relative paths like "image.jpg"
    // For now, we assume all static assets are referenced from the root or BASE_URL
    // and rely on Vite's asset handling or ensure they start with '/' if meant for public dir
  }

  // Check if the URL already has query parameters
  const separator = processedUrl.includes('?') ? '&' : '?';
  return `${processedUrl}${separator}v=${APP_VERSION}`;
}
