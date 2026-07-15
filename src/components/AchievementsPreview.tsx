import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Achievement } from '../types/college';
import styles from './AchievementsPreview.module.css';
import AchievementCard from './AchievementCard';
import Lightbox from './Lightbox';

interface AchievementsPreviewProps {
  achievements: Achievement[];
}

function AchievementsPreview({ achievements }: AchievementsPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sortedAchievements = [...achievements].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Newest first
  }).slice(0, 6); // Limit to 6 items

  const imageAchievements = sortedAchievements.filter(a => a.image);
  const galleryImageUrls = imageAchievements.map(a => a.image!);

  const openLightbox = (imageIndex: number) => {
    // This index is relative to the full 'sortedAchievements' array.
    // We need to find the correct index in the 'galleryImageUrls' array.
    const clickedAchievement = sortedAchievements[imageIndex];
    const galleryIndex = imageAchievements.findIndex(a => a.id === clickedAchievement.id);

    if (galleryIndex !== -1) {
      setLightboxImages(galleryImageUrls);
      setLightboxIndex(galleryIndex);
      setLightboxOpen(true);
    }
  };

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
          {sortedAchievements.map((achievement, index) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement}
              index={index}
              onImageClick={openLightbox} 
            />
          ))}
        </div>
        <div className={styles.viewAllWrapper}>
          <Link to="/achievements" className="btn btn-primary">
            Все награды
          </Link>
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

export default AchievementsPreview;
