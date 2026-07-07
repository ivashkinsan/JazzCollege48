import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TabType, ManagerType } from './types';
import PreviewPane from './components/PreviewPane';
import AdminList from './components/AdminList';
import AdminFormFields from './components/AdminFormFields';
import styles from './AdminApp.module.css';

const API_BASE_URL = 'http://localhost:4000';

// --- Helper Functions ---
function createSlug(text: string): string {
  if (!text) return '';
  const a: Record<string, string> = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'м','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  return text.toLowerCase().split('').map(char => a[char] || char).join('').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

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
        if (activeTab === 'graduates') return 'graduates';
        return activeTab;
    }, [activeTab]);

    const apiEndpoint = useMemo(() => {
        if (manager === 'photoalbum') return '/api/content';
        return `/api/${manager}`;
    }, [manager]);
    const adminListEndpoint = useMemo(() => `/api/admin/list/${manager}`, [manager]);

    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(API_BASE_URL + adminListEndpoint, { cache: 'no-store' });
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
                } else if (manager === 'graduates') {
                    return {
                        ...item,
                        graduationYear: item.graduation_year,
                        image: item.image_src,
                        isFeatured: !!item.is_featured,
                    };
                }
                return item;
            });
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
            setPhotoAlbumsForSelection([]);
        }
    }, [activeTab, mode]);

    const getInitialFormData = useCallback(() => {
        const common = { title: '', date: new Date().toISOString().split('T')[0] };
        switch (activeTab) {
            case 'news': return { ...common, category: 'news', slug: '', body: '', time: '', venue: '', tags: '', linked_photoalbum_id: '' };
            case 'afisha': return { ...common, category: 'afisha', slug: '', body: '', time: '', venue: '', tags: '', linked_photoalbum_id: '' };
            case 'achievements': return { ...common, student_name: '', competition: '', place: '', category: '', image_src: '', city: '' };
            case 'graduates': return { ...common, name: '', graduation_year: new Date().getFullYear(), instrument: '', workplace: '', image_src: '', bio: '', is_featured: false };
            case 'videos': return { ...common, description: '', video_url: '', source: 'rutube' };
            case 'library': return { ...common, description: '', url: '', category: 'Видео-уроки и каналы' };
            case 'photoalbum': return { ...common, category: 'photoalbum', slug: '', title: '', body: '' };
            default: return {};
        }
    }, [activeTab]);

    const resetForm = useCallback(() => {
        setFormData(getInitialFormData());
        setEditingId(null);
        setSelectedFiles(new Map());
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
            if (data.linked_photoalbum_id !== null && data.linked_photoalbum_id !== undefined) {
                data.linked_photoalbum_id = String(data.linked_photoalbum_id);
            } else {
                data.linked_photoalbum_id = '';
            }
            if (data.date) {
                data.date = formatDateToYYYYMMDD(data.date);
            }
            if (activeTab === 'photoalbum') {
                data.category = (data.subcategory && data.subcategory !== 'photoalbum') ? data.subcategory : 'другое';
            }
            if (activeTab === 'graduates') {
                data.is_featured = !!data.is_featured;
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
                    setStatus({ type: 'error', message: `Ошибка при удалении: ${errorData.message || response.statusText}` });
                    return;
                }
                setStatus({ type: 'success', message: 'Запись успешно удалена!' });
                fetchItems();
            } catch (error: any) {
                setStatus({ type: 'error', message: `Ошибка при удалении: ${error.message}` });
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev: any) => {
            const newFormData = { ...prev };
            if (name === 'linked_photoalbum_id') {
                newFormData[name] = value === '' ? '' : String(value);
            } else if (type === 'checkbox') {
                newFormData[name] = checked;
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
        console.log('Submitting formData:', formData); // ADDED DEBUG
        setIsSubmitting(true);
        setStatus(null);
        
        try {
            const dataToSend = new FormData();
            for (const key in formData) {
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                    if ((key === 'image_src' && activeTab === 'achievements' && selectedFiles.has('image')) ||
                        (key === 'image_src' && activeTab === 'graduates' && selectedFiles.has('image'))) {
                        continue;
                    }
                    if (key === 'linked_photoalbum_id' || key === 'category') {
                        continue;
                    }
                    if (key === 'is_featured' && activeTab === 'graduates') {
                        dataToSend.append(key, formData[key] ? '1' : '0');
                    } else if (key === 'subcategory' && (formData[key] === 'null' || !formData[key])) {
                        // Skip subcategory if it's null/empty
                        continue;
                    } else {
                        dataToSend.append(key, formData[key]);
                    }
                }
            }

            if ((activeTab === 'news' || activeTab === 'afisha') && formData.linked_photoalbum_id !== undefined) {
                const albumIdToAppend = formData.linked_photoalbum_id === '' 
                    ? '' 
                    : String(Number(formData.linked_photoalbum_id));
                dataToSend.append('linked_photoalbum_id', albumIdToAppend);
            }

            // Принудительно очистим subcategory, если он уже есть в dataToSend (хотя FormData так не умеет, но для верности)
            if (activeTab === 'photoalbum') {
                dataToSend.append('category', 'photoalbum');
                // Ensure subcategory is a single string
                let subcatValue = formData.category;
                if (Array.isArray(subcatValue)) subcatValue = subcatValue[0];
                subcatValue = String(subcatValue || 'другое');
                dataToSend.set('subcategory', subcatValue); 
            } else {
                dataToSend.append('category', activeTab);
            }

            if ((activeTab === 'news' || activeTab === 'afisha') && selectedFiles.has('coverImage')) {
                dataToSend.append('coverImage', selectedFiles.get('coverImage')![0]);
            } else if ((activeTab === 'achievements' || activeTab === 'graduates') && selectedFiles.has('image')) {
                dataToSend.append('image', selectedFiles.get('image')![0]);
            } else if (activeTab === 'photoalbum' && selectedFiles.has('galleryImages')) {
                selectedFiles.get('galleryImages')!.forEach((file: File) => {
                    dataToSend.append('galleryImages', file);
                });
            }

            const url = editingId ? `${API_BASE_URL}${apiEndpoint}/${editingId}` : API_BASE_URL + apiEndpoint;
            const response = await fetch(url, { method: 'POST', body: dataToSend, });
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

    const TABS: { key: TabType, label: string }[] = [
        { key: 'news', label: 'Новости' },
        { key: 'afisha', label: 'Афиши' },
        { key: 'achievements', label: 'Достижения' },
        { key: 'graduates', label: 'Выпускники' },
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
            {mode === 'list' ? (
                <AdminList 
                    activeTab={activeTab} 
                    items={items} 
                    handleEditRequest={handleEditRequest} 
                    handleDeleteRequest={handleDeleteRequest} 
                    resetForm={resetForm} 
                    setMode={setMode} 
                />
            ) : (
                <div className={styles.createViewContainer}>
                    <div className={styles.formWrapper}>
                        <h1>{editingId ? `Редактировать` : `Создать`}</h1>
                        <form onSubmit={handleSubmit}>
                            <AdminFormFields 
                                activeTab={activeTab}
                                formData={formData}
                                selectedFiles={selectedFiles}
                                handleInputChange={handleInputChange}
                                handleFileChange={handleFileChange}
                                photoAlbumsForSelection={photoAlbumsForSelection}
                                setFormData={setFormData}
                            />
                            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Сохранение...' : 'Сохранить'}</button>
                            <button type="button" onClick={() => { setMode('list'); resetForm(); }} className={styles.cancelButton}>Вернуться к списку</button>
                        </form>
                    </div>
                    <div className={styles.previewContainer}>
                        <PreviewPane activeTab={activeTab} formData={formData} selectedFiles={selectedFiles} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApp;
