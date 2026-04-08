import { useState, useEffect, useCallback } from 'react';
import styles from './Lightbox.module.css';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose]);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div className={styles.lightboxContent}>
        {/* Закрыть */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Изображение — клик по фото НЕ закрывает */}
        <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentIndex]}
            alt={`Фото ${currentIndex + 1}`}
            className={styles.image}
          />
        </div>

        {/* Счётчик */}
        {images.length > 1 && (
          <div className={styles.counter} onClick={(e) => e.stopPropagation()}>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Навигация + Миниатюры */}
        {images.length > 1 && (
          <div className={styles.navBar} onClick={(e) => e.stopPropagation()}>
            <button className={styles.navBtn} onClick={goPrev}>‹</button>
            <div className={styles.thumbnails}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Миниатюра ${idx + 1}`}
                  className={`${styles.thumbnail} ${idx === currentIndex ? styles.thumbnailActive : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
            <button className={styles.navBtn} onClick={goNext}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lightbox;
