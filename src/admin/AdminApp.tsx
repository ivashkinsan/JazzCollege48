import React, { useState, useEffect, useMemo } from 'react';
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormData = {
    contentType: 'news',
    title: '',
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

  const generatedPaths = useMemo(() => {
    if (editingId) return { folderPath: 'N/A (editing)', fileName: 'N/A (editing)' };
    const { title, date } = formData;
    if (!title || !date) return { folderPath: '', fileName: '' };
    const albumSlug = createSlug(title);
    const year = new Date(date).getFullYear().toString();
    const folderPath = `public/media/${year}/${date}-${albumSlug}/`;
    const fileName = `${date}-${albumSlug}.md`;
    return { folderPath, fileName };
  }, [formData.title, formData.date, editingId]);

  useEffect(() => {
    if (coverImage) {
      const newUrl = URL.createObjectURL(coverImage);
      setCoverImageUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    } else if (editingId) {
        // Find cover from existing photos
        const cover = existingPhotos.find(p => p.id.includes('_01')); // Heuristic
        if (cover) setCoverImageUrl(cover.src);
    }
    else {
      setCoverImageUrl(null);
    }
  }, [coverImage, editingId, existingPhotos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const resetForm = () => {
    setFormData(initialFormData);
    setCoverImage(null);
    setGalleryImages(null);
    setEditingId(null);
    setExistingPhotos([]);
    const coverInput = document.getElementById('coverImage') as HTMLInputElement;
    const galleryInput = document.getElementById('galleryImages') as HTMLInputElement;
    if (coverInput) coverInput.value = '';
    if (galleryInput) galleryInput.value = '';
  };

  const handleEditRequest = async (albumId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/content/${albumId}`);
        if(!response.ok) throw new Error('Failed to fetch content for editing.');
        const data = await response.json();
        
        setFormData({
            contentType: data.albumCategory || 'news',
            title: data.albumTitle || '',
            date: data.albumDate || '',
            time: data.time || '',
            venue: data.venue || '',
            tags: data.tags || '',
            body: data.body || '',
        });
        setEditingId(albumId);
        setExistingPhotos(data.photos || []);
        setMode('create'); // Switch to form view
    } catch (error: any) {
        setStatus({ type: 'error', message: `Ошибка: ${error.message}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const submissionData = new FormData();
    // Append form data
    Object.entries(formData).forEach(([key, value]) => submissionData.append(key, value));
    // Append images if they exist
    if (coverImage) submissionData.append('coverImage', coverImage);
    if (galleryImages) {
      Array.from(galleryImages).forEach(file => submissionData.append('galleryImages', file));
    }

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/content/${editingId}` // UPDATE endpoint (to be created)
        : `${API_BASE_URL}/api/add-content`;         // CREATE endpoint
      
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
                            <label><input type="radio" name="contentType" value="news" checked={formData.contentType === 'news'} onChange={handleInputChange} /> Новость</label>
                            <label><input type="radio" name="contentType" value="afisha" checked={formData.contentType === 'afisha'} onChange={handleInputChange} /> Афиша</label>
                            <label><input type="radio" name="contentType" value="photoalbum" checked={formData.contentType === 'photoalbum'} onChange={handleInputChange} /> Фотоальбом</label>
                        </div>
                    </div>
                    <div className={styles.formGroup}><label htmlFor="title">Заголовок</label><input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required disabled={!!editingId} /></div>
                    <div className={styles.formGroup}><label htmlFor="date">Дата</label><input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required disabled={!!editingId} /></div>
                    {formData.contentType === 'afisha' && (
                        <div className={styles.afishaFields}>
                            <div className={styles.formGroup}><label htmlFor="time">Время</label><input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label htmlFor="venue">Место</label><input type="text" id="venue" name="venue" value={formData.venue} onChange={handleInputChange} /></div>
                            <div className={styles.formGroup}><label htmlFor="tags">Теги</label><input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} /></div>
                        </div>
                    )}
                    <div className={styles.formGroup}><label htmlFor="body">Основной текст</label><textarea id="body" name="body" value={formData.body} onChange={handleInputChange} required={formData.contentType !== 'photoalbum'}></textarea></div>
                    <div className={styles.formGroup}><label htmlFor="coverImage">Обложка</label><input type="file" id="coverImage" name="coverImage" onChange={handleCoverImageChange} accept="image/*" /></div>
                    <div className={styles.formGroup}><label htmlFor="galleryImages">Галерея</label><input type="file" id="galleryImages" name="galleryImages" onChange={handleGalleryImagesChange} accept="image/*" multiple /></div>
                    
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Загрузка...' : (editingId ? 'Сохранить изменения' : 'Добавить контент')}</button>
                    {editingId && <button type="button" onClick={resetForm} className={styles.cancelButton}>Отмена</button>}
                </form>
                {status && <div className={status.type === 'success' ? styles.statusSuccess : styles.statusError}>{status.message}</div>}
            </div>
            <div className={styles.previewContainer}>
                <PreviewCard formData={formData} coverImageUrl={coverImageUrl} generatedPaths={generatedPaths} />
            </div>
        </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.viewToggle}>
          <button onClick={() => { setMode('create'); resetForm(); }} disabled={mode === 'create' && !editingId}>Создать</button>
          <button onClick={() => setMode('edit')} disabled={mode === 'edit'}>Редактировать</button>
      </div>
      {renderCurrentView()}
    </div>
  );
};

export default AdminApp;
