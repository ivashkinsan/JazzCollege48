import { useState, useEffect } from 'react';
import { loadAfisha } from '../data';
import type { AfishaItem } from '../types/college';
import Concerts from '../components/Concerts';
import styles from './AfishaPage.module.css'; // Assuming we'll create this CSS module
import { Helmet } from 'react-helmet-async';
import { searchAfisha } from '../utils/search';

function AfishaPage() {
  const [allAfisha, setAllAfisha] = useState<AfishaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [upcomingAfisha, setUpcomingAfisha] = useState<AfishaItem[]>([]);
  const [pastAfisha, setPastAfisha] = useState<AfishaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAfisha().then((data) => {
      setAllAfisha(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filteredAfisha = searchAfisha(searchQuery, allAfisha);
    const now = new Date();
    
    const upcoming = filteredAfisha
      .filter(item => new Date(item.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = filteredAfisha
      .filter(item => new Date(item.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setUpcomingAfisha(upcoming);
    setPastAfisha(past);
  }, [searchQuery, allAfisha]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return <div className="container">Загрузка афиш...</div>;
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Афиша мероприятий - JazzCollege48</title>
        <meta name="description" content="Полный список предстоящих и прошедших концертов, мастер-классов и событий эстрадного отделения Липецкого колледжа искусств." />
      </Helmet>
      
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.subtitle}>Афиша</p>
          <h2 className={styles.title}>Все события</h2>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className="container">
          <input
            type="text"
            placeholder="Поиск событий..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </section>
      
      <section className={styles.eventsSection}>
        <div className="container">
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
    </div>
  );
}

export default AfishaPage;
