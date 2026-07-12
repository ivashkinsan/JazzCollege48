import React from 'react';
import { TabType } from '../types';
import { getVersionedAssetUrl } from '../../utils/assetVersion';
import styles from '../AdminApp.module.css';

interface AdminFormFieldsProps {
    activeTab: TabType;
    formData: any;
    selectedFiles: Map<string, File[]>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteImage: (imageId: number) => void;
    photoAlbumsForSelection: { value: number; label: string }[];
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AdminFormFields: React.FC<AdminFormFieldsProps> = ({ 
    activeTab, formData, selectedFiles, handleInputChange, handleFileChange, handleDeleteImage, photoAlbumsForSelection, setFormData 
}) => {
    switch (activeTab) {
        case 'news':
        case 'afisha':
            return (
                <>
                    <div className={styles.formGroup}><label>Заголовок</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>URL (slug)</label><input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Дата</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required /></div>
                    {activeTab === 'afisha' && (
                        <>
                            <div className={styles.formGroup}><label>Время</label><input type="text" name="time" value={formData.time || ''} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label>Место</label><input type="text" name="venue" value={formData.venue || ''} onChange={handleInputChange} /></div>
                        </>
                    )}
                    <div className={styles.formGroup}>
                        <label>Изображение обложки</label>
                        {selectedFiles.has('coverImage') && selectedFiles.get('coverImage')![0] ? (
                            <div>
                                <img src={URL.createObjectURL(selectedFiles.get('coverImage')![0])} alt="Новая обложка" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                                <p>Новый файл: {selectedFiles.get('coverImage')![0].name}</p>
                            </div>
                        ) : formData.cover_image_src && (
                            <div>
                                <img src={getVersionedAssetUrl(formData.cover_image_src)} alt="Текущая обложка" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                                <p>Текущий путь: {formData.cover_image_src}</p>
                            </div>
                        )}
                        <div className={styles.fileInputWrapper}>
                            <label className={styles.fileInputLabel} htmlFor="coverImageInput">Выберите файл</label>
                            <input id="coverImageInput" type="file" name="coverImage" onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Дополнительные фото для галереи</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            {formData.photos && formData.photos.map((photo: any) => {
                                if (photo.src === formData.cover_image_src) return null; // Don't show cover image here
                                return (
                                    <div key={photo.id} className={styles.thumbnailContainer}>
                                        <img src={getVersionedAssetUrl(photo.src)} alt={`Фото ${photo.id}`} className={styles.thumbnail} />
                                        <button 
                                            type="button" 
                                            className={styles.deleteThumbnailButton} 
                                            onClick={() => handleDeleteImage(photo.id)}
                                            title="Удалить изображение"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                );
                            })}
                            {selectedFiles.get('galleryImages') && selectedFiles.get('galleryImages')!.map((file, index) => (
                                <div key={file.name + index} className={styles.thumbnailContainer}>
                                    <img src={URL.createObjectURL(file)} alt={`Новая ${file.name}`} className={styles.thumbnail} onLoad={() => URL.revokeObjectURL(file.name)} />
                                    <span className={styles.newFileIndicator}>Новое</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.fileInputWrapper}>
                            <label className={styles.fileInputLabel} htmlFor="galleryImagesInput">Выберите файлы</label>
                            <input id="galleryImagesInput" type="file" name="galleryImages" multiple onChange={handleFileChange} accept="image/*" />
                        </div>
                    </div>
                    <div className={styles.formGroup}><label>Основной текст (Markdown)</label><textarea name="body" value={formData.body || ''} onChange={handleInputChange} rows={10}></textarea></div>
                    <div className={styles.formGroup}>
                        <label>Связанный фотоальбом</label>
                        <select name="linked_photoalbum_id" value={String(formData.linked_photoalbum_id || '')} onChange={handleInputChange}>
                            <option value="">— Нет —</option>
                            {photoAlbumsForSelection.map(album => (
                                <option key={album.value} value={String(album.value)}>{album.label}</option>
                            ))}
                        </select>
                    </div>
                </>
            );
        case 'achievements': return (
            <>
                <div className={styles.formGroup}><label>Название</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Студент/Участник</label><input type="text" name="student_name" value={formData.student_name || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Конкурс/Событие</label><input type="text" name="competition" value={formData.competition || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Дата</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Место проведения</label><input type="text" name="city" value={formData.city || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Награда</label><input type="text" name="place" value={formData.place || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}>
                    <label>Изображение (диплом/сертификат)</label>
                    {selectedFiles.has('image') && selectedFiles.get('image')![0] ? (
                        <div>
                            <img src={URL.createObjectURL(selectedFiles.get('image')![0])} alt="Новое изображение" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                            <p>Новый файл: /Diploms/{selectedFiles.get('image')![0].name}</p>
                        </div>
                    ) : formData.image_src && (
                        <div>
                            <img src={getVersionedAssetUrl(formData.image_src)} alt="Текущее изображение" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                            <p>Текущий путь: {formData.image_src}</p>
                        </div>
                    )}
                    <div className={styles.fileInputWrapper}>
                            <label className={styles.fileInputLabel} htmlFor="imageInput">Выберите файл</label>
                            <input id="imageInput" type="file" name="image" onChange={handleFileChange} />
                        </div>
                </div>
            </>
        );
        case 'graduates': return (
            <>
                <div className={styles.formGroup}><label>Имя</label><input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Год выпуска</label><input type="number" name="graduation_year" value={formData.graduation_year || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Инструмент</label><input type="text" name="instrument" value={formData.instrument || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Место работы</label><input type="text" name="workplace" value={formData.workplace || ''} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}>
                    <label>Фотография</label>
                    {selectedFiles.has('image') && selectedFiles.get('image')![0] ? (
                        <div>
                            <img src={URL.createObjectURL(selectedFiles.get('image')![0])} alt="Новое фото" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                            <p>Новый файл: /vipuskniki/{selectedFiles.get('image')![0].name}</p>
                        </div>
                    ) : formData.image_src && (
                        <div>
                            <img src={getVersionedAssetUrl(formData.image_src)} alt="Текущее фото" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                            <p>Текущий путь: {formData.image_src}</p>
                        </div>
                    )}
                    <div className={styles.fileInputWrapper}>
                            <label className={styles.fileInputLabel} htmlFor="imageInput">Выберите файл</label>
                            <input id="imageInput" type="file" name="image" onChange={handleFileChange} />
                        </div>
                </div>
                <div className={styles.formGroup}><label>Биография</label><textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={5}></textarea></div>
                <div className={styles.formGroup}>
                    <label className={styles.toggleContainer}>
                        <input 
                            type="checkbox" 
                            name="is_featured" 
                            className={styles.toggleInput}
                            checked={!!formData.is_featured} 
                            onChange={(e) => {
                                const { name, checked } = e.target;
                                console.log(`Toggle clicked: ${name} = ${checked}`);
                                setFormData((prev: any) => ({
                                    ...prev,
                                    [name]: checked
                                }));
                            }} 
                        />
                        <span className={styles.toggleSlider}></span>
                        <span>Наша гордость</span>
                    </label>
                </div>
            </>
        );
        case 'videos': return (
            <>
                <div className={styles.formGroup}><label>Название</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Дата</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Источник</label><select name="source" value={formData.source || 'rutube'} onChange={handleInputChange}><option value="rutube">Rutube</option><option value="youtube">YouTube</option><option value="vk">VK</option><option value="yandex">Yandex</option></select></div>
                <div className={styles.formGroup}><label>URL Видео</label><input type="url" name="video_url" value={formData.video_url || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Описание</label><textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={5}></textarea></div>
            </>
        );
        case 'library': return (
            <>
                <div className={styles.formGroup}><label>Название</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Категория</label><input type="text" name="category" value={formData.category || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>URL</label><input type="url" name="url" value={formData.url || ''} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Описание</label><textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3}></textarea></div>
            </>
        );
        default: return <p>Форма для этого раздела еще не реализована.</p>;
    }
};

export default AdminFormFields;
