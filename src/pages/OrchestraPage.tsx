import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './OrchestraPage.module.css';

interface OrchestraData {
  title: string;
  description: string;
  gallery: { src: string; alt: string }[];
}

function OrchestraPage() {
  const [data, setData] = useState<OrchestraData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/orchestra.json');
        if (!response.ok) {
          throw new Error('Failed to fetch orchestra data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!data) {
    return <div className={styles.error}>Не удалось загрузить информацию об оркестре.</div>;
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{data.title} - JazzCollege48</title>
        <meta name="description" content={data.description.substring(0, 160)} />
      </Helmet>

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>{data.title}</h1>
        </div>
      </section>

      <div className={`container ${styles.contentWrapper}`}>
        <section className={styles.descriptionSection}>
          <p>{data.description}</p>
        </section>

        <section className={styles.gallerySection}>
          <h2 className={styles.galleryTitle}>Галерея</h2>
          <div className={styles.galleryGrid}>
            {data.gallery.map((photo, index) => (
              <div key={index} className={styles.galleryItem}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrchestraPage;
