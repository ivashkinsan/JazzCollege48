import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadAfisha } from '../data';
import type { AfishaItem } from '../types/college';
import styles from './ConcertsPreview.module.css';
import Lightbox from './Lightbox'; // Import Lightbox

const categoryLabels: Record<string, string> = {
  концерты: '🎵 Концерт',
  'мастер-класс': '🎓 Мастер-класс',
  'фестиваль': '🎉 Фестиваль',
  // Добавьте другие категории по мере необходимости
};

function ConcertsPreview() {
  const [afishaData, setAfishaData] = useState<AfishaItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadAfisha().then(setAfishaData);
  }, []);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Берём только предстоящие события, сортируем от ближайших к дальним (максимум 3)
  const now = new Date();
  const upcoming = afishaData
    .filter(a => new Date(a.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section id="concerts" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Афиша</p>
          <h2 className="section__title">Предстоящие концерты</h2>
        </div>
        <div className={styles.concertsGrid}> {/* Changed to concertsGrid */}
          {upcoming.map((item) => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const primaryTag = item.tags && item.tags.length > 0 ? item.tags[0] : '';
            const category = primaryTag || 'концерты';

            // For afisha, we only expect one cover image, so the gallery will contain only that.
            const allImages = item.cover?.src ? [item.cover.src] : [];

            return (
              <article key={item.id} className={styles.concertCard}>
                <div
                  className={styles.concertCardCover}
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
                    <div className={styles.concertCardCoverPlaceholder}>
                      <span className={styles.coverPlaceholderIcon}>
                        {categoryLabels[category] || '🎵'}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.concertCardContent}>
                  {/* Category and Date moved here */}
                  <div className={styles.concertCardMeta}>
                    {category && (
                        <span className={styles.concertCardCategory}>
                            {categoryLabels[category] || category}
                        </span>
                    )}
                    <div className={styles.concertCardDateText}>{dateStr}</div>
                  </div>

                  <h3 className={styles.concertCardTitle}>{item.title}</h3>
                  {item.venue && <p className={styles.concertCardVenue}>📍 {item.venue}</p>}
                  {item.time && <p className={styles.concertCardTime}>🕐 {item.time}</p>}
                  <p className={styles.concertCardDescription}>
                    {item.content.slice(0, 180)}
                    {item.content.length > 180 && '...'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.moreLink}>
          <Link to="/afisha" className={styles.moreButton}>
            Вся афиша →
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

export default ConcertsPreview;
