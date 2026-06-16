import { useState, useMemo, useEffect } from 'react';
import { loadVideos } from '../data/dataLoaders';
import type { Video } from '../types/college';
import styles from './VideosPage.module.css';
import { Link } from 'react-router-dom';

// Извлечение ID видео из URL
const getVideoId = (url: string, source: string) => {
  try {
    const urlObj = new URL(url);
    if (source === 'youtube') {
      return urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
    }
    if (source === 'rutube') {
      const parts = urlObj.pathname.split('/');
      const videoIdWithQuery = parts[parts.length - 1] || parts[parts.length - 2];
      return videoIdWithQuery.split('?')[0];
    }
    if (source === 'vk') {
      return urlObj.searchParams.get('video') || '';
    }
  } catch {
    return '';
  }
  return '';
};

// Получение embed URL
const getEmbedUrl = (video: Video) => {
  const videoId = getVideoId(video.videoUrl, video.source);
  
  if (video.source === 'youtube') {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (video.source === 'rutube') {
    return `https://rutube.ru/play/embed/${videoId}`;
  }
  if (video.source === 'vk') {
    return `https://vk.com/video_ext.php?oid=${videoId}`;
  }
  return '';
};

function VideosPageTest() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadVideos().then((loadedVideos) => {
      if (!cancelled) {
        setVideos(loadedVideos);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [videos]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Видео (Тест)</h1>
          <p className={styles.subtitle}>
            Прямое встраивание iframe
          </p>
        </div>
      </section>

      <section className={styles.videosSection}>
        <div className="container">
          <div className={styles.videosGrid}>
            {sortedVideos.map((video) => (
              <article key={video.id} className={styles.videoCard}>
                <div className={styles.videoContainer}>
                  <iframe
                    src={getEmbedUrl(video)}
                    title={video.title}
                    allow="clipboard-write; autoplay"
                    allowFullScreen={true}
                    className={styles.videoFrame}
                  />
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <div className="container">
          <Link to="/videos" className={styles.backLink}>
            ← Назад к обычной странице видео
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default VideosPageTest;
