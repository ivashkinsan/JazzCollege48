import { useState } from 'react';
import type { ExtendedNewsItem } from '../types/college';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Lightbox from './Lightbox';
import styles from './NewsPreview.module.css';

interface NewsPreviewProps {
  news: ExtendedNewsItem[];
}

const categoryLabels: Record<string, string> = {
  konzert: '🎵 Концерт',
  konkurs: '🏆 Конкурс',
  masterclass: '🎓 Мастер-класс',
  announcement: '📢 Объявление'
};

function NewsPreview({ news }: NewsPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Берём только 3 последние новости
  const latestNews = news.slice(0, 3);

  if (latestNews.length === 0) return null;

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="news" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">События</p>
          <h2 className="section__title">Последние новости</h2>
        </div>

        <div className={styles.newsGrid}>
          {latestNews.map((item) => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const hasFullContent = item.content && item.content.length > item.description.length;
            
            // FIX: Extract src strings from Photo objects
            const allImages = [
              item.cover?.src,
              ...(item.gallery?.map(p => p.src) || [])
            ].filter((src): src is string => !!src);

            return (
              <article key={item.id} className={styles.newsCard}>
                {/* Обложка или заглушка */}
                <div
                  className={styles.newsCardCover}
                  onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
                >
                  {item.cover?.src ? (
                    <>
                      <img src={item.cover.src} alt={item.title} loading="lazy" />
                      <div className={styles.coverOverlay}>
                        <span>🔍</span>
                      </div>
                    </>
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
                  <div className={styles.newsCardDescription}>
                    <ReactMarkdown>
                      {item.description + (hasFullContent ? '...' : '')}
                    </ReactMarkdown>
                  </div>

                  {/* Кнопка "Подробнее" */}
                  {hasFullContent && (
                    <Link to={`/news/${item.slug}`} className={styles.expandBtn}>
                      Подробнее →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.moreLink}>
          <Link to="/news" className={styles.moreButton}>
            Все новости →
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}

export default NewsPreview;
