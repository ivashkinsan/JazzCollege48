import { useState, useMemo } from 'react';
import { videos } from '../data/collegeData';
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
      return parts[parts.length - 1] || parts[parts.length - 2];
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
const getEmbedUrl = (video: typeof videos[0]) => {
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

function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
          <div className={styles.videosGrid}>
            {sortedVideos.map((video) => (
              <article key={video.id} className={styles.videoCard}>
                <div className={styles.thumbnailWrapper}>
                  <img
                    src={video.thumbnail || '/video/thumbs/default.jpg'}
                    alt={video.title}
                    className={styles.thumbnail}
                    loading="lazy"
                  />
                  <button
                    className={styles.playButton}
                    onClick={() => setSelectedVideo(video)}
                    aria-label={`Смотреть: ${video.title}`}
                  >
                    ▶
                  </button>
                  <span className={styles.sourceBadge}>{video.source}</span>
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

      {/* Модальное окно для просмотра видео */}
      {selectedVideo && (
        <div className={styles.modal} onClick={() => setSelectedVideo(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedVideo(null)}>
              ✕
            </button>
            <div className={styles.videoContainer}>
              <iframe
                src={getEmbedUrl(selectedVideo)}
                title={selectedVideo.title}
                allow="clipboard-write; autoplay"
                className={styles.videoFrame}
              />
            </div>
            <div className={styles.modalInfo}>
              <h3 className={styles.modalTitle}>{selectedVideo.title}</h3>
              <p className={styles.modalDescription}>{selectedVideo.description}</p>
              <p className={styles.modalDate}>
                Опубликовано: {new Date(selectedVideo.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

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
