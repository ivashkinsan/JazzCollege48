import { Concert } from '../data/collegeData';
import './Concerts.css';

interface ConcertsProps {
  concerts: Concert[];
}

function Concerts({ concerts }: ConcertsProps) {
  return (
    <section id="concerts" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Афиша</p>
          <h2 className="section__title">Предстоящие концерты</h2>
        </div>
        <div className="concerts__list">
          {concerts.map((concert) => {
            const date = new Date(concert.date);
            const day = date.toLocaleDateString('ru-RU', { day: 'numeric' });
            const month = date.toLocaleDateString('ru-RU', { month: 'long' });
            const year = date.toLocaleDateString('ru-RU', { year: 'numeric' });
            return (
              <article key={concert.id} className="concert-card">
                <div className="concert-card__date">
                  <span className="concert-card__day">{day}</span>
                  <span className="concert-card__month">{month}</span>
                  <span className="concert-card__year">{year}</span>
                </div>
                <div className="concert-card__content">
                  <h3 className="concert-card__title">{concert.title}</h3>
                  <p className="concert-card__venue">📍 {concert.venue}</p>
                  {concert.time && <p className="concert-card__time">🕐 {concert.time}</p>}
                  <p className="concert-card__description">{concert.description}</p>
                  {concert.isFree && <span className="concert-card__free">Вход свободный</span>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Concerts;
