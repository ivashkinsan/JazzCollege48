import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadNews } from '../data';
import type { ExtendedNewsItem } from '../types/college';
import Lightbox from '../components/Lightbox';
import styles from './NewsDetailPage.module.css';
import { Helmet } from 'react-helmet-async';
import { getVersionedAssetUrl } from '../utils/assetVersion';

import ReactMarkdown from 'react-markdown';

function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ExtendedNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    loadNews().then(allNews => {
      const currentItem = allNews.find(n => n.slug === slug);
      if (currentItem) {
        setItem(currentItem);
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, [slug]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return <div className={styles.status}>Загрузка...</div>;
  }

  if (error || !item) {
    return <div className={styles.status}>Новость не найдена.</div>;
  }

  const allImages = Array.from(new Set(item.gallery?.map(p => p.src) || [])).filter(Boolean).map(img => getVersionedAssetUrl(img as string));
  const coverImage = item.cover?.src ? getVersionedAssetUrl(item.cover.src) : allImages[0];
  const dateStr = new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={styles.page}>
      <Helmet>
        <title>{`${item.title} - Новости - JazzCollege48`}</title>
        <meta name="description" content={item.description} />
      </Helmet>
      
      <article className={`container ${styles.articleContainer}`}>
        <header className={styles.header}>
          {item.subcategory && <p className={styles.subcategory}>{item.subcategory}</p>}
          <h1 className={styles.title}>{item.title}</h1>
          <p className={styles.date}>{dateStr}</p>
        </header>

        {coverImage && (
          <div className={styles.coverImageWrapper} onClick={() => allImages.length > 0 && openLightbox(allImages, 0)}>
            <img src={coverImage} alt={item.title} className={styles.coverImage} />
            <div className={styles.coverOverlay}><span>🔍</span></div>
          </div>
        )}

        {item.content && (
            <ReactMarkdown className={styles.contentBody}>{item.content}</ReactMarkdown>
        )}

        {allImages.length > 1 && (
          <section className={styles.gallerySection}>
            <h2>Галерея</h2>
            <div className={styles.galleryGrid}>
              {allImages.map((src, index) => (
                <div key={src} className={styles.galleryImageWrapper} onClick={() => openLightbox(allImages, index)}>
                  <img src={src} alt={`${item.title} - фото ${index + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <footer className={styles.pageFooter}>
        <div className="container">
          <Link to="/news" className={styles.backLink}>← Ко всем новостям</Link>
        </div>
      </footer>

      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

export default NewsDetailPage;
