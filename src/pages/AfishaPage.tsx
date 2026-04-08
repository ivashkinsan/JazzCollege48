import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadAfisha, AfishaItem } from '../data/collegeData';
import Lightbox from '../components/Lightbox';
import styles from './AfishaPage.module.css';

function AfishaPage() {
  const [afishaData, setAfishaData] = useState<AfishaItem[]>([]);
  const [expandedAfisha, setExpandedAfisha] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    loadAfisha().then((data) => {
      console.log('[AfishaPage] Получено афиш:', data.length, data.map(a => a.title));
      setAfishaData([...data]);
    });
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedAfisha(expandedAfisha === id ? null : id);
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Разделяем на предстоящие и прошедшие
  const now = new Date();
  const upcoming = afishaData.filter(a => new Date(a.date) >= now);
  const past = afishaData.filter(a => new Date(a.date) < now);

  const renderAfishaCard = (item: AfishaItem) => {
    const date = new Date(item.date);
    const dateStr = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const isExpanded = expandedAfisha === item.id;
    const hasGallery = item.gallery && item.gallery.length > 0;
    const allImages = [item.cover, ...(item.gallery || [])].filter(Boolean) as string[];

    return (
      <article key={item.id} className={styles.afishaCard}>
        {/* Обложка */}
        <div
          className={styles.afishaCardCover}
          onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}
        >
          {item.cover ? (
            <img src={item.cover} alt={item.title} loading="lazy" />
          ) : (
            <div className={styles.afishaCardCoverPlaceholder}>
              <span className={styles.coverPlaceholderIcon}>🎵</span>
            </div>
          )}
          {item.cover && (
            <div className={styles.coverOverlay}>
              <span>🔍</span>
            </div>
          )}
        </div>

        <div className={styles.afishaCardContent}>
          {/* Дата и время */}
          <div className={styles.afishaCardMeta}>
            <div className={styles.afishaCardDate}>
              <span className={styles.dateDay}>{date.getDate()}</span>
              <span className={styles.dateMonth}>
                {date.toLocaleDateString('ru-RU', { month: 'short' })}
              </span>
              <span className={styles.dateYear}>{date.getFullYear()}</span>
            </div>
            {item.time && <div className={styles.afishaCardTime}>{item.time}</div>}
            {item.venue && <div className={styles.afishaCardVenue}>{item.venue}</div>}
          </div>

          <h3 className={styles.afishaCardTitle}>{item.title}</h3>
          <p className={styles.afishaCardDescription}>
            {isExpanded ? item.content : item.content.slice(0, 200)}
            {!isExpanded && item.content.length > 200 && '...'}
          </p>

          {/* Галерея */}
          {hasGallery && isExpanded && (
            <div className={styles.afishaCardGallery}>
              {item.gallery!.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${item.title} - фото ${idx + 1}`}
                  loading="lazy"
                  className={styles.afishaCardGalleryImage}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(allImages, idx + 1);
                  }}
                />
              ))}
            </div>
          )}

          {/* Кнопка развернуть/свернуть */}
          {item.content.length > 200 && (
            <button
              className={styles.expandBtn}
              onClick={() => toggleExpand(item.id)}
            >
              {isExpanded ? 'Свернуть' : 'Подробнее →'}
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Афиша</h1>
          <p className={styles.subtitle}>
            Предстоящие концерты и события эстрадного отделения
          </p>
        </div>
      </section>

      {/* Предстоящие события */}
      {upcoming.length > 0 && (
        <section className={styles.afishaSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>🗓 Предстоящие события</h2>
            <div className={styles.afishaGrid}>
              {upcoming.map(renderAfishaCard)}
            </div>
          </div>
        </section>
      )}

      {/* Прошедшие события */}
      {past.length > 0 && (
        <section className={`${styles.afishaSection} ${styles.pastSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Прошедшие события</h2>
            <div className={styles.afishaGrid}>
              {past.map(renderAfishaCard)}
            </div>
          </div>
        </section>
      )}

      {afishaData.length === 0 && (
        <section className={styles.afishaSection}>
          <div className="container">
            <p className={styles.empty}>Афиша скоро будет обновлена</p>
          </div>
        </section>
      )}

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

export default AfishaPage;
