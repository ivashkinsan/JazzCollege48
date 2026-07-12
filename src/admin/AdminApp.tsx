
import React, { useEffect } from 'react';
import { useAdminStore } from './store.ts';
import { TabType } from './types.ts';
import PreviewPane from './components/PreviewPane.tsx';
import AdminList from './components/AdminList.tsx';
import AdminFormFields from './components/AdminFormFields.tsx';
import styles from './AdminApp.module.css';

const TABS: { key: TabType, label: string }[] = [
    { key: 'news', label: 'Новости' },
    { key: 'afisha', label: 'Афиши' },
    { key: 'achievements', label: 'Достижения' },
    { key: 'graduates', label: 'Выпускники' },
    { key: 'videos', label: 'Видео' },
    { key: 'library', label: 'Библиотека' },
];

const AdminApp: React.FC = () => {
    const {
        activeTab,
        mode,
        editingId,
        items,
        formData,
        status,
        isSubmitting,
        selectedFiles,
        setActiveTab,
        setMode,
        resetForm,
        requestEdit,
        requestDelete,
        submitForm,
        handleFileChange,
        handleInputChange,
        handleDeleteImage,
        setFormData
    } = useAdminStore();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        return () => {
            document.documentElement.removeAttribute('data-theme');
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitForm();
    };

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
                    handleEditRequest={requestEdit} 
                    handleDeleteRequest={requestDelete} 
                    resetForm={resetForm} 
                    setMode={setMode} 
                />
            ) : (
                <div className={styles.createViewContainer}>
                    <div className={styles.formWrapper}>
                        <h1>{editingId ? 'Редактировать' : 'Создать'}</h1>
                        <form onSubmit={handleSubmit}>
                            <AdminFormFields 
                                activeTab={activeTab}
                                formData={formData}
                                selectedFiles={selectedFiles}
                                handleInputChange={handleInputChange}
                                handleFileChange={handleFileChange}
                                handleDeleteImage={handleDeleteImage}
                                setFormData={setFormData}
                            />
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button type="button" onClick={() => { setMode('list'); resetForm(); }} className={styles.cancelButton}>
                                Вернуться к списку
                            </button>
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
