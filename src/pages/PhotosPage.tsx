import { useState, useMemo } from 'react';
import { photos } from '../data/collegeData';
import styles from './PhotosPage.module.css';
import { Link } from 'react-router-dom';

const categories = ['все', 'концерты', 'мастер-классы', 'будни', 'выпускные', 'другое'];

// Получение уникальных лет
const getUniqueYears = (photos: typeof photos) => {
  const years = photos.map(p => p.year);
  return [...new Set(years)].sort((a, b) => b - a);
};

function PhotosPage() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('все');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  const uniqueYears = useMemo(() => getUniqueYears(photos), []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const yearMatch = selectedYear === 'all' || photo.year === selectedYear;
      const categoryMatch = selectedCategory === 'все' || photo.category === selectedCategory;
      return yearMatch && categoryMatch;
    });
  }, [selectedYear, selectedCategory]);

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
            Найдено: {filteredPhotos.length} фото
          </div>

          {filteredPhotos.length === 0 ? (
            <p className={styles.empty}>
              По выбранным фильтрам фотографий не найдено
            </p>
          ) : (
            <div className={styles.photoGrid}>
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={styles.photoCard}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className={styles.photoWrapper}>
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className={styles.photo}
                      loading="lazy"
                    />
                    <div className={styles.photoOverlay}>
                      <span className={styles.photoYear}>{photo.year}</span>
                    </div>
                  </div>
                  <div className={styles.photoInfo}>
                    <h3 className={styles.photoTitle}>{photo.title}</h3>
                    <span className={styles.photoCategory}>{photo.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Модальное окно для просмотра фото */}
      {selectedPhoto && (
        <div className={styles.modal} onClick={() => setSelectedPhoto(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className={styles.modalImage}
            />
            <div className={styles.modalInfo}>
              <h3 className={styles.modalTitle}>{selectedPhoto.title}</h3>
              <p className={styles.modalMeta}>
                <span>{selectedPhoto.year} год</span>
                <span>•</span>
                <span>{selectedPhoto.category}</span>
              </p>
            </div>
          </div>
        </div>
      )}

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
