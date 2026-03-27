import { NewsItem } from '../data/collegeData';
import styles from './News.module.css';

interface NewsProps {
  news: NewsItem[];
}

function News({ news }: NewsProps) {
  return (
    <section id="news" className="section section--black">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">События</p>
          <h2 className="section__title">Новости отделения</h2>
        </div>
        <div className={styles.newsGrid}>
          {news.map((item) => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            return (
              <article key={item.id} className={styles.newsCard}>
                <div className={styles.newsCardDate}>{dateStr}</div>
                <h3 className={styles.newsCardTitle}>{item.title}</h3>
                <p className={styles.newsCardDescription}>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default News;
