import { useState, useEffect } from 'react';
import { loadAfisha } from '../data';
import type { AfishaItem } from '../types/college';
import Concerts from '../components/Concerts';
import styles from './AfishaPage.module.css'; // Assuming we'll create this CSS module

function AfishaPage() {
  const [upcomingAfisha, setUpcomingAfisha] = useState<AfishaItem[]>([]);
  const [pastAfisha, setPastAfisha] = useState<AfishaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAfisha().then((data) => {
      const now = new Date();
      const upcoming = data
        .filter(item => new Date(item.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Oldest to newest

      const past = data
        .filter(item => new Date(item.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest to oldest

      setUpcomingAfisha(upcoming);
      setPastAfisha(past);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="container">Загрузка афиш...</div>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Афиша</p>
          <h2 className="section__title">Все события</h2>
        </div>

        {upcomingAfisha.length > 0 && (
          <div className={styles.categoryBlock}>
            <h3 className={styles.categoryTitle}>Предстоящие события</h3>
            <Concerts concerts={upcomingAfisha} />
          </div>
        )}

        {pastAfisha.length > 0 && (
          <div className={styles.categoryBlock}>
            <h3 className={styles.categoryTitle}>Прошедшие события</h3>
            <Concerts concerts={pastAfisha} />
          </div>
        )}

        {upcomingAfisha.length === 0 && pastAfisha.length === 0 && (
          <p>Нет доступных событий.</p>
        )}
      </div>
    </section>
  );
}

export default AfishaPage;
