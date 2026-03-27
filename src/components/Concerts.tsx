import { Concert } from '../data/collegeData';
import styles from './Concerts.module.css';

interface ConcertsProps {
  concerts: Concert[];
}

function Concerts({ concerts }: ConcertsProps) {
  return (
    <section id="concerts" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Афиша</p>
          <h2 className="section__title">Предстоящие концерты</h2>
        </div>
        <div className={styles.concertsList}>
          {concerts.map((concert) => {
            const date = new Date(concert.date);
            const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
            const month = date.toLocaleDateString('ru-RU', { month: 'long' });
            const year = date.toLocaleDateString('ru-RU', { year: 'numeric' });
            return (
              <article key={concert.id} className={styles.concertCard}>
                <div className={styles.concertCardDate}>
                  <span className={styles.concertCardDay}>{day}</span>
                  <span className={styles.concertCardMonth}>{month}</span>
                  <span className={styles.concertCardYear}>{year}</span>
                </div>
                <div className={styles.concertCardContent}>
                  <h3 className={styles.concertCardTitle}>{concert.title}</h3>
                  <p className={styles.concertCardVenue}>📍 {concert.venue}</p>
                  {concert.time && <p className={styles.concertCardTime}>🕐 {concert.time}</p>}
                  <p className={styles.concertCardDescription}>{concert.description}</p>
                  {concert.isFree && <span className={styles.concertCardFree}>Вход свободный</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Concerts;
