import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videos as staticVideos } from '../data/static/videos';
import type { Video } from '../types/college';
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


function VideosPage2() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [directUrls, setDirectUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // We are using static data, but this mimics loading
    setVideos(staticVideos);
  }, []);

  useEffect(() => {
    const fetchYandexLinks = async () => {
      const yandexVideos = videos.filter((v) => v.source === 'yandex');
      if (yandexVideos.length === 0) return;

      const promises = yandexVideos.map(async (video) => {
        try {
          const response = await fetch(
            `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(
              video.videoUrl
            )}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch Yandex Disk metadata for ${video.id}`);
          }
          const data = await response.json();
          if (data.href) {
            return { id: video.id, url: data.href };
          }
        } catch (error) {
          console.error(error);
          return null;
        }
        return null;
      });

      const results = await Promise.all(promises);
      const newUrls = results.reduce((acc, result) => {
        if (result) {
          acc[result.id] = result.url;
        }
        return acc;
      }, {} as Record<string, string>);

      setDirectUrls((prev) => ({ ...prev, ...newUrls }));
    };

    if (videos.length > 0) {
      fetchYandexLinks();
    }
  }, [videos]);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [videos]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Видео (v2)</h1>
          <p className={styles.subtitle}>
            Видеозаписи концертов, мастер-классов и мероприятий эстрадного отделения. С поддержкой Яндекс.Диска.
          </p>
        </div>
      </section>

      <section className={styles.videosSection}>
        <div className="container">
          <div className={styles.videosGrid}>
            {sortedVideos.map((video) => (
              <article key={video.id} className={styles.videoCard}>
                <div className={styles.videoContainer}>
                  {video.source === 'yandex' ? (
                    directUrls[video.id] ? (
                      <video
                        src={directUrls[video.id]}
                        controls
                        className={styles.videoFrame}
                        title={video.title}
                      />
                    ) : (
                      <div className={styles.loading}>Загрузка видео...</div>
                    )
                  ) : (
                    <iframe
                      src={getEmbedUrl(video)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoFrame}
                    ></iframe>
                  )}
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

export default VideosPage2;