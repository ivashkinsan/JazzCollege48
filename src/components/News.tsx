import { NewsItem } from '../data/collegeData';
import './News.css';

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
        <div className="news__grid">
          {news.map((item) => {
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            return (
              <article key={item.id} className="news-card">
                <div className="news-card__date">{dateStr}</div>
                <h3 className="news-card__title">{item.title}</h3>
                <p className="news-card__description">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default News;
