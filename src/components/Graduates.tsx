import { Graduate, asset } from '../data/collegeData';
import styles from './Graduates.module.css';
import { Link } from 'react-router-dom';

interface GraduatesProps {
  graduates: Graduate[];
}

function Graduates({ graduates }: GraduatesProps) {
  // Фильтруем только избранных выпускников для блока "Наша гордость"
  const featuredGraduates = graduates.filter(g => g.isFeatured);

  return (
    <section id="graduates" className={styles.graduates}>
      <div className="container">
        <h2 className={styles.title}>Наша гордость</h2>
        <p className={styles.subtitle}>
          Выпускники эстрадного отделения, добившиеся значительных успехов в профессии
        </p>

        <div className={styles.featuredGrid}>
          {featuredGraduates.map((graduate) => (
            <article key={graduate.id} className={styles.featuredCard}>
              <div className={styles.featuredImageWrapper}>
                <img
                  src={graduate.image || asset('/foto/graduates/default.jpg')}
                  alt={graduate.name}
                  className={styles.featuredImage}
                />
                <div className={styles.yearBadge}>
                  Выпуск {graduate.graduationYear}
                </div>
              </div>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredName}>{graduate.name}</h3>
                <p className={styles.featuredPosition}>{graduate.position}</p>
                <p className={styles.featuredWorkplace}>{graduate.workplace}</p>
                <p className={styles.featuredBio}>{graduate.bio}</p>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <Link to="/graduates" className="btn btn--primary">
            Все выпускники
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Graduates;
