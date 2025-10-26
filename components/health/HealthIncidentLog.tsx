import React, { useState, useEffect, useMemo } from 'react';
import api, { logActivity } from '../../services/api';
import { User, Student, HealthIncident, UserRole } from '../../types';
import Spinner from '../shared/Spinner';
import Select from '../shared/Select';
import HealthIncidentModal from './HealthIncidentModal';
import Button from '../shared/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '../icons/Icons';

interface HealthIncidentLogProps {
    user: User;
}

const HealthIncidentLog: React.FC<HealthIncidentLogProps> = ({ user }) => {
    const [incidents, setIncidents] = useState<HealthIncident[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncident, setEditingIncident] = useState<HealthIncident | null>(null);
    
    const canManage = user.role === UserRole.Direcao || user.role === UserRole.Secretaria;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, incidentsData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<HealthIncident[]>(user.studentId ? `/healthIncidents?student_id=${user.studentId}` : '/healthIncidents')
                ]);
                setStudents(studentsData);
                setIncidents(incidentsData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (error) {
                console.error("Failed to fetch health incident data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.studentId]);

    const filteredIncidents = useMemo(() => {
        if (!canManage || !selectedStudentId) return incidents;
        return incidents.filter(i => i.studentId === selectedStudentId);
    }, [selectedStudentId, incidents, canManage]);
    
    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';

    const handleSave = async (data: Omit<HealthIncident, 'id' | 'reportedById'>) => {
        if (!user) return;
        
        const incidentData = { ...data, reportedById: user.id };
        
        try {
            if(editingIncident?.id) {
                const updatedIncident = await api.put<HealthIncident>(`/healthIncidents/${editingIncident.id}`, incidentData);
                setIncidents(prev => prev.map(i => i.id === editingIncident.id ? updatedIncident : i));
            } else {
                const newIncident = await api.post<HealthIncident>('/healthIncidents', incidentData);
                setIncidents(prev => [newIncident, ...prev]);
            }
            setIsModalOpen(false);
            setEditingIncident(null);
        } catch(error) {
            console.error("Failed to save health incident:", error);
            alert("Falha ao salvar ocorrência.");
        }
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm("Deseja excluir este registro?")) {
            try {
                await api.delete(`/healthIncidents/${id}`);
                setIncidents(prev => prev.filter(i => i.id !== id));
            } catch (error) {
                console.error("Failed to delete health incident:", error);
                alert("Falha ao excluir ocorrência.");
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Registro de Ocorrências de Saúde</h2>
                    <p className="text-gray-500 dark:text-gray-400">Acompanhe e registre incidentes de saúde na escola.</p>
                </div>
                 {canManage && <Button onClick={() => { setEditingIncident(null); setIsModalOpen(true); }}><PlusIcon className="w-5 h-5 mr-2"/> Nova Ocorrência</Button>}
            </div>

            {canManage && (
                <div className="max-w-md mb-6">
                    <Select id="student-filter" label="Filtrar por Aluno" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                        <option value="">Todos os Alunos</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    {filteredIncidents.length > 0 ? filteredIncidents.map(incident => (
                        <div key={incident.id} className="p-4 border rounded-lg dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{getStudentName(incident.studentId)}</p>
                                    <p className="text-sm text-gray-500">{new Date(incident.date).toLocaleDateString()} às {incident.time}</p>
                                </div>
                                {canManage && (
                                    <div className="space-x-1">
                                        <button onClick={() => { setEditingIncident(incident); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><PencilIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleDelete(incident.id!)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-sm"><strong className="font-medium">Descrição:</strong> {incident.description}</p>
                            <p className="mt-1 text-sm"><strong className="font-medium">Ações Tomadas:</strong> {incident.actionsTaken}</p>
                        </div>
                    )) : (
                        <p className="text-center py-8 text-gray-500">Nenhuma ocorrência encontrada.</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <HealthIncidentModal
                    incident={editingIncident}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    students={students}
                />
            )}
        </div>
    );
};

export default HealthIncidentLog;