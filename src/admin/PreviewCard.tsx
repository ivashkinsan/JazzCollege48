/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// Importing the actual CSS modules from the components for maximum accuracy
import newsCardStyles from '../components/NewsPreview.module.css';
import concertCardStyles from '../components/ConcertsPreview.module.css';
import photoCardStyles from '../pages/PhotosPage.module.css';
import localStyles from './PreviewCard.module.css';

interface PreviewCardProps {
  formData: any;
  coverImageUrl: string | null;
  generatedPaths: {
    folderPath: string;
    fileName: string;
  };
}

const PreviewCard: React.FC<PreviewCardProps> = ({ formData, coverImageUrl, generatedPaths }) => {

  const { contentType, title, date, body, time, venue } = formData;

  const formattedDate = date ? new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : '';

  const renderNewsCard = () => (
    <article className={newsCardStyles.newsCard}>
      <div className={localStyles.previewCover} style={{ backgroundImage: `url(${coverImageUrl})` }}>
        {!coverImageUrl && 'Обложка'}
      </div>
      <div className={newsCardStyles.newsCardContent}>
        <div className={newsCardStyles.newsCardMeta}>
          <span className={newsCardStyles.newsCardCategory}>
            Новость
          </span>
          <div className={newsCardStyles.newsCardDate}>{formattedDate}</div>
        </div>
        <h3 className={newsCardStyles.newsCardTitle}>{title || 'Заголовок новости'}</h3>
        <p className={newsCardStyles.newsCardDescription}>
          {body ? `${body.slice(0, 150)}...` : 'Краткое описание...' }
        </p>
      </div>
    </article>
  );

  const renderAfishaCard = () => (
     <article className={concertCardStyles.concertCard}>
        <div className={localStyles.previewCover} style={{ backgroundImage: `url(${coverImageUrl})` }}>
           {!coverImageUrl && 'Обложка'}
        </div>
        <div className={concertCardStyles.concertCardContent}>
            <div className={concertCardStyles.concertCardMeta}>
                <span className={concertCardStyles.concertCardCategory}>
                    Афиша
                </span>
                <div className={concertCardStyles.concertCardDateText}>{formattedDate}</div>
            </div>
            <h3 className={concertCardStyles.concertCardTitle}>{title || 'Название события'}</h3>
            {venue && <p className={concertCardStyles.concertCardVenue}>📍 {venue}</p>}
            {time && <p className={concertCardStyles.concertCardTime}>🕐 {time}</p>}
            <p className={concertCardStyles.concertCardDescription}>
                {body ? `${body.slice(0, 150)}...` : 'Краткое описание...' }
            </p>
        </div>
    </article>
  );

  const renderPhotoAlbumCard = () => (
    <div className={photoCardStyles.photoCard}>
      <div className={photoCardStyles.photoWrapper}>
         <div className={localStyles.previewCover} style={{ backgroundImage: `url(${coverImageUrl})` }}>
            {!coverImageUrl && 'Обложка'}
        </div>
      </div>
      <div className={photoCardStyles.photoInfo}>
        <h3 className={photoCardStyles.photoTitle}>{title || 'Название альбома'}</h3>
        <span className={photoCardStyles.photoCategory}>Фотоальбом</span>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (contentType) {
      case 'news':
        return renderNewsCard();
      case 'afisha':
        return renderAfishaCard();
      case 'photoalbum':
        return renderPhotoAlbumCard();
      default:
        return renderNewsCard();
    }
  };

  return (
    <div className={localStyles.previewWrapper}>
        <h2>Предпросмотр</h2>
        {renderPreview()}
        <div className={localStyles.pathPreview}>
            <h4>Будет создано:</h4>
            <p>
                <strong>Папка:</strong>
                <code>{generatedPaths.folderPath || '...'}</code>
            </p>
            <p>
                <strong>Файл:</strong>
                <code>{generatedPaths.fileName || '...'}</code>
            </p>
        </div>
    </div>
  )
};

export default PreviewCard;
