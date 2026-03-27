import { useState } from 'react';
import { graduates, Graduate } from '../data/collegeData';
import styles from './GraduatesPage.module.css';
import { Link } from 'react-router-dom';

// Группировка выпускников по десятилетиям
const groupByDecade = (graduatesList: Graduate[]) => {
  const groups: Record<string, Graduate[]> = {};
  
  graduatesList.forEach((graduate) => {
    const year = graduate.graduationYear;
    let decade: string;
    
    if (year >= 2020) decade = '2020-2026';
    else if (year >= 2010) decade = '2010-2019';
    else if (year >= 2000) decade = '2000-2009';
    else if (year >= 1990) decade = '1990-1999';
    else decade = 'Другие';
    
    if (!groups[decade]) {
      groups[decade] = [];
    }
    groups[decade].push(graduate);
  });
  
  // Сортировка внутри десятилетий по году выпуска (новые сверху)
  Object.keys(groups).forEach((decade) => {
    groups[decade].sort((a, b) => b.graduationYear - a.graduationYear);
  });
  
  return groups;
};

const decadeLabels: Record<string, string> = {
  '2020-2026': '2020-2026',
  '2010-2019': '2010-2019',
  '2000-2009': '2000-2009',
  '1990-1999': '1990-1999',
};

function GraduatesPage() {
  const [activeDecade, setActiveDecade] = useState<string>('2020-2026');
  const groupedGraduates = groupByDecade(graduates);
  const decades = Object.keys(groupedGraduates).filter(d => d !== 'Другие');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Выпускники эстрадного отделения</h1>
          <p className={styles.subtitle}>
            С 1981 года наше отделение выпустило более 1000 профессиональных музыкантов, 
            которые работают в ведущих коллективах страны
          </p>
        </div>
      </section>

      <section className={styles.tabsSection}>
        <div className="container">
          <div className={styles.tabs}>
            {decades.map((decade) => (
              <button
                key={decade}
                className={`${styles.tab} ${activeDecade === decade ? styles.tabActive : ''}`}
                onClick={() => setActiveDecade(decade)}
              >
                {decadeLabels[decade] || decade}
              </button>
            ))}
          </div>

          <div className={styles.graduatesGrid}>
            {groupedGraduates[activeDecade]?.map((graduate) => (
              <article key={graduate.id} className={styles.graduateCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={graduate.image || '/foto/graduates/default.jpg'}
                    alt={graduate.name}
                    className={styles.image}
                  />
                  {graduate.isFeatured && (
                    <span className={styles.featuredBadge}>★</span>
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.year}>{graduate.graduationYear}</div>
                  <h3 className={styles.name}>{graduate.name}</h3>
                  <p className={styles.position}>{graduate.position}</p>
                  {graduate.workplace && (
                    <p className={styles.workplace}>{graduate.workplace}</p>
                  )}
                  {graduate.bio && (
                    <p className={styles.bio}>{graduate.bio}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {(!groupedGraduates[activeDecade] || groupedGraduates[activeDecade].length === 0) && (
            <p className={styles.empty}>
              В этот период информация о выпускниках уточняется
            </p>
          )}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Вы выпускник эстрадного отделения?</h2>
            <p className={styles.ctaText}>
              Расскажите о себе! Мы будем рады обновить информацию о наших выпускниках.
            </p>
            <a href="#contacts" className="btn btn--primary">
              Связаться с нами
            </a>
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

export default GraduatesPage;
