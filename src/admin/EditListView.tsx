import React, { useEffect, useState } from 'react';
import styles from './EditListView.module.css';

// The API now sends a numeric id, which we map to albumId for the frontend.
interface ContentItem {
    albumId: number; // Changed from string to number
    albumTitle: string;
    albumDate: string;
    albumCategory: string;
}

interface EditListProps {
    onEdit: (albumId: number) => void; // Changed from string to number
}

const EditListView: React.FC<EditListProps> = ({ onEdit }) => {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:4000/api/content');
                if (!response.ok) {
                    throw new Error('Failed to fetch content list');
                }
                const data = await response.json();
                setItems(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Загрузка списка...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error}</div>;
    }

    return (
        <div className={styles.listContainer}>
            <h2>Редактировать контент</h2>
            <table className={styles.contentTable}>
                <thead>
                    <tr>
                        <th>Заголовок</th>
                        <th>Дата</th>
                        <th>Категория</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.albumId}>
                            <td>{item.albumTitle}</td>
                            <td>{new Date(item.albumDate).toLocaleDateString('ru-RU')}</td>
                            <td>{item.albumCategory}</td>
                            <td>
                                <button onClick={() => onEdit(item.albumId)} className={styles.editButton}>
                                    Редактировать
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditListView;
