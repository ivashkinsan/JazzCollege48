import { useState } from 'react';
import { graduates, Graduate, asset } from '../data/collegeData';
import styles from './GraduatesPage.module.css';
import { Link } from 'react-router-dom';

// Группировка выпускников по пятилетиям
const groupByFiveYears = (graduatesList: Graduate[]) => {
  const groups: Record<string, Graduate[]> = {};
  
  graduatesList.forEach((graduate) => {
    const year = graduate.graduationYear;
    // Округляем год до ближайшего пятилетия вниз
    const fiveYearStart = Math.floor((year - 1981) / 5) * 5 + 1981;
    const fiveYearEnd = fiveYearStart + 4;
    const decade = `${fiveYearStart}-${fiveYearEnd}`;
    
    if (!groups[decade]) {
      groups[decade] = [];
    }
    groups[decade].push(graduate);
  });
  
  // Сортировка внутри пятилетий по году выпуска (старые сверху)
  Object.keys(groups).forEach((decade) => {
    groups[decade].sort((a, b) => a.graduationYear - b.graduationYear);
  });
  
  return groups;
};

const decades = [
  '1981-1985',
  '1986-1990',
  '1991-1995',
  '1996-2000',
  '2001-2005',
  '2006-2010',
  '2011-2015',
  '2016-2020',
  '2021-2025'
];

function GraduatesPage() {
  const [activeDecade, setActiveDecade] = useState<string>('1981-1985');
  const groupedGraduates = groupByFiveYears(graduates);

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
            {decades.map((decade) => {
              const hasGraduates = groupedGraduates[decade] && groupedGraduates[decade].length > 0;
              return (
                <button
                  key={decade}
                  className={`${styles.tab} ${activeDecade === decade ? styles.tabActive : ''}`}
                  onClick={() => setActiveDecade(decade)}
                  disabled={!hasGraduates}
                >
                  {decade}
                </button>
              );
            })}
          </div>

          <div className={styles.graduatesGrid}>
            {groupedGraduates[activeDecade]?.map((graduate) => (
              <article key={graduate.id} className={styles.graduateCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={graduate.image || asset('/foto/graduates/default.jpg')}
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
