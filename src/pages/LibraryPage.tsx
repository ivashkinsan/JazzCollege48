import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styles from './LibraryPage.module.css';
import { useState, useEffect, useMemo } from 'react';

interface LibraryLink {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
}

function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [allCategories, setAllCategories] = useState<string[]>(['Все']);
  const [links, setLinks] = useState<LibraryLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data/library.json`); // Fetch static JSON
        if (!response.ok) {
          throw new Error('Failed to fetch library data');
        }
        const fullData = await response.json(); // Get all data

        const categoriesFromData = fullData.categories || [];
        // On first load, also set the categories for the filter buttons
        if (allCategories.length === 1) { // Check if 'Все' is the only category
          setAllCategories(['Все', ...categoriesFromData]);
        }

        // Filter links based on selectedCategory AFTER fetching all data
        const filteredLinks = selectedCategory === 'Все'
          ? fullData.links
          : fullData.links.filter((link: LibraryLink) => link.category === selectedCategory);

        setLinks(filteredLinks || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [selectedCategory]); // Re-fetch when selectedCategory changes

  // Group links by category for rendering
  const groupedLinks = useMemo(() => {
    return links.reduce((acc, link) => {
      (acc[link.category] = acc[link.category] || []).push(link);
      return acc;
    }, {} as Record<string, LibraryLink[]>);
  }, [links]);

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
                disabled={loading}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.librarySection}>
        <div className="container">
          {loading ? (
            <p>Загрузка...</p>
          ) : Object.keys(groupedLinks).length > 0 ? (
            Object.entries(groupedLinks).map(([category, categoryLinks]) => (
              <div key={category} className={styles.categoryWrapper}>
                <h2 className={styles.categoryTitle}>{category}</h2>
                <div className={styles.linksGrid}>
                  {categoryLinks.map((link) => (
                    <a
                      key={link.id}
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
            ))
          ) : (
            <p>Нет ссылок в данной категории.</p>
          )}
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
