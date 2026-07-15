import { useState } from 'react';
import type { Achievement } from '../types/college';
import styles from './Achievements.module.css';
import AchievementCard from './AchievementCard';
import Lightbox from './Lightbox';

interface AchievementsProps {
  achievements: Achievement[];
  hideTitle?: boolean;
}

function Achievements({ achievements, hideTitle }: AchievementsProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const imageAchievements = achievements.filter(a => a.image);
  const galleryImageUrls = imageAchievements.map(a => a.image!);

  const openLightbox = (imageIndex: number) => {
    // This index is relative to the full 'achievements' array.
    // We need to find the correct index in the 'galleryImageUrls' array.
    const clickedAchievement = achievements[imageIndex];
    const galleryIndex = imageAchievements.findIndex(a => a.id === clickedAchievement.id);

    if (galleryIndex !== -1) {
      setLightboxImages(galleryImageUrls);
      setLightboxIndex(galleryIndex);
      setLightboxOpen(true);
    }
  };
  
  return (
    <section id="achievements" className="section section--dark">
      <div className="container">
        {!hideTitle && (
          <>
            <div className="section__header">
              <p className="section__subtitle">Награды</p>
              <h2 className="section__title">Наши достижения</h2>
            </div>
            <p className={styles.sectionIntro}>
              Студенты эстрадного отделения регулярно становятся лауреатами всероссийских и международных конкурсов
            </p>
          </>
        )}
        <div className={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              index={index}
              onImageClick={openLightbox}
            />
          ))}
        </div>
      </div>
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}

export default Achievements;
