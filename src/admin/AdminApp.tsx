import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './AdminApp.module.css';
import NewsPreview from '../components/NewsPreview';
import Achievements from '../components/Achievements';
import concertCardStyles from '../components/ConcertsPreview.module.css';
import { Achievement, Video } from '../types/college';

const API_BASE_URL = 'http://localhost:4000';

type TabType = 'news' | 'afisha' | 'achievements' | 'videos' | 'library';
type ManagerType = 'content' | 'achievements' | 'videos' | 'library';

// --- Helper Functions ---
function createSlug(text: string): string {
  if (!text) return '';
  const a: Record<string, string> = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// --- Preview Pane Component ---
const PreviewPane: React.FC<{ activeTab: TabType; formData: any }> = ({ activeTab, formData }) => {
    const renderPreview = () => {
        switch (activeTab) {
            case 'news': {
                const newsItem = { ...formData, cover: { src: formData.cover_image_src }, description: formData.body?.slice(0, 150) };
                return <NewsPreview news={[newsItem]} />;
            }
            case 'afisha': {
                const concertItem = { ...formData, content: formData.body || '', cover: { src: formData.cover_image_src } };
                const date = new Date(concertItem.date);
                const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                return (
                    <article className={concertCardStyles.concertCard}>
                        <div className={concertCardStyles.concertCardCover}>
                            {concertItem.cover?.src ? <img src={concertItem.cover.src} alt={concertItem.title} /> : <div className={concertCardStyles.concertCardCoverPlaceholder}><span className={concertCardStyles.coverPlaceholderIcon}>🎵</span></div>}
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
                return <div style={{ transform: 'scale(0.9)', origin: 'top left' }}><Achievements achievements={[achievementItem]} /></div>;
            }
            case 'videos': {
                 const videoItem: Video = { id: 'preview', videoUrl: formData.video_url, ...formData };
                 return <div className={styles.videoPreview}><h4>{videoItem.title}</h4><p>{videoItem.description}</p><span>{videoItem.source} - {videoItem.date}</span></div>;
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

    const manager = useMemo<ManagerType>(() => {
        if (activeTab === 'news' || activeTab === 'afisha') return 'content';
        return activeTab;
    }, [activeTab]);

    const apiEndpoint = useMemo(() => `/api/${manager}`, [manager]);
    const adminListEndpoint = useMemo(() => `/api/admin/list/${manager}`, [manager]);

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(API_BASE_URL + adminListEndpoint);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(`Failed to fetch items for ${manager}`, error);
            setItems([]);
        }
    }, [adminListEndpoint, manager]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const getInitialFormData = useCallback(() => {
        const common = { title: '', date: new Date().toISOString().split('T')[0] };
        switch (activeTab) {
            case 'news': return { ...common, category: 'news', slug: '', body: '', time: '', venue: '', tags: '' };
            case 'afisha': return { ...common, category: 'afisha', slug: '', body: '', time: '', venue: '', tags: '' };
            case 'achievements': return { ...common, student_name: '', competition: '', place: '', category: '', image_src: '' };
            case 'videos': return { ...common, description: '', video_url: '', source: 'rutube' };
            case 'library': return { ...common, description: '', url: '', category: 'Видео-уроки и каналы' };
            default: return {};
        }
    }, [activeTab]);

    const resetForm = useCallback(() => {
        setFormData(getInitialFormData());
        setEditingId(null);
    }, [getInitialFormData]);
    
    useEffect(resetForm, [activeTab]);

    const handleEditRequest = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`);
            const data = await response.json();
            setFormData(data);
            setEditingId(id);
            setMode('form');
        } catch (error) { console.error('Failed to fetch item for editing', error); }
    };

    const handleDeleteRequest = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            try {
                await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`, { method: 'DELETE' });
                fetchItems();
            } catch (error) { console.error('Failed to delete item', error); }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            const newFormData = { ...prev, [name]: value };
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
            const payload = { ...formData, category: activeTab };
            const url = editingId ? `${API_BASE_URL}${apiEndpoint}/${editingId}` : API_BASE_URL + apiEndpoint;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
                <button onClick={() => { resetForm(); setMode('form'); }}>Добавить новую запись</button>
                <table className={styles.adminListTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Заголовок</th>
                            <th>{isLibrary ? 'Категория' : 'Дата'}</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.title}</td>
                                <td>{isLibrary ? item.category : (item.date ? new Date(item.date).toLocaleDateString() : '')}</td>
                                <td>
                                    <button onClick={() => handleEditRequest(item.id)}>Редактировать</button>
                                    <button onClick={() => handleDeleteRequest(item.id)}>Удалить</button>
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
                        <div className={styles.formGroup}><label>Основной текст (Markdown)</label><textarea name="body" value={formData.body || ''} onChange={handleInputChange} rows={10}></textarea></div>
                    </>
                );
            case 'achievements': return (
                <>
                    <div className={styles.formGroup}><label>Название</label><input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Студент/Участник</label><input type="text" name="student_name" value={formData.student_name || ''} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Конкурс/Событие</label><input type="text" name="competition" value={formData.competition || ''} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Дата</label><input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Место/Награда</label><input type="text" name="place" value={formData.place || ''} onChange={handleInputChange} /></div>
                    <div className={styles.formGroup}><label>Путь к изображению</label><input type="text" name="image_src" value={formData.image_src || ''} onChange={handleInputChange} placeholder="/Diploms/image.jpg" /></div>
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
    
    const renderForm = () => (
        <div className={styles.createViewContainer}>
            <div className={styles.formWrapper}>
                <h1>{editingId ? `Редактировать` : `Создать`}</h1>
                <form onSubmit={handleSubmit}>
                    {renderFormFields()}
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Сохранение...' : 'Сохранить'}</button>
                    <button type="button" onClick={() => { setMode('list'); resetForm(); }} className={styles.cancelButton}>Отмена</button>
                </form>
                {status && <div className={status.type === 'success' ? styles.statusSuccess : styles.statusError}>{status.message}</div>}
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
    ];

    return (
        <div className={styles.container}>
            <h1>Админ-панель</h1>
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
