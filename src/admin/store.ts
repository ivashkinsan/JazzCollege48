
import { create } from 'zustand';
import { TabType, ManagerType } from './types';

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

// --- Store Types ---
interface AdminState {
    activeTab: TabType;
    mode: 'list' | 'form';
    editingId: number | null;
    items: any[];
    formData: any;
    status: { type: 'success' | 'error'; message: string } | null;
    isSubmitting: boolean;
    selectedFiles: Map<string, File[]>;
    photoAlbumsForSelection: { value: number; label: string }[];
    
    // Actions
    setActiveTab: (tab: TabType) => void;
    setMode: (mode: 'list' | 'form') => void;
    fetchItems: () => Promise<void>;
    resetForm: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleDeleteImage: (imageId: number) => Promise<void>;
    requestEdit: (id: number) => Promise<void>;
    requestDelete: (id: number) => Promise<void>;
    submitForm: () => Promise<void>;
    setFormData: (data: any) => void;
}

const getInitialFormData = (activeTab: TabType) => {
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
};

// --- Store Definition ---
export const useAdminStore = create<AdminState>((set, get) => ({
    activeTab: 'news',
    mode: 'list',
    editingId: null,
    items: [],
    formData: getInitialFormData('news'),
    status: null,
    isSubmitting: false,
    selectedFiles: new Map(),
    photoAlbumsForSelection: [],

    setFormData: (data) => set({ formData: data }),

    setActiveTab: (tab) => {
        set({ activeTab: tab, mode: 'list', editingId: null, status: null });
        get().resetForm();
        get().fetchItems();
    },

    setMode: (mode) => set({ mode }),

    resetForm: () => {
        set({
            formData: getInitialFormData(get().activeTab),
            editingId: null,
            selectedFiles: new Map(),
        });
    },

    fetchItems: async () => {
        const activeTab = get().activeTab;
        const manager = (activeTab === 'news' || activeTab === 'afisha' || activeTab === 'photoalbum') ? 'content' : activeTab;
        const adminListEndpoint = `/api/admin/list/${manager}`;
        try {
            const response = await fetch(API_BASE_URL + adminListEndpoint, { cache: 'no-store' });
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            const adaptedData = data.map((item: any) => {
                 if (manager === 'achievements') return { ...item, studentName: item.student_name, image: item.image_src, city: item.city };
                 if (manager === 'graduates') return { ...item, graduationYear: item.graduation_year, image: item.image_src, isFeatured: !!item.is_featured };
                 return item;
            });
            set({ items: adaptedData });
        } catch (error) {
            console.error(`Failed to fetch items for ${manager}`, error);
            set({ items: [], status: {type: 'error', message: 'Failed to load list.'} });
        }
    },

    handleFileChange: (e) => {
        const { name, files } = e.target;
        set(state => {
            const newMap = new Map(state.selectedFiles);
            if (files && files.length > 0) newMap.set(name, Array.from(files));
            else newMap.delete(name);
            return { selectedFiles: newMap };
        });
    },

    handleInputChange: (e) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        set(state => {
            const newFormData = { ...state.formData };
            if (name === 'linked_photoalbum_id') newFormData[name] = value === '' ? '' : String(value);
            else if (type === 'checkbox') newFormData[name] = checked;
            else newFormData[name] = value;
            if (name === 'title' && !state.editingId) newFormData.slug = createSlug(value);
            return { formData: newFormData };
        });
    },

    handleDeleteImage: async (imageId) => {
        if (!window.confirm('Удалить это изображение?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/gallery-images/${imageId}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Не удалось удалить изображение.');
            set(state => ({
                formData: { ...state.formData, photos: state.formData.photos.filter((p: any) => p.id !== imageId) },
                status: { type: 'success', message: 'Изображение успешно удалено.' }
            }));
        } catch (error: any) {
            set({ status: { type: 'error', message: `Ошибка: ${error.message}` } });
        }
    },

    requestEdit: async (id) => {
        const { activeTab } = get();
        const manager = (activeTab === 'news' || activeTab === 'afisha' || activeTab === 'photoalbum') ? 'content' : activeTab;
        const apiEndpoint = manager === 'photoalbum' ? '/api/content' : `/api/${manager}`;
        try {
            const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`);
            const data = await response.json();
            if (data.date) data.date = formatDateToYYYYMMDD(data.date);
            if (data.linked_photoalbum_id !== null && data.linked_photoalbum_id !== undefined) data.linked_photoalbum_id = String(data.linked_photoalbum_id);
            if (activeTab === 'photoalbum') data.category = (data.subcategory && data.subcategory !== 'photoalbum') ? data.subcategory : 'другое';
            if (activeTab === 'graduates') data.is_featured = !!data.is_featured;
            
            set({ formData: data, editingId: id, mode: 'form', status: null });
        } catch (error) { 
            console.error('Failed to fetch item for editing', error); 
            set({ status: { type: 'error', message: 'Failed to load item for editing.' } });
        }
    },

    requestDelete: async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
        const { activeTab } = get();
        const manager = (activeTab === 'news' || activeTab === 'afisha' || activeTab === 'photoalbum') ? 'content' : activeTab;
        const apiEndpoint = manager === 'photoalbum' ? '/api/content' : `/api/${manager}`;
        try {
            const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'No error message from server.' }));
                throw new Error(errorData.message || response.statusText);
            }
            set({ status: { type: 'success', message: 'Запись успешно удалена!' } });
            get().fetchItems();
        } catch (error: any) {
            set({ status: { type: 'error', message: `Ошибка при удалении: ${error.message}` } });
        }
    },

    submitForm: async () => {
        set({ isSubmitting: true, status: null });
        const { editingId, activeTab, formData, selectedFiles } = get();
        
        try {
            const dataToSend = new FormData();
            // This logic is complex and needs to be carefully ported from AdminApp
            for (const key in formData) {
                if (Object.prototype.hasOwnProperty.call(formData, key)) {
                     if ((key === 'image_src' && activeTab === 'achievements' && selectedFiles.has('image')) || (key === 'image_src' && activeTab === 'graduates' && selectedFiles.has('image'))) continue;
                     if (key === 'is_featured' && activeTab === 'graduates') dataToSend.append(key, formData[key] ? '1' : '0');
                     else if (key !== 'linked_photoalbum_id') dataToSend.append(key, formData[key]);
                }
            }
            if ((activeTab === 'news' || activeTab === 'afisha') && formData.linked_photoalbum_id !== undefined) {
                dataToSend.append('linked_photoalbum_id', formData.linked_photoalbum_id === '' ? '' : String(Number(formData.linked_photoalbum_id)));
            }

            if (activeTab === 'photoalbum') {
                 dataToSend.set('category', 'photoalbum');
                 let subcatValue = formData.category;
                 if (Array.isArray(subcatValue)) subcatValue = subcatValue[0];
                 dataToSend.set('subcategory', String(subcatValue || 'другое'));
            } else {
                 dataToSend.set('category', activeTab);
            }
            
            selectedFiles.forEach((files, name) => {
                files.forEach(file => dataToSend.append(name, file));
            });

            const manager = (activeTab === 'news' || activeTab === 'afisha' || activeTab === 'photoalbum') ? 'content' : activeTab;
            const apiEndpoint = manager === 'photoalbum' ? '/api/content' : `/api/${manager}`;
            const url = editingId ? `${API_BASE_URL}${apiEndpoint}/${editingId}` : API_BASE_URL + apiEndpoint;
            
            const response = await fetch(url, { method: 'POST', body: dataToSend });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Server error');
            
            set({ status: { type: 'success', message: 'Успешно сохранено!' }, mode: 'list' });
            get().fetchItems();
        } catch (error: any) {
            set({ status: { type: 'error', message: error.message } });
        } finally {
            set({ isSubmitting: false });
        }
    }
}));

// Fetch initial data or perform side effects
useAdminStore.getState().fetchItems();
