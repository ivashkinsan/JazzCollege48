import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../types/college';
import { loadVideos } from '../data/videosLoader';
import styles from './VideosPage.module.css';

// Helper to get embed URL based on video source
const getEmbedUrl = (video: Video) => {
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
      // Example: https://vk.com/video-123_456
      const videoId = url.pathname.split('/').pop();
      return `https://vk.com/video_ext.php?oid=${videoId?.split('_')[0]}&id=${videoId?.split('_')[1]}`;
    }
  } catch (error) {
    console.error(`Error parsing video URL: ${video.videoUrl}`, error);
    return '';
  }
  return '';
};


function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await loadVideos();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Видео</h1>
          <p className={styles.subtitle}>
            Видеозаписи концертов, мастер-классов и мероприятий эстрадного отделения
          </p>
        </div>
      </section>

      <section className={styles.videosSection}>
        <div className="container">
          {loading ? (
            <p>Загрузка видео...</p>
          ) : (
            <div className={styles.videosGrid}>
              {videos.map((video) => (
                <article key={video.id} className={styles.videoCard}>
                  <div className={styles.videoContainer}>
                    <iframe
                      src={getEmbedUrl(video)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoFrame}
                    ></iframe>
                  </div>
                  <div className={styles.videoInfo}>
                    <h3 className={styles.videoTitle}>{video.title}</h3>
                    <p className={styles.videoDescription}>{video.description}</p>
                    <div className={styles.videoMeta}>
                      <span className={styles.videoDate}>
                        {new Date(video.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={styles.sourceBadge}>{video.source}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <div className="container">
          <Link to="/" className={styles.backLink}>
            ← На главную
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default VideosPage;