import React from 'react';
import styles from './YearFilter.module.css';

interface YearFilterProps {
  years: number[];
  selectedYear: number | 'all';
  onSelectYear: (year: number | 'all') => void;
}

const YearFilter: React.FC<YearFilterProps> = ({ years, selectedYear, onSelectYear }) => {
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  return (
    <div className={styles.filterGroup}>
      <div className={styles.buttonRowWrapper}>
        <div className={styles.buttonRow}>
          <button
            className={`${styles.filterButton} ${selectedYear === 'all' ? styles.filterButtonActive : ''}`}
            onClick={(e) => { onSelectYear('all'); handleFilterClick(e); }}
          >
            Все года
          </button>
          {years.map(year => (
            <button
              key={year}
              className={`${styles.filterButton} ${selectedYear === year ? styles.filterButtonActive : ''}`}
              onClick={(e) => { onSelectYear(year); handleFilterClick(e); }}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearFilter;
