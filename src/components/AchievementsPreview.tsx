import { Link } from 'react-router-dom';
import type { Achievement } from '../types/college';
import styles from './AchievementsPreview.module.css';

interface AchievementsPreviewProps {
  achievements: Achievement[];
}

function AchievementsPreview({ achievements }: AchievementsPreviewProps) {
  const sortedAchievements = [...achievements].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
  });
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section__header">
          <p className="section__subtitle">Награды</p>
          <h2 className="section__title">Наши достижения</h2>
        </div>
        <p className={styles.sectionIntro}>
          Студенты эстрадного отделения регулярно становятся лауреатами всероссийских и международных конкурсов
        </p>
        <div className={styles.achievementsGrid}>
          {sortedAchievements.slice(0, 6).map((achievement) => { // Limit to 6 items
            const date = new Date(achievement.date);
            const dateStr = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
            return (
              <article key={achievement.id} className={styles.achievementCard}>
                {achievement.image ? (
                  <div className={styles.achievementCardImageWrapper}>
                    <img src={achievement.image} alt={achievement.title} className={styles.achievementCardImage} />
                    <span className={styles.achievementCardPlace}>{achievement.place}</span>
                  </div>
                ) : (
                  <div className={styles.achievementCardPlaceholder}>
                    <span className={styles.achievementCardIcon}>🏆</span>
                    <p className={styles.achievementCardHint}>Диплом</p>
                  </div>
                )}
                <div className={styles.achievementCardContent}>
                  <span className={styles.achievementCardPlace}>{achievement.place}</span>
                  <h3 className={styles.achievementCardTitle}>{achievement.title}</h3>
                  {achievement.studentName && (
                    <p className={styles.achievementCardStudent}>{achievement.studentName}</p>
                  )}
                  <p className={styles.achievementCardCompetition}>{achievement.competition}</p>
                  <div className={styles.achievementCardMeta}>
                    <span className={styles.achievementCardCategory}>{achievement.category}</span>
                    <span className={styles.achievementCardDate}>{dateStr}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className={styles.viewAllWrapper}>
          <Link to="/achievements" className="btn btn-primary">
            Все награды
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AchievementsPreview;
