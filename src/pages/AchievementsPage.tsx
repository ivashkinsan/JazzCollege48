import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Achievement } from '../types/college';
import Achievements from '../components/Achievements';
import styles from './AchievementsPage.module.css';

function AchievementsPage() {
  const [achievementsData, setAchievementsData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const apiBase = import.meta.env.PROD ? window.location.origin : 'http://localhost:4000';
        const response = await fetch(`${apiBase}/api/achievements`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const data = await response.json();
        // The data is already sorted by date on the server, no need to sort again.
        setAchievementsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

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
      
      <section className={styles.contentSection}>
        <div className="container">
          {loading ? (
            <p>Загрузка достижений...</p>
          ) : (
            <Achievements achievements={achievementsData} hideTitle={true} />
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
