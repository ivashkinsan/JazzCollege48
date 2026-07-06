import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './AdminApp.module.css';
import NewsPreview from '../components/NewsPreview';
import Achievements from '../components/Achievements';
import concertCardStyles from '../components/ConcertsPreview.module.css';
import VideoCard from '../components/VideoCard';
import { Achievement, Video } from '../types/college';
import { getVersionedAssetUrl } from '../utils/assetVersion';

const API_BASE_URL = 'http://localhost:4000';

type TabType = 'news' | 'afisha' | 'achievements' | 'videos' | 'library' | 'photoalbum';
type ManagerType = 'content' | 'achievements' | 'videos' | 'library' | 'photoalbum';

// --- Helper Functions ---
function createSlug(text: string): string {
  if (!text) return '';
  const a: Record<string, string> = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'м','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// Helper to format date to YYYY-MM-DD for input type="date"
function formatDateToYYYYMMDD(dateString: string): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error("Failed to format date:", dateString, e);
        return '';
    }
}

// --- Preview Pane Component ---
const PreviewPane: React.FC<{ activeTab: TabType; formData: any }> = ({ activeTab, formData }) => {
    const renderPreview = () => {
        switch (activeTab) {
            case 'news': {
                const newsItem = {
                    ...formData,
                    cover: { src: formData.cover_image_src },
                    description: formData.body ? formData.body.slice(0, 150) + (formData.body.length > 150 ? '...' : '') : '', // Ensure truncation for description
                    content: formData.body || '' // Full content
                };
                return <NewsPreview news={[newsItem]} />;
            }
            case 'afisha': {
                const concertItem = { ...formData, content: formData.body || '', cover: { src: formData.cover_image_src } };
                const date = new Date(concertItem.date);
                const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                return (
                    <article className={concertCardStyles.concertCard}>
                        <div className={concertCardStyles.concertCardCover}>
                            {concertItem.cover?.src ? <img src={getVersionedAssetUrl(concertItem.cover.src)} alt={concertItem.title} /> : <div className={concertCardStyles.concertCardCoverPlaceholder}><span className={concertCardStyles.coverPlaceholderIcon}>🎵</span></div>}
                        </div>
                        <div className={concertCardStyles.concertCardContent}>
                            <div className={concertCardStyles.concertCardMeta}><span className={concertCardStyles.concertCardCategory}>Афиша</span><div className={concertCardStyles.concertCardDateText}>{dateStr}</div></div>
                            <h3 className={concertCardStyles.concertCardTitle}>{concertItem.title || 'Название события'}</h3>
                            {concertItem.venue && <p className={concertCardStyles.concertCardVenue}>📍 {concertItem.venue}</p>}
                            {concertItem.time && <p className={concertCardStyles.concertCardTime}>🕐 {concertItem.time}</p>}
                            <p className={concertCardStyles.concertCardDescription}>{(concertItem.content || '').slice(0, 150)}{(concertItem.content || '').length > 150 && '...'}</p>
                        </div>
                    </article>
                );
            }
            case 'achievements': {
                const achievementItem: Achievement = { id: 'preview', studentName: formData.student_name, image: formData.image_src, ...formData };
                return <div style={{ transform: 'scale(0.9)', transformOrigin: 'top left' }}><Achievements achievements={[achievementItem]} /></div>;
            }
            case 'videos': {
                const videoItemPreview: Video = {
                    id: formData.id || 'preview-id', // Use existing ID or a placeholder
                    title: formData.title || '',
                    description: formData.description || '',
                    videoUrl: formData.video_url || '',
                    source: formData.source || 'youtube', // Default source
                    date: formData.date || new Date().toISOString().split('T')[0]
                };
                return <VideoCard video={videoItemPreview} />;
            }
            case 'library':
                return <div className={styles.linkPreview}><h4>{formData.title}</h4><p>{formData.description}</p><a href={formData.url} target="_blank" rel="noopener noreferrer">{formData.url}</a><span>Категория: {formData.category}</span></div>;
            default:
                return <p>Предпросмотр для этого раздела еще не реализован.</p>;
        }
    };
    return <div className={styles.previewBox}><h3>Предпросмотр</h3>{renderPreview()}</div>;
};

// --- Main Admin App ---
const AdminApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [mode, setMode] = useState<'list' | 'form'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [formData, setFormData] = useState<any>({});
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<Map<string, File[]>>(new Map());
    const [photoAlbumsForSelection, setPhotoAlbumsForSelection] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        return () => {
            document.documentElement.removeAttribute('data-theme');
        };
    }, []);

    const manager = useMemo<ManagerType>(() => {
        if (activeTab === 'news' || activeTab === 'afisha' || activeTab === 'photoalbum') return 'content';
        return activeTab;
    }, [activeTab]);

    const apiEndpoint = useMemo(() => {
        if (manager === 'photoalbum') return '/api/content'; // Photo albums use the generic content endpoint for CRUD
        return `/api/${manager}`;
    }, [manager]);
    const adminListEndpoint = useMemo(() => `/api/admin/list/${manager}`, [manager]);

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(API_BASE_URL + adminListEndpoint);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error message from server.' }));
                console.error(`Failed to fetch items for ${manager}. Status: ${response.status}. Error: ${errorData.message}`);
                setItems([]);
                return;
            }
            const data = await response.json();
            const adaptedData = data.map((item: any) => {
                if (manager === 'achievements') {
                    return {
                        ...item,
                        studentName: item.student_name,
                        image: item.image_src,
                        city: item.city
                    };
                }
                return item;
            });
            if (manager === 'achievements') {
                console.log('Client-side adapted achievements data:', adaptedData);
            }
            setItems(adaptedData);
        } catch (error) {
            console.error(`Failed to fetch items for ${manager}`, error);
            setItems([]);
        }
    }, [adminListEndpoint, manager]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        if ((activeTab === 'news' || activeTab === 'afisha') && mode === 'form') {
            const fetchPhotoAlbums = async () => {
                try {
                    const response = await fetch(API_BASE_URL + '/api/admin/list/photoalbum');
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'No error message from server.' }));
                        console.error(`Failed to fetch photo albums for selection. Status: ${response.status}. Error: ${errorData.message}`);
                        setPhotoAlbumsForSelection([]);
                        return;
                    }
                    const data = await response.json();
                    const formattedAlbums = data.map((album: any) => ({
                        value: album.id,
                        label: album.title,
                    }));
                    setPhotoAlbumsForSelection(formattedAlbums);
                } catch (error) {
                    console.error('Error fetching photo albums for selection:', error);
                    setPhotoAlbumsForSelection([]);
                }
            };
            fetchPhotoAlbums();
        } else {
            // Clear photo album selection when not in news/afisha form mode
            setPhotoAlbumsForSelection([]);
        }
    }, [activeTab, mode]); // Depend on activeTab and mode

    const getInitialFormData = useCallback(() => {
        const common = { title: '', date: new Date().toISOString().split('T')[0] };
        switch (activeTab) {
            case 'news': return { ...common, category: 'news', slug: '', body: '', time: '', venue: '', tags: '', linked_photoalbum_id: '' };
            case 'afisha': return { ...common, category: 'afisha', slug: '', body: '', time: '', venue: '', tags: '', linked_photoalbum_id: '' };
            case 'achievements': return { ...common, student_name: '', competition: '', place: '', category: '', image_src: '', city: '' };
            case 'videos': return { ...common, description: '', video_url: '', source: 'rutube' };
            case 'library': return { ...common, description: '', url: '', category: 'Видео-уроки и каналы' };
            case 'photoalbum': return { ...common, category: 'photoalbum', slug: '', title: '', body: '' };
            default: return {};
        }
    }, [activeTab]);

    const resetForm = useCallback(() => {
        setFormData(getInitialFormData());
        setEditingId(null);
        setSelectedFiles(new Map()); // Clear selected files on form reset
    }, [getInitialFormData]);
    
    useEffect(resetForm, [activeTab]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        setSelectedFiles(prev => {
            const newMap = new Map(prev);
            if (files && files.length > 0) {
                newMap.set(name, Array.from(files));
            } else {
                newMap.delete(name);
            }
            return newMap;
        });
    };

    const handleEditRequest = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`);
            const data = await response.json();
            // Ensure linked_photoalbum_id is a string for the select element's value
            if (data.linked_photoalbum_id !== null && data.linked_photoalbum_id !== undefined) {
                data.linked_photoalbum_id = String(data.linked_photoalbum_id);
            } else {
                data.linked_photoalbum_id = ''; // Default to empty string
            }
            // Format date to YYYY-MM-DD
            if (data.date) {
                data.date = formatDateToYYYYMMDD(data.date);
            }
            setFormData(data);
            setEditingId(id);
            setMode('form');
        } catch (error) { console.error('Failed to fetch item for editing', error); }
    };

    const handleDeleteRequest = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`, { method: 'DELETE' });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'No error message from server.' }));
                    console.error(`Failed to delete item for ${manager}. Status: ${response.status}. Error: ${errorData.message}`);
                    setStatus({ type: 'error', message: `Ошибка при удалении: ${errorData.message || response.statusText}` });
                    return;
                }

                setStatus({ type: 'success', message: 'Запись успешно удалена!' });
                fetchItems();
            } catch (error: any) {
                console.error('Failed to delete item', error);
                setStatus({ type: 'error', message: `Ошибка при удалении: ${error.message}` });
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const newFormData = { ...prev };
            if (name === 'linked_photoalbum_id') {
                newFormData[name] = value === '' ? '' : String(value); // Explicitly ensure string for linked_photoalbum_id
            } else {
                newFormData[name] = value;
            }
            if (name === 'title' && !editingId) {
                newFormData.slug = createSlug(value);
            }
            return newFormData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);
        
        try {
            const dataToSend = new FormData();

            // Append all non-file related form data, excluding specific keys for special handling
            for (const key in formData) {
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                    // Skip image_src if a new file is selected to avoid sending old path with new file
                    if (key === 'image_src' && activeTab === 'achievements' && selectedFiles.has('image')) {
                        continue;
                    }
                    // Exclude linked_photoalbum_id and category from general append, as they are handled explicitly
                    if (key === 'linked_photoalbum_id' || key === 'category') {
                        continue;
                    }
                    dataToSend.append(key, formData[key]);
                }
            }

            // Explicitly handle linked_photoalbum_id for news/afisha
            if ((activeTab === 'news' || activeTab === 'afisha') && formData.linked_photoalbum_id !== undefined) {
                // Send empty string if "— Нет —" selected, backend will convert to null.
                // Otherwise, send the string representation of the number.
                const albumIdToAppend = formData.linked_photoalbum_id === '' 
                    ? '' 
                    : String(Number(formData.linked_photoalbum_id));
                dataToSend.append('linked_photoalbum_id', albumIdToAppend);
            }

            // Ensure category is explicitly appended as a single string
            dataToSend.append('category', activeTab);

            // Append image files
            if ((activeTab === 'news' || activeTab === 'afisha') && selectedFiles.has('coverImage')) {
                dataToSend.append('coverImage', selectedFiles.get('coverImage')![0]);
            } else if (activeTab === 'achievements' && selectedFiles.has('image')) {
                dataToSend.append('image', selectedFiles.get('image')![0]);
            } else if (activeTab === 'photoalbum' && selectedFiles.has('galleryImages')) {
                selectedFiles.get('galleryImages')!.forEach((file: File) => {
                    dataToSend.append('galleryImages', file);
                });
            }

            const url = editingId ? `${API_BASE_URL}${apiEndpoint}/${editingId}` : API_BASE_URL + apiEndpoint;
            const response = await fetch(url, {
                method: 'POST',
                // DO NOT set Content-Type header manually for FormData.
                // The browser will set it automatically with the correct boundary.
                body: dataToSend,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Server error');
            
            setStatus({ type: 'success', message: 'Успешно сохранено!' });
            setMode('list');
            fetchItems();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderList = () => {
        const filteredItems = manager === 'content' ? items.filter(item => item.category === activeTab) : items;
        const isLibrary = activeTab === 'library';
        return (
            <div>
                <button className={styles.addButton} onClick={() => { resetForm(); setMode('form'); }}>Добавить новую запись</button>
                <table className={styles.adminListTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Заголовок</th>
                            {activeTab === 'achievements' && <th>Студент/Участник</th>}
                            {activeTab === 'achievements' && <th>Конкурс/Событие</th>}
                            {activeTab === 'achievements' && <th>Место/Награда</th>}
                            {activeTab === 'achievements' && <th>Город</th>}
                            <th>{isLibrary ? 'Категория' : 'Дата'}</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredItems || []).map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                {activeTab === 'achievements' && <td>{item.studentName || 'N/A'}</td>}
                                {activeTab === 'achievements' && <td>{item.competition || 'N/A'}</td>}
                                {activeTab === 'achievements' && <td>{item.place || 'N/A'}</td>}
                                {activeTab === 'achievements' && <td>{item.city || 'N/A'}</td>}
                                <td>{isLibrary ? item.category : (item.date ? new Date(item.date).toLocaleDateString() : '')}</td>
                                <td>
                                    <button onClick={() => handleEditRequest(item.id)} className={`${styles.actionButton} ${styles.editButton}`}>Редактировать</button>
                                    <button onClick={() => handleDeleteRequest(item.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const renderFormFields = () => {
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
                            {formData.cover_image_src && (
                                <div>
                                    <img src={getVersionedAssetUrl(formData.cover_image_src)} alt="Текущая обложка" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                                    <p>Текущий путь: {formData.cover_image_src}</p>
                                </div>
                            )}
                            <input type="file" name="coverImage" onChange={handleFileChange} />
                        </div>
                        <div className={styles.formGroup}><label>Основной текст (Markdown)</label><textarea name="body" value={formData.body || ''} onChange={handleInputChange} rows={10}></textarea></div>
                        <div className={styles.formGroup}>
                            <label>Связанный фотоальбом</label>
                            <select
                                name="linked_photoalbum_id"
                                value={String(formData.linked_photoalbum_id || '')} // Keep this as String for display
                                onChange={handleInputChange} // Change this line: pass event directly
                            >
                                <option value="">— Нет —</option>
                                {photoAlbumsForSelection.map(album => (
                                    <option key={album.value} value={String(album.value)}>{album.label}</option> // Ensure string value for HTML option
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
                        {formData.image_src && (
                            <div>
                                <img src={getVersionedAssetUrl(formData.image_src)} alt="Текущее изображение" style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                                <p>Текущий путь: {formData.image_src}</p>
                            </div>
                        )}
                        <input type="file" name="image" onChange={handleFileChange} />
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
            case 'photoalbum': return (
                <>
                    <div className={styles.formGroup}><label>Заголовок</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>URL (slug)</label><input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Дата</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Основной текст (Markdown)</label><textarea name="body" value={formData.body || ''} onChange={handleInputChange} rows={10}></textarea></div>
                    <div className={styles.formGroup}>
                        <label>Фотографии для галереи (до 100)</label>
                        {/* Display existing gallery images */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                            {formData.photos && formData.photos.map((photo: any, index: number) => (
                                <div key={photo.src || index} style={{ display: 'inline-block', border: '1px solid #ccc', padding: '5px' }}>
                                    <img src={getVersionedAssetUrl(photo.src)} alt={`Галерея ${index}`} style={{ maxWidth: '80px', maxHeight: '80px', display: 'block' }} />
                                    {/* Potentially add a delete button for existing images */}
                                </div>
                            ))}
                            {/* Display new selected images */}
                            {selectedFiles.get('galleryImages') && selectedFiles.get('galleryImages')!.map((file, index) => (
                                <div key={file.name + index} style={{ display: 'inline-block', border: '1px solid #ccc', padding: '5px' }}>
                                    <img src={URL.createObjectURL(file)} alt={`Новая ${file.name}`} style={{ maxWidth: '80px', maxHeight: '80px', display: 'block' }} onLoad={() => URL.revokeObjectURL(file.name)} />
                                </div>
                            ))}
                        </div>
                        <input type="file" name="galleryImages" multiple onChange={handleFileChange} accept="image/*" />
                    </div>
                </>
            );
            default: return <p>Форма для этого раздела еще не реализована.</p>;
        }
    };
    
    const renderForm = () => (
        <div className={styles.createViewContainer}>
            <div className={styles.formWrapper}>
                <h1>{editingId ? `Редактировать` : `Создать`}</h1>
                <form onSubmit={handleSubmit}>
                    {renderFormFields()}
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Сохранение...' : 'Сохранить'}</button>
                    <button type="button" onClick={() => { setMode('list'); resetForm(); }} className={styles.cancelButton}>Вернуться к списку</button>
                </form>

            </div>
            <div className={styles.previewContainer}>
                <PreviewPane activeTab={activeTab} formData={formData} />
            </div>
        </div>
    );

    const TABS: { key: TabType, label: string }[] = [
        { key: 'news', label: 'Новости' },
        { key: 'afisha', label: 'Афиши' },
        { key: 'achievements', label: 'Достижения' },
        { key: 'videos', label: 'Видео' },
        { key: 'library', label: 'Библиотека' },
        { key: 'photoalbum', label: 'Фотоальбомы' },
    ];

    return (
        <div className={styles.container}>
            <h1>Админ-панель</h1>
            {status && <div className={status.type === 'success' ? styles.statusSuccess : styles.statusError}>{status.message}</div>}
            <div className={styles.tabsContainer}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tabButton} ${activeTab === tab.key ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <hr className={styles.divider} />
            {mode === 'list' ? renderList() : renderForm()}
        </div>
    );
};

export default AdminApp;
