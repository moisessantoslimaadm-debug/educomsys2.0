import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ActivityLog } from '../../types';
import Spinner from '../shared/Spinner';

const ActivityLog: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Assuming the API returns logs sorted by timestamp descending
                const data = await api.get<ActivityLog[]>('/activity_logs');
                setLogs(data);
            } catch (error) {
                console.error("Failed to fetch activity logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Logs de Atividade do Sistema</h2>
                    <p className="text-gray-500 dark:text-gray-400">Acompanhe todas as ações importantes realizadas na plataforma.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data/Hora</th>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">Ação</th>
                                <th scope="col" className="px-6 py-3">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                    <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 font-medium">{log.userName}</td>
                                    <td className="px-6 py-4">{log.action}</td>
                                    <td className="px-6 py-4 text-xs font-mono">{log.details}</td>
                                </tr>
                            ))}
                             {logs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        Nenhum log de atividade encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;