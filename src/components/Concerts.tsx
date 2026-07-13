import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { useState } from 'react'; // Import useState
import type { AfishaItem } from '../types/college';
import styles from './Concerts.module.css';
import Lightbox from './Lightbox'; // Import Lightbox

interface ConcertsProps {
  concerts: AfishaItem[];
}

const categoryLabels: Record<string, string> = {
  концерты: '🎵 Концерт',
  'мастер-класс': '🎓 Мастер-класс',
  'фестиваль': '🎉 Фестиваль',
  // Добавьте другие категории по мере необходимости
};

function Concerts({ concerts }: ConcertsProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <> {/* Use Fragment to return multiple elements */}
      <div className={styles.concertsGrid}>
        {concerts.map((concert) => {
          const date = new Date(concert.date);
          const dateStr = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const primaryTag = concert.tags && concert.tags.length > 0 ? concert.tags[0] : '';
          const category = primaryTag || 'концерты';

          // For afisha, we only expect one cover image, so the gallery will contain only that.
          const allImages = concert.cover?.src ? [concert.cover.src] : [];

          return (
            <article key={concert.id} className={styles.concertCard}>
              <div
                className={styles.concertCardCover}
                onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
              >
                {concert.cover?.src ? (
                  <>
                    <img src={concert.cover.src} alt={concert.title} loading="lazy" />
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
                <div className={styles.concertCardMeta}>
                  {category && (
                      <span className={styles.concertCardCategory}>
                          {categoryLabels[category] || category}
                      </span>
                  )}
                  <div className={styles.concertCardDateText}>{dateStr}</div>
                </div>

                <h3 className={styles.concertCardTitle}>{concert.title}</h3>
                <p className={styles.concertCardVenue}>📍 {concert.venue}</p>
                {concert.time && <p className={styles.concertCardTime}>🕐 {concert.time}</p>}
                <div className={styles.concertCardDescription}><ReactMarkdown>{concert.content}</ReactMarkdown></div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

export default Concerts;
