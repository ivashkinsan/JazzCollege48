import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadNews } from '../data';
import type { ExtendedNewsItem } from '../types/college';
import Lightbox from '../components/Lightbox';
import styles from './NewsPage.module.css';
import { Helmet } from 'react-helmet-async';
import { getVersionedAssetUrl } from '../utils/assetVersion';

import ReactMarkdown from 'react-markdown';

// Helper to get unique years from news items
const getUniqueYears = (items: ExtendedNewsItem[]): number[] => {
  const years = items.map(item => new Date(item.date).getFullYear()).filter(year => !isNaN(year));
  return [...new Set(years)].sort((a, b) => b - a);
};

// Static categories for filtering
const FILTER_CATEGORIES = ['все', 'концерты', 'мастер-классы', 'конкурсы', 'разное'];
const MAIN_CATEGORIES = ['концерты', 'мастер-классы', 'конкурсы'];

function NewsPage() {
  const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('все');

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Memoized values for filters
  const uniqueYears = useMemo(() => getUniqueYears(newsData), [newsData]);
  
  useEffect(() => {
    setLoading(true);
    loadNews().then(data => {
      setNewsData(data);
      setLoading(false);
    });
  }, []);

  // Combined filtering logic
  const filteredNews = useMemo(() => {
    return newsData.filter(item => {
      const yearMatch = selectedYear === 'all' || new Date(item.date).getFullYear() === selectedYear;
      
      let categoryMatch = true;
      if (selectedCategory === 'все') {
        categoryMatch = true;
      } else if (selectedCategory === 'разное') {
        categoryMatch = !MAIN_CATEGORIES.includes(item.subcategory || '');
      } else {
        categoryMatch = item.subcategory === selectedCategory;
      }
      
      return yearMatch && categoryMatch;
    });
  }, [newsData, selectedYear, selectedCategory]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };
  
  if (loading) {
    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>Новости</h1>
                    <p className={styles.subtitle}>Загрузка событий...</p>
                </div>
            </section>
        </div>
    );
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Новости и события - JazzCollege48</title>
        <meta name="description" content="Все события, новости, фотоотчеты, мастер-классы и концерты эстрадного отделения Липецкого колледжа искусств." />
      </Helmet>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Новости и события</h1>
          <p className={styles.subtitle}>
            Концерты, мастер-классы, конкурсы и все события эстрадного отделения
          </p>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.filterGroup}>
            <div className={styles.buttonRowWrapper}>
              <div className={styles.buttonRow}>
                <button 
                  className={`${styles.filterButton} ${selectedYear === 'all' ? styles.filterButtonActive : ''}`} 
                  onClick={(e) => { setSelectedYear('all'); handleFilterClick(e); }}
                >
                  Все
                </button>
                {uniqueYears.map(year => (
                    <button 
                      key={year} 
                      className={`${styles.filterButton} ${selectedYear === year ? styles.filterButtonActive : ''}`} 
                      onClick={(e) => { setSelectedYear(year); handleFilterClick(e); }}
                    >
                      {year}
                    </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.buttonRowWrapper}>
              <div className={styles.buttonRow}>
                {FILTER_CATEGORIES.map(category => (
                    <button 
                      key={category} 
                      className={`${styles.filterButton} ${selectedCategory === category ? styles.filterButtonActive : ''}`} 
                      onClick={(e) => { setSelectedCategory(category); handleFilterClick(e); }}
                    >
                      {category}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.newsSection}>
        <div className="container">
          <div className={styles.resultsInfo}>
            Найдено: {filteredNews.length} {filteredNews.length === 1 ? 'событие' : (filteredNews.length > 1 && filteredNews.length < 5) ? 'события' : 'событий'}
          </div>

          {filteredNews.length === 0 ? (
            <p className={styles.empty}>Событий по выбранным фильтрам не найдено.</p>
          ) : (
            <div className={styles.newsGrid}>
              {filteredNews.map((item) => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                const allImages = Array.from(new Set(item.gallery?.map(p => p.src) || [])).filter(Boolean).map(img => getVersionedAssetUrl(img as string));
                const coverImage = item.cover?.src ? getVersionedAssetUrl(item.cover.src) : allImages[0];

                return (
                  <article key={item.id} className={styles.newsCard}>
                    <div className={styles.newsCardCover} onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}>
                      {coverImage ? (
                        <img src={coverImage} alt={item.title} loading="lazy" />
                      ) : (
                        <div className={styles.newsCardCoverPlaceholder}>
                          <span className={styles.coverPlaceholderIcon}>📰</span>
                        </div>
                      )}
                      {coverImage && <div className={styles.coverOverlay}><span>🔍</span></div>}
                    </div>

                    <div className={styles.newsCardContent}>
                      <div className={styles.newsCardMeta}>
                        {item.subcategory && <span className={styles.newsCardCategory}>{item.subcategory}</span>}
                        <div className={styles.newsCardDate}>{dateStr}</div>
                      </div>
                      <h3 className={styles.newsCardTitle}><Link to={`/news/${item.slug}`}>{item.title}</Link></h3>
                      {item.description && <div className={styles.newsCardDescription}><ReactMarkdown>{item.description + '...'}</ReactMarkdown></div>}
                      <Link to={`/news/${item.slug}`} className={styles.expandBtn}>Подробнее →</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Lightbox images={lightboxImages} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
}

export default NewsPage;
