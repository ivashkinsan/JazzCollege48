import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Lightbox.module.css';

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  
  // State for swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]); // Reset index if re-opened with a different initialIndex

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  // Keyboard navigation and body overflow handling
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, goPrev, goNext, onClose]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (isOpen && thumbnailsRef.current) {
      const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [currentIndex, isOpen]);
  
  // Swipe event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goNext();
    } else if (isRightSwipe) {
      goPrev();
    }
    
    // Reset after swipe
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <div className={styles.lightboxContent}>
        {/* Закрыть */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Изображение — клик по фото НЕ закрывает */}
        <div 
          className={styles.imageContainer} 
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
            <div className={styles.thumbnails} ref={thumbnailsRef}>
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
