import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../types/college';
import { loadVideos } from '../data/videosLoader';
import styles from './VideosPage.module.css';
import VideoCard from '../components/VideoCard';
import YearFilter from '../components/YearFilter';

// Helper to get unique years from video items
const getUniqueYears = (items: Video[]): number[] => {
  const years = items.map(item => new Date(item.date).getFullYear()).filter(year => !isNaN(year));
  return [...new Set(years)].sort((a, b) => b - a);
};

function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  
  const contentRef = useRef<HTMLElement>(null);
  const isInitialLoad = useRef(true);

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

  const uniqueYears = useMemo(() => getUniqueYears(videos), [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedYear === 'all') {
      return videos;
    }
    return videos.filter(item => new Date(item.date).getFullYear() === selectedYear);
  }, [videos, selectedYear]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedYear]);

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

      <section className={styles.filtersSection}>
        <div className="container">
          <YearFilter years={uniqueYears} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        </div>
      </section>

      <section ref={contentRef} className={styles.videosSection}>
        <div className="container">
          {loading ? (
            <p>Загрузка видео...</p>
          ) : filteredVideos.length > 0 ? (
            <div className={styles.videosGrid}>
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} /> // Use VideoCard component
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Видео за выбранный год не найдено.</p>
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