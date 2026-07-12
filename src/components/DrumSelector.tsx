import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './DrumSelector.module.css';

interface DrumSelectorProps {
  options: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
  label: string;
}

const ITEM_HEIGHT = 40;
const SCROLL_DEBOUNCE_DELAY = 150;

const DrumSelector: React.FC<DrumSelectorProps> = ({ options, value, onChange, label }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isWheeling = useRef(false);

  const getInitialIndex = () => Math.max(0, options.indexOf(value));
  const [highlightedIndex, setHighlightedIndex] = useState(getInitialIndex);
  
  // Установка начальной/измененной позиции
  useEffect(() => {
    const list = listRef.current;
    const targetIndex = getInitialIndex();
    if (list && targetIndex !== -1) {
      list.scrollTo({ top: targetIndex * ITEM_HEIGHT, behavior: 'smooth' });
      setHighlightedIndex(targetIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); 
  
  // Обработчик для КОЛЕСА МЫШИ
  const handleWheel = useCallback((e: React.WheelEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWheeling.current) return;
    isWheeling.current = true;

    const list = listRef.current;
    if (!list) return;
    
    const direction = Math.sign(e.deltaY);
    const currentScrollTop = list.scrollTop;
    const currentIdx = Math.round(currentScrollTop / ITEM_HEIGHT);
    const newIndex = Math.max(0, Math.min(options.length - 1, currentIdx + direction));
    
    list.scrollTo({ top: newIndex * ITEM_HEIGHT, behavior: 'smooth' });

    // Даем время на завершение анимации и сбрасываем флаг
    setTimeout(() => {
      isWheeling.current = false;
    }, 200);

  }, [options.length]);

  // Обработчик для ТАЧ-СКРОЛЛА и финального значения
  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    // Мгновенная подсветка
    const currentIndex = Math.round(list.scrollTop / ITEM_HEIGHT);
    if (currentIndex !== highlightedIndex) {
      setHighlightedIndex(currentIndex);
    }

    // Финальное значение после остановки
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (isWheeling.current) return; // Не обновляем значение во время скролла колесом

      const finalIndex = Math.round(list.scrollTop / ITEM_HEIGHT);
      const newValue = options[finalIndex];

      if (newValue !== undefined && newValue !== value) {
        onChange(newValue);
      }
    }, SCROLL_DEBOUNCE_DELAY);
  }, [highlightedIndex, options, value, onChange]);

  return (
    <div className={styles.selectorContainer}>
      <span className={styles.selectorLabel}>{label}</span>
      <div className={styles.drum}>
        <ul
          ref={listRef}
          className={styles.drumList}
          onWheel={handleWheel}
          onScroll={handleScroll}
        >
          <li style={{ height: ITEM_HEIGHT }} aria-hidden="true"></li>
          {options.map((option, index) => (
            <li
              key={`${label}-${option}`}
              className={`${styles.drumItem} ${index === highlightedIndex ? styles.isCentered : ''}`}
            >
              {option}
            </li>
          ))}
          <li style={{ height: ITEM_HEIGHT }} aria-hidden="true"></li>
        </ul>
        <div className={styles.highlight}></div>
      </div>
    </div>
  );
};

export default DrumSelector;

