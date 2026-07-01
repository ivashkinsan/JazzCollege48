import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadNews } from '../data';
import type { ExtendedNewsItem } from '../types/college';
import Lightbox from '../components/Lightbox';
import styles from './NewsPage.module.css';
import { Helmet } from 'react-helmet-async';
import { searchNews } from '../utils/search';

const categoryLabels: Record<string, string> = {
  konzert: '🎵 Концерт',
  konkurs: '🏆 Конкурс',
  masterclass: '🎓 Мастер-класс',
  announcement: '📢 Объявление',
  '["news"]': 'Новости'
};

function NewsPage() {
  const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);
  const selectedCategory: string = '["news"]';
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

  useEffect(() => {
    loadNews().then(setNewsData);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredByCategory = newsData.filter(n => n.category === selectedCategory);
  const filteredNews = searchNews(searchQuery, filteredByCategory); // Use searchNews function

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
      <Helmet>
        <title>Новости отделения - JazzCollege48</title>
        <meta name="description" content="Последние новости, события, мастер-классы и концерты эстрадного отделения Липецкого колледжа искусств." />
      </Helmet>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Новости отделения</h1>
          <p className={styles.subtitle}>
            Концерты, мастер-классы, конкурсы и события эстрадного отделения
          </p>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className="container">
          <input
            type="text"
            placeholder="Поиск новостей..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
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
                // Removed 'hasGallery' variable
                // const hasGallery = item.gallery && item.gallery.length > 0;

                // FIX: Extract src strings from Photo objects
                const allImages = [
                  item.cover?.src,
                  ...(item.gallery?.map(p => p.src) || [])
                ].filter((src): src is string => !!src);

                return (
                  <article key={item.id} className={styles.newsCard}>
                    {/* Обложка */}
                    <div 
                      className={styles.newsCardCover}
                      onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
                    >
                      {item.cover?.src ? (
                        <img src={item.cover.src} alt={item.title} loading="lazy" />
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
                      {item.cover?.src && (
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
