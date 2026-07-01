import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { achievements } from '../data/static';
import Achievements from '../components/Achievements';
import styles from './AchievementsPage.module.css';

function AchievementsPage() {
  const sortedAchievements = [...achievements].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
  });
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
          <Achievements achievements={sortedAchievements} />
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
