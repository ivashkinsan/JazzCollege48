import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadNews, ExtendedNewsItem } from '../data/collegeData';
import Lightbox from '../components/Lightbox';
import styles from './NewsPage.module.css';

const categoryLabels: Record<string, string> = {
  konzert: '🎵 Концерт',
  konkurs: '🏆 Конкурс',
  masterclass: '🎓 Мастер-класс',
  announcement: '📢 Объявление'
};

function NewsPage() {
  const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadNews().then(setNewsData);
  }, []);

  const categories = ['all', ...new Set(newsData.map(n => n.category).filter((cat): cat is string => Boolean(cat)))];

  const filteredNews = selectedCategory === 'all'
    ? newsData
    : newsData.filter(n => n.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Новости отделения</h1>
          <p className={styles.subtitle}>
            Концерты, мастер-классы, конкурсы и события эстрадного отделения
          </p>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.categoryFilters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' ? 'Все' : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.newsSection}>
        <div className="container">
          <div className={styles.resultsInfo}>
            {filteredNews.length} {filteredNews.length === 1 ? 'новость' : filteredNews.length < 5 ? 'новости' : 'новостей'}
          </div>

          {filteredNews.length === 0 ? (
            <p className={styles.empty}>Новостей в этой категории пока нет</p>
          ) : (
            <div className={styles.newsGrid}>
              {filteredNews.map((item) => {
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const isExpanded = expandedNews === item.id;
                const hasGallery = item.gallery && item.gallery.length > 0;
                const allImages = [
                  item.cover,
                  ...(item.gallery || [])
                ].filter(Boolean) as string[];

                return (
                  <article key={item.id} className={styles.newsCard}>
                    {/* Обложка */}
                    <div 
                      className={styles.newsCardCover}
                      onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
                    >
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} loading="lazy" />
                      ) : (
                        <div className={styles.newsCardCoverPlaceholder}>
                          <span className={styles.coverPlaceholderIcon}>
                            {item.category === 'konzert' && '🎵'}
                            {item.category === 'konkurs' && '🏆'}
                            {item.category === 'masterclass' && '🎓'}
                            {item.category === 'announcement' && '📢'}
                            {!item.category && '📰'}
                          </span>
                        </div>
                      )}
                      {item.cover && (
                        <div className={styles.coverOverlay}>
                          <span>🔍</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.newsCardContent}>
                      {/* Категория и дата */}
                      <div className={styles.newsCardMeta}>
                        {item.category && (
                          <span className={styles.newsCardCategory}>
                            {categoryLabels[item.category] || item.category}
                          </span>
                        )}
                        <div className={styles.newsCardDate}>{dateStr}</div>
                      </div>

                      <h3 className={styles.newsCardTitle}>{item.title}</h3>
                      <p className={styles.newsCardDescription}>
                        {isExpanded ? item.content : item.description}
                        {item.content && item.content.length > item.description.length && !isExpanded && '...'}
                      </p>

                      {/* Галерея */}
                      {hasGallery && isExpanded && (
                        <div className={styles.newsCardGallery}>
                          {item.gallery!.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${item.title} - фото ${idx + 1}`}
                              loading="lazy"
                              className={styles.newsCardGalleryImage}
                              onClick={(e) => {
                                e.stopPropagation();
                                openLightbox(allImages, idx + 1);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Кнопка развернуть/свернуть */}
                      {item.content && item.content.length > item.description.length && (
                        <button
                          className={styles.expandBtn}
                          onClick={() => toggleExpand(item.id)}
                        >
                          {isExpanded ? 'Свернуть' : 'Читать далее →'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <div className="container">
          <Link to="/" className={styles.backLink}>
            ← На главную
          </Link>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

export default NewsPage;
