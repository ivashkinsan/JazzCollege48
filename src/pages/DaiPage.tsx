import styles from './DaiPage.module.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function DaiPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Детская академия искусств - JazzCollege48</title>
        <meta name="description" content="Страница Детской академии искусств находится в разработке." />
      </Helmet>
      <section className={styles.underDevelopmentSection}>
        <div className="container">
          <h1 className={styles.underDevelopmentTitle}>Детская академия искусств</h1>
          <p className={styles.underDevelopmentText}>
            Страница находится в разработке. Пожалуйста, зайдите позже.
          </p>
          <Link to="/" className={styles.backLink}>
            ← На главную
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DaiPage;