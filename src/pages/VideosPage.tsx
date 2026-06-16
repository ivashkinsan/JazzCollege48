import { Link } from 'react-router-dom';
import styles from './VideosPage.module.css';

function VideosPage() {
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
            <p>В данный момент видео отсутствуют.</p>
          </div>
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
