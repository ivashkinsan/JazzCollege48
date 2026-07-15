import { useState, useEffect, useRef } from 'react';
import { loadGraduates } from '../data';
import type { Graduate } from '../types/college';
import { asset } from '../utils/asset';
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
  'Все', // Добавлена опция "Все"
  '1981-1985',
  '1986-1990',
  '1991-1995',
  '1996-2000',
  '2001-2005',
  '2006-2010',
  '2011-2015',
  '2016-2020',
  '2021-2025',
  '2026-2030'
];

function GraduatesPage() {
  const [activeDecade, setActiveDecade] = useState<string>('Все'); // Активное десятилетие по умолчанию - "Все"
  const [graduatesList, setGraduatesList] = useState<Graduate[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    let cancelled = false;
    loadGraduates().then((data) => {
      if (!cancelled) setGraduatesList(data);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
  }, [activeDecade]);

  const groupedGraduates = groupByFiveYears(graduatesList);
  const graduatesToDisplay = activeDecade === 'Все' ? graduatesList : groupedGraduates[activeDecade];
  const isEmpty = !graduatesToDisplay || graduatesToDisplay.length === 0;

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
          <div className={styles.tabsStickyWrapper}>
            <div className={styles.tabs}>
              {decades.map((decade) => {
                const hasGraduatesForDecade = groupedGraduates[decade] && groupedGraduates[decade].length > 0;
                const isDisabled = decade !== 'Все' && !hasGraduatesForDecade; // 'Все' всегда включено
                return (
                  <button
                    key={decade}
                    className={`${styles.tab} ${activeDecade === decade ? styles.tabActive : ''}`}
                    onClick={() => setActiveDecade(decade)}
                    disabled={isDisabled}
                  >
                    {decade}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={contentRef} className={styles.graduatesGrid}>
            {graduatesToDisplay?.map((graduate) => (
              <article key={graduate.id} className={styles.graduateCard}>
                <div className={styles.imageWrapper}>
                  <img
                    src={graduate.image || asset('/foto/graduates/default.jpg')}
                    alt={graduate.name}
                    className={styles.image}
                  />
                  <div className={styles.year}>{graduate.graduationYear}</div>
                  {graduate.isFeatured && (
                    <span className={styles.featuredBadge}>★</span>
                  )}
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{graduate.name}</h3>
                  {graduate.instrument && (
                    <p className={styles.instrument}>{graduate.instrument}</p>
                  )}
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

          {isEmpty && (
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
            <Link to="/#contacts" className="btn btn--primary">
              Связаться с нами
            </Link>
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
