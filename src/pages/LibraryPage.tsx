import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { libraryCategories } from '../data/static/libraryLinks';
import styles from './LibraryPage.module.css';
import { useState } from 'react';

function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const allCategories = ['Все', ...libraryCategories.map(c => c.categoryTitle)];

  const filteredCategories = selectedCategory === 'Все'
    ? libraryCategories
    : libraryCategories.filter(c => c.categoryTitle === selectedCategory);

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Библиотека - JazzCollege48</title>
        <meta name="description" content="Полезные ссылки и ресурсы по джазовому образованию: видеоуроки, ноты, теория и многое другое." />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Библиотека</h1>
          <p className={styles.subtitle}>
            Полезные ссылки на образовательные ресурсы, ноты и видео
          </p>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className="container">
          <div className={styles.categoryFilters}>
            {allCategories.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.librarySection}>
        <div className="container">
          {filteredCategories.map((category) => (
            <div key={category.categoryTitle} className={styles.categoryWrapper}>
              <h2 className={styles.categoryTitle}>{category.categoryTitle}</h2>
              <div className={styles.linksGrid}>
                {category.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkCard}
                  >
                    <h3 className={styles.linkTitle}>{link.title}</h3>
                    <p className={styles.linkDescription}>{link.description}</p>
                    <span className={styles.linkUrl}>{new URL(link.url).hostname}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

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


export default LibraryPage;
