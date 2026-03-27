import { Achievement } from '../data/collegeData';
import styles from './Achievements.module.css';

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
        <p className={styles.sectionIntro}>
          Студенты эстрадного отделения регулярно становятся лауреатами всероссийских и международных конкурсов
        </p>
        <div className={styles.achievementsGrid}>
          {achievements.map((achievement) => {
            const date = new Date(achievement.date);
            const dateStr = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
            return (
              <article key={achievement.id} className={styles.achievementCard}>
                <div className={styles.achievementCardPlaceholder}>
                  <span className={styles.achievementCardIcon}>🏆</span>
                  <p className={styles.achievementCardHint}>Диплом</p>
                </div>
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
      </div>
    </section>
  );
}

export default Achievements;
