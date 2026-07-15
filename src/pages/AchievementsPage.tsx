import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import type { Achievement } from '../types/college';
import Achievements from '../components/Achievements';
import YearFilter from '../components/YearFilter';
import styles from './AchievementsPage.module.css';
import { loadAchievements } from '../data/achievementsLoader';

// Helper to get unique years from achievement items
const getUniqueYears = (items: Achievement[]): number[] => {
  const years = items.map(item => new Date(item.date).getFullYear()).filter(year => !isNaN(year));
  return [...new Set(years)].sort((a, b) => b - a);
};

function AchievementsPage() {
  const [achievementsData, setAchievementsData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  
  const contentRef = useRef<HTMLElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await loadAchievements();
        setAchievementsData(data);
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);
  
  const uniqueYears = useMemo(() => getUniqueYears(achievementsData), [achievementsData]);

  const filteredAchievements = useMemo(() => {
    if (selectedYear === 'all') {
      return achievementsData;
    }
    return achievementsData.filter(item => new Date(item.date).getFullYear() === selectedYear);
  }, [achievementsData, selectedYear]);

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
      <Helmet>
        <title>Наши достижения - JazzCollege48</title>
        <meta name="description" content="Достижения студентов и преподавателей эстрадного отделения: лауреаты конкурсов, победители фестивалей." />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Наши достижения</h1>
          <p className={styles.subtitle}>Победы на конкурсах и фестивалях</p>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <YearFilter years={uniqueYears} selectedYear={selectedYear} onSelectYear={setSelectedYear} />
        </div>
      </section>
      
      <section ref={contentRef} className={styles.contentSection}>
        <div className="container">
          {loading ? (
            <p>Загрузка достижений...</p>
          ) : filteredAchievements.length > 0 ? (
            <Achievements achievements={filteredAchievements} hideTitle={true} />
          ) : (
            <p className={styles.empty}>Достижений за выбранный год не найдено.</p>
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

export default AchievementsPage;
