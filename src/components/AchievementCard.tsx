import React from 'react';
import { getVersionedAssetUrl } from '../utils/assetVersion';
import type { Achievement } from '../types/college';
import styles from './AchievementCard.module.css';

interface AchievementCardProps {
  achievement: Achievement;
  index: number;
  onImageClick?: (index: number) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, index, onImageClick }) => {
  const date = new Date(achievement.date);
  const dateStr = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

  const handleImageClick = () => {
    if (achievement.image && onImageClick) {
      onImageClick(index);
    }
  };

  return (
    <article className={styles.achievementCard}>
      {achievement.image ? (
        <div 
          className={styles.achievementCardImageWrapper}
          onClick={handleImageClick}
        >
          <img 
            src={getVersionedAssetUrl(achievement.image)} 
            alt={achievement.title} 
            className={styles.achievementCardImage} 
            loading="lazy"
          />
          <span className={styles.achievementCardPlace}>{achievement.place}</span>
        </div>
      ) : (
        <div className={styles.achievementCardPlaceholder}>
          <span className={styles.achievementCardIcon}>🏆</span>
          <p className={styles.achievementCardHint}>Диплом</p>
        </div>
      )}
      <div className={styles.achievementCardContent}>
        <h3 className={styles.achievementCardTitle}>{achievement.title}</h3>
        {achievement.studentName && (
          <p className={styles.achievementCardStudent}>{achievement.studentName}</p>
        )}
        <p className={styles.achievementCardCompetition}>{achievement.competition}</p>
        <div className={styles.achievementCardMeta}>
          <span className={styles.achievementCardMetaPlace}>{achievement.place}</span>
          <span className={styles.achievementCardDate}>{dateStr}</span>
        </div>
      </div>
    </article>
  );
};

export default AchievementCard;
