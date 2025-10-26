import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Announcement } from '../types';
import { BellIcon } from './icons/Icons';
import Spinner from './shared/Spinner.tsx';

const Communications: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "announcements"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BellIcon className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400"/>
                Mural de Comunicados
            </h2>
            {loading ? <Spinner /> : (
                <ul className="space-y-4">
                    {announcements.map(ann => (
                        <li key={ann.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-primary-500">
                            <p className="font-bold text-gray-800 dark:text-gray-200">{ann.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ann.content}</p>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                               - {ann.author}, {new Date(ann.date).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                    {announcements.length === 0 && <p className="text-sm text-center text-gray-500 py-4">Nenhum comunicado no mural.</p>}
                </ul>
            )}
        </div>
    );
};

export default Communications;