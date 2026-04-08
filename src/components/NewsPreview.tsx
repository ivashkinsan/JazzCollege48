import { useState } from 'react';
import { ExtendedNewsItem } from '../data/collegeData';
import { Link } from 'react-router-dom';
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
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Берём только 3 последние новости
  const latestNews = news.slice(0, 3);

  if (latestNews.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

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
            const isExpanded = expandedNews === item.id;
            const hasFullContent = item.content && item.content.length > item.description.length;
            const hasGallery = item.gallery && item.gallery.length > 0;
            const allImages = [item.cover, ...(item.gallery || [])].filter(Boolean) as string[];

            return (
              <article key={item.id} className={styles.newsCard}>
                {/* Обложка или заглушка */}
                <div
                  className={styles.newsCardCover}
                  onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
                >
                  {item.cover ? (
                    <>
                      <img src={item.cover} alt={item.title} loading="lazy" />
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
                  <p className={styles.newsCardDescription}>
                    {isExpanded && item.content ? item.content : item.description}
                    {!isExpanded && hasFullContent && '...'}
                  </p>

                  {/* Мини-галерея */}
                  {hasGallery && isExpanded && (
                    <div className={styles.miniGallery}>
                      {item.gallery!.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${item.title} — фото ${idx + 1}`}
                          loading="lazy"
                          className={styles.miniGalleryImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(allImages, idx + 1);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Кнопка развернуть */}
                  {hasFullContent && (
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
