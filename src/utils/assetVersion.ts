// src/utils/assetVersion.ts

// Get the version from package.json exposed by Vite
const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'no-version';

/**
 * Appends a version query parameter to an asset URL for cache busting.
 * @param url The original asset URL.
 * @returns The URL with the version query parameter.
 */
export function getVersionedAssetUrl(url: string): string {
  if (!url) return url;

  // Check if the URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${APP_VERSION}`;
}
