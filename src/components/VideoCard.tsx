import React from 'react';
import type { Video } from '../types/college';
import { getEmbedUrl } from '../utils/videoUtils';
import styles from './VideoCard.module.css';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const embedUrl = getEmbedUrl(video);

  if (!embedUrl) {
    return (
      <article className={styles.videoCard} style={{ textAlign: 'center', color: 'var(--color-text-danger)' }}>
        <p>Не удалось загрузить видео "{video.title}"</p>
      </article>
    );
  }

  return (
    <article key={video.id} className={styles.videoCard}>
      <div className={styles.videoContainer}>
        <iframe
          src={embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.videoFrame}
        ></iframe>
      </div>
      <div className={styles.videoInfo}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description}</p>
        <div className={styles.videoMeta}>
          <span className={styles.videoDate}>
            {video.date ? new Date(video.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'Дата не указана'}
          </span>
          <span className={styles.sourceBadge}>{video.source}</span>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
