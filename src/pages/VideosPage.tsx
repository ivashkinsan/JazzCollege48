import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../types/college';
import { loadVideos } from '../data/videosLoader';
import styles from './VideosPage.module.css';
import VideoCard from '../components/VideoCard'; // Import VideoCard

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
                <VideoCard key={video.id} video={video} /> // Use VideoCard component
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