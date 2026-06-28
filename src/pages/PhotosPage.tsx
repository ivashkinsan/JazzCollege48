import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import albums from '../data/media-manifest.json';
import Lightbox from '../components/Lightbox';
import styles from './PhotosPage.module.css';
import type { PhotoAlbum } from '../types/college';

const categories = ['все', 'концерты', 'мастер-классы', 'будни', 'выпускные', 'другое'];

// Получение уникальных лет из альбомов
const getUniqueYears = (albums: PhotoAlbum[]) => {
  const years = albums.map(a => new Date(a.albumDate).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a);
};

function PhotosPage() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('все');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  const uniqueYears = useMemo(() => getUniqueYears(albums as PhotoAlbum[]), []);

  const filteredAlbums = useMemo(() => {
    return (albums as PhotoAlbum[]).filter((album) => {
      const yearMatch = selectedYear === 'all' || new Date(album.albumDate).getFullYear() === selectedYear;
      const categoryMatch = selectedCategory === 'все' || album.albumCategory === selectedCategory;
      return yearMatch && categoryMatch;
    });
  }, [selectedYear, selectedCategory]);

  const openLightbox = (album: PhotoAlbum) => {
    const allImages = album.photos.map(p => p.src);
    setLightboxImages(allImages);
    setLightboxOpen(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Фотогалерея</h1>
          <p className={styles.subtitle}>
            Фотографии с концертов, мастер-классов и будней эстрадного отделения
          </p>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Год:</span>
              <div className={styles.yearButtons}>
                <button
                  className={`${styles.yearButton} ${selectedYear === 'all' ? styles.yearButtonActive : ''}`}
                  onClick={() => setSelectedYear('all')}
                >
                  Все
                </button>
                {uniqueYears.map((year) => (
                  <button
                    key={year}
                    className={`${styles.yearButton} ${selectedYear === year ? styles.yearButtonActive : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Категория:</span>
              <div className={styles.categoryButtons}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.categoryButton} ${selectedCategory === category ? styles.categoryButtonActive : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.resultsInfo}>
            Найдено: {filteredAlbums.length} {filteredAlbums.length === 1 ? 'альбом' : (filteredAlbums.length > 1 && filteredAlbums.length < 5) ? 'альбома' : 'альбомов'}
          </div>

          {filteredAlbums.length === 0 ? (
            <p className={styles.empty}>
              По выбранным фильтрам альбомов не найдено
            </p>
          ) : (
            <div className={styles.photoGrid}>
              {filteredAlbums.map((album) => (
                <div
                  key={album.albumId}
                  className={styles.photoCard}
                  onClick={() => openLightbox(album)}
                >
                  <div className={styles.photoWrapper}>
                    <img
                      src={album.photos[0]?.src}
                      alt={album.albumTitle}
                      className={styles.photo}
                      loading="lazy"
                    />
                    <div className={styles.photoOverlay}>
                      <span className={styles.photoYear}>{new Date(album.albumDate).getFullYear()}</span>
                    </div>
                  </div>
                  <div className={styles.photoInfo}>
                    <h3 className={styles.photoTitle}>{album.albumTitle}</h3>
                    <span className={styles.photoCategory}>{album.albumCategory}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={0}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

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

export default PhotosPage;
