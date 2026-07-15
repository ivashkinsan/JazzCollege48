import { useState, useEffect, useCallback } from 'react';
import styles from './ScrollToNext.module.css';

function ScrollToNext() {
  const [visible, setVisible] = useState(false);

  const findNextSection = useCallback(() => {
    const sections = Array.from(document.querySelectorAll('section[class*="section"]'));
    const viewportCenter = window.scrollY + (window.innerHeight / 2);

    return sections.find(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      return sectionTop > viewportCenter;
    });
  }, []);

  const handleScroll = useCallback(() => {
    const nextSection = findNextSection();
    // Hide button if we are near the bottom
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200;

    if (nextSection && !atBottom) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [findNextSection]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToNext = () => {
    const nextSection = findNextSection();
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button
      className={`${styles.scrollToNext} ${visible ? styles.visible : ''}`}
      onClick={scrollToNext}
      aria-label="К следующей секции"
    >
      ↓
    </button>
  );
}

export default ScrollToNext;
