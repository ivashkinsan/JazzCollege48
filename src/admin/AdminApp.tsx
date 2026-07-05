import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminApp.module.css';
import PreviewCard from './PreviewCard';
import EditListView from './EditListView';

// Helper function to generate URL-friendly slugs
function createSlug(text: string): string {
  if (!text) return '';
  const a = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(char => (a as any)[char] || char).join('')
    .replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const API_BASE_URL = 'http://localhost:4000';

const AdminApp: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null); // Use number for ID

  const initialFormData = {
    category: 'news',
    title: '',
    slug: '', // Add slug to form
    date: new Date().toISOString().split('T')[0],
    time: '',
    venue: '',
    tags: '',
    body: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coverImage) {
      const newUrl = URL.createObjectURL(coverImage);
      setCoverImageUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    } else {
      const cover = existingPhotos.find(p => p.src.includes('cover')); // Find cover from existing photos
      setCoverImageUrl(cover ? cover.src : (existingPhotos[0]?.src || null));
    }
  }, [coverImage, existingPhotos]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newFormData = { ...prev, [name]: value };
        // Auto-generate slug from title, but only if creating new content
        if (name === 'title' && !editingId) {
            newFormData.slug = createSlug(value);
        }
        return newFormData;
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    } else {
      setCoverImage(null);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryImages(e.target.files);
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCoverImage(null);
    setGalleryImages(null);
    setEditingId(null);
    setExistingPhotos([]);
    const coverInput = document.getElementById('coverImage') as HTMLInputElement;
    const galleryInput = document.getElementById('galleryImages') as HTMLInputElement;
    if (coverInput) coverInput.value = '';
    if (galleryInput) galleryInput.value = '';
  }, [initialFormData]);

  const handleEditRequest = async (id: number) => { // Expect number id
    try {
        const response = await fetch(`${API_BASE_URL}/api/content/${id}`); // Fetch by number ID
        if(!response.ok) throw new Error('Failed to fetch content for editing.');
        const data = await response.json();
        
        setFormData({
            category: data.category || 'news',
            title: data.title || '',
            slug: data.slug || '',
            date: data.date || '',
            time: data.time || '',
            venue: data.venue || '',
            tags: data.tags ? JSON.parse(data.tags).join(', ') : '',
            body: data.body || '',
        });
        setEditingId(id);
        setExistingPhotos(data.photos || []);
        setMode('create'); // Switch to form view for editing
    } catch (error: any) {
        setStatus({ type: 'error', message: `Ошибка: ${error.message}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value));
    if (coverImage) submissionData.append('coverImage', coverImage);
    if (galleryImages) {
      Array.from(galleryImages).forEach(file => submissionData.append('galleryImages', file));
    }

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/content/${editingId}` // UPDATE endpoint with number ID
        : `${API_BASE_URL}/api/content`;             // CREATE endpoint
      
      const response = await fetch(url, { method: 'POST', body: submissionData });
      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: `Успешно! ${result.message}` });
        resetForm();
        if(editingId) setMode('edit'); // Go back to the list after editing
      } else {
        throw new Error(result.message || 'Произошла ошибка');
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: `Ошибка: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSetMode = (newMode: 'create' | 'edit') => {
    if (mode !== newMode) {
      resetForm();
      setMode(newMode);
    } else if (newMode === 'create') {
      resetForm(); // Allow resetting the create form
    }
  }

  const renderCurrentView = () => {
    if (mode === 'edit') {
        return <EditListView onEdit={handleEditRequest} />;
    }
    // 'create' mode serves for both creating and editing
    return (
        <div className={styles.createViewContainer}>
            <div className={styles.formWrapper}>
                <h1>{editingId ? 'Редактировать контент' : 'Добавить новый контент'}</h1>
                <form onSubmit={handleSubmit}>
                    {/* Form groups */}
                    <div className={styles.formGroup}>
                        <label>Тип контента</label>
                        <div className={styles.radioGroup}>
                            <label><input type="radio" name="category" value="news" checked={formData.category === 'news'} onChange={handleInputChange} /> Новость</label>
                            <label><input type="radio" name="category" value="afisha" checked={formData.category === 'afisha'} onChange={handleInputChange} /> Афиша</label>
                        </div>
                    </div>
                    <div className={styles.formGroup}><label htmlFor="title">Заголовок</label><input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label htmlFor="slug">URL (slug)</label><input type="text" id="slug" name="slug" value={formData.slug} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label htmlFor="date">Дата</label><input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required /></div>
                    {formData.category === 'afisha' && (
                        <div className={styles.afishaFields}>
                            <div className={styles.formGroup}><label htmlFor="time">Время</label><input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label htmlFor="venue">Место</label><input type="text" id="venue" name="venue" value={formData.venue} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label htmlFor="tags">Теги (через запятую)</label><input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} /></div>
                        </div>
                    )}
                    <div className={styles.formGroup}><label htmlFor="body">Основной текст</label><textarea id="body" name="body" value={formData.body} onChange={handleInputChange} rows={10}></textarea></div>
                    <div className={styles.formGroup}><label htmlFor="coverImage">Обложка</label><input type="file" id="coverImage" name="coverImage" onChange={handleCoverImageChange} accept="image/*" /></div>
                    <div className={styles.formGroup}><label htmlFor="galleryImages">Галерея</label><input type="file" id="galleryImages" name="galleryImages" onChange={handleGalleryImagesChange} accept="image/*" multiple /></div>
                    
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Загрузка...' : (editingId ? 'Сохранить изменения' : 'Добавить контент')}</button>
                    {editingId && <button type="button" onClick={() => handleSetMode('edit')} className={styles.cancelButton}>Отмена</button>}
                </form>
                {status && <div className={status.type === 'success' ? styles.statusSuccess : styles.statusError}>{status.message}</div>}
            </div>
        </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.viewToggle}>
          <button onClick={() => handleSetMode('create')} disabled={mode === 'create' && !editingId}>Создать</button>
          <button onClick={() => handleSetMode('edit')} disabled={mode === 'edit'}>Редактировать</button>
      </div>
      {renderCurrentView()}
    </div>
  );
};

export default AdminApp;
