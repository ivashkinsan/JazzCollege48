import type { Video } from '../types/college';

// Helper to get embed URL based on video source
export const getEmbedUrl = (video: Video) => {
  try {
    const url = new URL(video.videoUrl);
    if (video.source === 'rutube') {
      // Example: https://rutube.ru/video/a4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9/ -> a4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9
      // Example: https://rutube.ru/video/private/5ebdfc5c594d14d955a9548f7f09205d/?p=... -> private/5ebdfc5c594d14d955a9548f7f09205d
      const pathParts = url.pathname.split('/').filter(Boolean);
      const videoId = pathParts.slice(1).join('/');
      return `https://rutube.ru/play/embed/${videoId}`;
    }
    if (video.source === 'youtube') {
      const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (video.source === 'yandex') {
      // Transforms https://disk.yandex.ru/i/VIDEO_ID to an embeddable URL
      if (url.pathname.startsWith('/i/')) {
        return `https://disk.yandex.ru/client/disk${url.pathname}?embed=1`;
      }
    }
    if (video.source === 'vk') {
      // Handles URLs like https://vk.com/video-123_456 or https://vkvideo.ru/video-123_456
      const videoIdentifier = url.pathname.split('/').pop(); // e.g., video-123_456
      if (videoIdentifier) {
        const parts = videoIdentifier.split('_');
        if (parts.length === 2) {
            const ownerId = parts[0].replace('video', ''); // from 'video-123' to '-123'
            const videoId = parts[1];
            if (ownerId && videoId) {
                return `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}`;
            }
        }
      }
    }
  } catch (error) {
    console.error(`Error parsing video URL: ${video.videoUrl}`, error);
    return '';
  }
  return '';
};