import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import api from '../services/api';
import { Student } from '../types';
import { UsersIcon, DocumentTextIcon, SwitchHorizontalIcon, CheckCircleIcon } from './icons/Icons';
import Spinner from './shared/Spinner.tsx';
import UpcomingEvents from './shared/UpcomingEvents';

const SecretaryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await api.get<Student[]>('/students');
                setStudents(studentsData);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const stats = useMemo(() => ({
        // These are mocked values as the data model doesn't support them yet.
        pendingEnrollments: 5, 
        missingDocuments: 12, 
        requestedTransfers: 2,
        totalStudents: students.length,
    }), [students]);

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>;

    return (
    <>
        <h1 className="text-3xl font-bold mb-6">Painel da Secretaria</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total de Alunos" value={stats.totalStudents} icon={<UsersIcon className="w-8 h-8"/>} color="blue" onClick={() => navigate('/academic')} />
            <StatCard title="Matrículas Pendentes" value={stats.pendingEnrollments} icon={<DocumentTextIcon className="w-8 h-8"/>} color="yellow" onClick={() => navigate('/academic')}/>
            <StatCard title="Documentos Faltantes" value={stats.missingDocuments} icon={<CheckCircleIcon className="w-8 h-8"/>} color="purple" onClick={() => navigate('/academic')}/>
            <StatCard title="Transferências Solicitadas" value={stats.requestedTransfers} icon={<SwitchHorizontalIcon className="w-8 h-8"/>} color="green" onClick={() => navigate('/academic')}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Avisos e Lembretes</h2>
                 <ul className="space-y-3">
                    <li className="p-3 bg-yellow-50 dark:bg-yellow-900/40 rounded-lg">Finalizar matrículas para o 9º Ano até 30/08.</li>
                    <li className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">Confirmar documentação dos novos alunos.</li>
                     <li className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">Emitir declarações solicitadas.</li>
                </ul>
            </div>
            
            <div className="space-y-6">
                <UpcomingEvents />
            </div>
        </div>
    </>
);
}

export default SecretaryDashboard;