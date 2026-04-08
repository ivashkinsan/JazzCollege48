import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadAfisha, AfishaItem } from '../data/collegeData';
import styles from './ConcertsPreview.module.css';

function ConcertsPreview() {
  const [afishaData, setAfishaData] = useState<AfishaItem[]>([]);

  useEffect(() => {
    loadAfisha().then(setAfishaData);
  }, []);

  // Берём только предстоящие события, сортируем от ближайших к дальним (максимум 3)
  const now = new Date();
  const upcoming = afishaData
    .filter(a => new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section id="concerts" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Афиша</p>
          <h2 className="section__title">Предстоящие концерты</h2>
        </div>
        <div className={styles.concertsList}>
          {upcoming.map((item) => {
            const date = new Date(item.date);
            const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
            const month = date.toLocaleDateString('ru-RU', { month: 'long' });
            const year = date.toLocaleDateString('ru-RU', { year: 'numeric' });

            return (
              <article key={item.id} className={styles.concertCard}>
                <div className={styles.concertCardDate}>
                  <span className={styles.concertCardDay}>{day}</span>
                  <span className={styles.concertCardMonth}>{month}</span>
                  <span className={styles.concertCardYear}>{year}</span>
                </div>
                <div className={styles.concertCardContent}>
                  <h3 className={styles.concertCardTitle}>{item.title}</h3>
                  {item.venue && <p className={styles.concertCardVenue}>📍 {item.venue}</p>}
                  {item.time && <p className={styles.concertCardTime}>🕐 {item.time}</p>}
                  <p className={styles.concertCardDescription}>
                    {item.content.slice(0, 180)}
                    {item.content.length > 180 && '...'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.moreLink}>
          <Link to="/afisha" className={styles.moreButton}>
            Вся афиша →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ConcertsPreview;
