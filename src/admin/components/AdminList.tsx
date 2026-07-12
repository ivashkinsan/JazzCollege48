import React from 'react';
import { TabType } from '../types';
import styles from '../AdminApp.module.css';

interface AdminListProps {
    activeTab: TabType;
    items: any[];
    handleEditRequest: (id: number) => void;
    handleDeleteRequest: (id: number) => void;
    resetForm: () => void;
    setMode: (mode: 'list' | 'form') => void;
}

const AdminList: React.FC<AdminListProps> = ({ activeTab, items, handleEditRequest, handleDeleteRequest, resetForm, setMode }) => {
    const manager = (activeTab === 'news' || activeTab === 'afisha') ? 'content' : activeTab;
    const filteredItems = manager === 'content' ? items.filter(item => item.category === activeTab) : items;
    const isLibrary = activeTab === 'library';

    console.log(`[AdminList] Rendering for tab: ${activeTab}`);
    console.log(`[AdminList] Received ${items.length} total items.`);
    console.log(`[AdminList] Filtered to ${filteredItems.length} items.`);
    console.log('[AdminList] First received item (if any):', items[0]);
    console.log('[AdminList] First filtered item (if any):', filteredItems[0]);

    return (
        <div>
            <button className={styles.addButton} onClick={() => { resetForm(); setMode('form'); }}>Добавить новую запись</button>
            <table className={`${styles.adminListTable} ${styles[activeTab + 'Table']}`}>
                <thead>
                    <tr>
                        <th>ID</th>
                        {!['graduates', 'achievements'].includes(activeTab) && <th>Заголовок</th>}
                        {activeTab === 'achievements' && <th>Студент/Участник</th>}
                        {activeTab === 'achievements' && <th>Конкурс/Событие</th>}
                        {activeTab === 'achievements' && <th>Место/Награда</th>}
                        {activeTab === 'achievements' && <th>Город</th>}
                        {activeTab === 'graduates' && <th>Имя</th>}
                        {activeTab === 'graduates' && <th>Год выпуска</th>}
                        {activeTab === 'graduates' && <th>Инструмент</th>}
                        {activeTab === 'graduates' && <th>Место работы/учебы</th>}
                        {activeTab === 'graduates' && <th>Биография</th>}
                        {activeTab === 'graduates' && <th>Наша гордость</th>}
                        {!['graduates', 'news'].includes(activeTab) && <th>{isLibrary ? 'Категория' : 'Дата'}</th>}
                        {activeTab === 'news' && <>
                            <th>Дата</th>
                            <th>Подкатегория</th>
                        </>}
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredItems || []).map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            {!['graduates', 'achievements'].includes(activeTab) && <td>{item.title || item.name}</td>}
                            {activeTab === 'achievements' && <td>{item.studentName || 'N/A'}</td>}
                            {activeTab === 'achievements' && <td>{item.competition || 'N/A'}</td>}
                            {activeTab === 'achievements' && <td>{item.place || 'N/A'}</td>}
                            {activeTab === 'achievements' && <td>{item.city || 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.name || 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.graduationYear || 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.instrument || 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.workplace || 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.bio ? item.bio.substring(0, 30) + '...' : 'N/A'}</td>}
                            {activeTab === 'graduates' && <td>{item.isFeatured ? 'Да' : 'Нет'}</td>}
                            {!['graduates', 'news'].includes(activeTab) && <td>{isLibrary ? item.category : (item.date ? new Date(item.date).toLocaleDateString() : '')}</td>}
                            {activeTab === 'news' && <>
                                <td>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                                <td>{(item.subcategory && item.subcategory !== 'null') ? item.subcategory : '—'}</td>
                            </>}
                            <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEditRequest(item.id)} className={`${styles.actionButton} ${styles.editButton}`}>Редактировать</button>
                                    <button onClick={() => handleDeleteRequest(item.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Удалить</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminList;
