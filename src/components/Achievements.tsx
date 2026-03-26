import { Achievement } from '../data/collegeData';
import './Achievements.css';

interface AchievementsProps {
  achievements: Achievement[];
}

function Achievements({ achievements }: AchievementsProps) {
  return (
    <section id="achievements" className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Награды</p>
          <h2 className="section__title">Наши достижения</h2>
        </div>
        <p className="section__intro">
          Студенты эстрадного отделения регулярно становятся лауреатами всероссийских и международных конкурсов
        </p>
        <div className="achievements__grid">
          {achievements.map((achievement) => {
            const date = new Date(achievement.date);
            const dateStr = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
            return (
              <article key={achievement.id} className="achievement-card">
                <div className="achievement-card__placeholder">
                  <span className="achievement-card__icon">🏆</span>
                  <p className="achievement-card__hint">Диплом</p>
                </div>
                <div className="achievement-card__content">
                  <span className="achievement-card__place">{achievement.place}</span>
                  <h3 className="achievement-card__title">{achievement.title}</h3>
                  {achievement.studentName && (
                    <p className="achievement-card__student">{achievement.studentName}</p>
                  )}
                  <p className="achievement-card__competition">{achievement.competition}</p>
                  <div className="achievement-card__meta">
                    <span className="achievement-card__category">{achievement.category}</span>
                    <span className="achievement-card__date">{dateStr}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
