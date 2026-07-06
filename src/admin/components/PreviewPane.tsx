import React from 'react';
import { TabType } from '../types';
import { getVersionedAssetUrl } from '../../utils/assetVersion';
import VideoCard from '../../components/VideoCard';
import { Video } from '../../types/college';
import styles from '../AdminApp.module.css';

interface PreviewPaneProps {
    activeTab: TabType;
    formData: any;
    selectedFiles: Map<string, File[]>;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ activeTab, formData, selectedFiles }) => {
    const renderPreview = () => {
        switch (activeTab) {
            case 'news': {
                const imageUrl = selectedFiles.has('coverImage') && selectedFiles.get('coverImage')![0]
                    ? URL.createObjectURL(selectedFiles.get('coverImage')![0])
                    : (formData.cover_image_src ? getVersionedAssetUrl(formData.cover_image_src) : undefined);
                
                return (
                    <article className="newsCard">
                        <div className="newsCardCover">
                            {imageUrl ? <img src={imageUrl} alt={formData.title} /> : <div>Нет изображения</div>}
                        </div>
                        <div className="newsCardContent">
                            <div className="newsCardMeta">
                                <span className="newsCardCategory">{formData.category || 'Новость'}</span>
                                <div className="newsCardDate">{formData.date || 'Дата'}</div>
                            </div>
                            <h3 className="newsCardTitle">{formData.title || 'Заголовок'}</h3>
                            <p className="newsCardDescription">{formData.body || 'Текст...'}</p>
                        </div>
                    </article>
                );
            }
            case 'afisha': {
                const imageUrl = selectedFiles.has('coverImage') && selectedFiles.get('coverImage')![0]
                    ? URL.createObjectURL(selectedFiles.get('coverImage')![0])
                    : (formData.cover_image_src ? getVersionedAssetUrl(formData.cover_image_src) : undefined);
                
                return (
                    <article className="concertCard">
                        <div className="concertCardCover">
                            {imageUrl ? <img src={imageUrl} alt={formData.title} /> : <div>Нет изображения</div>}
                        </div>
                        <div className="concertCardContent">
                            <h3 className="concertCardTitle">{formData.title || 'Название события'}</h3>
                            {formData.venue && <p className="concertCardVenue">📍 {formData.venue}</p>}
                            {formData.time && <p className="concertCardTime">🕐 {formData.time}</p>}
                        </div>
                    </article>
                );
            }
            case 'achievements': {
                const imageUrl = selectedFiles.has('image') && selectedFiles.get('image')![0]
                    ? URL.createObjectURL(selectedFiles.get('image')![0])
                    : (formData.image_src ? getVersionedAssetUrl(formData.image_src) : undefined);

                return (
                    <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
                        <article className="achievementCard">
                            <div className="achievementCardImageWrapper">
                                {imageUrl && <img src={imageUrl} alt={formData.title} className="achievementCardImage" />}
                                {formData.place && <span className="achievementCardPlace">{formData.place}</span>}
                            </div>
                            <div className="achievementCardContent">
                                <h3 className="achievementCardTitle">{formData.title || 'Название достижения'}</h3>
                                <p className="achievementCardStudent">{formData.student_name || 'Студент'}</p>
                                <p className="achievementCardCompetition">{formData.competition || 'Конкурс'}</p>
                            </div>
                        </article>
                    </div>
                );
            }
            case 'graduates': {
                const imageUrl = selectedFiles.has('image') && selectedFiles.get('image')![0]
                    ? URL.createObjectURL(selectedFiles.get('image')![0])
                    : (formData.image_src ? getVersionedAssetUrl(formData.image_src) : undefined);
                
                return (
                    <div className="featuredGrid" style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%' }}>
                        <article className="featuredCard">
                            <div className="featuredImageWrapper">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={formData.name} className="featuredImage" />
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center' }}>Нет фото</div>
                                )}
                                <div className="yearBadge">Выпуск {formData.graduation_year || '...'}</div>
                            </div>
                            <div className="featuredContent">
                                <h3 className="featuredName">{formData.name || 'Имя'}</h3>
                                <p className="featuredPosition">{formData.instrument || 'Инструмент'}</p>
                                <p className="featuredWorkplace">{formData.workplace || 'Место работы'}</p>
                                <p className="featuredBio">{formData.bio || 'Биография...'}</p>
                            </div>
                        </article>
                    </div>
                );
            }
            case 'videos': {
                const videoItemPreview: Video = {
                    id: formData.id || 'preview-id', 
                    title: formData.title || '',
                    description: formData.description || '',
                    videoUrl: formData.video_url || '',
                    source: formData.source || 'youtube',
                    date: formData.date || new Date().toISOString().split('T')[0]
                };
                return <VideoCard video={videoItemPreview} />;
            }
            case 'photoalbum': {
                return (
                    <div className="albumPreview">
                        <h3>{formData.title || 'Название альбома'}</h3>
                        <p>{formData.date || 'Дата'}</p>
                        <div className="albumGrid">
                            {formData.photos && formData.photos.map((photo: any, index: number) => (
                                <img key={index} src={getVersionedAssetUrl(photo.src)} alt="Альбом" className="albumImage" />
                            ))}
                            {selectedFiles.get('galleryImages') && selectedFiles.get('galleryImages')!.map((file, index) => (
                                <img key={index} src={URL.createObjectURL(file)} alt="Новое фото" className="albumImage" />
                            ))}
                        </div>
                    </div>
                );
            }
            default:
                return <p>Предпросмотр для этого раздела еще не реализован.</p>;
        }
    };
    return <div className={styles.previewBox}><h3>Предпросмотр</h3>{renderPreview()}</div>;
};

export default PreviewPane;
