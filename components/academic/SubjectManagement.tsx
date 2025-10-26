import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { Subject } from '../../types';
import SubjectModal from './SubjectModal';
import SubjectTable from './SubjectTable';
import Spinner from '../shared/Spinner.tsx';

const SubjectManagement: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const data = await api.get<Subject[]>('/subjects');
                setSubjects(data);
            } catch (error) {
                console.error("Failed to fetch subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleOpenModal = () => {
        setEditingSubject(null);
        setIsModalOpen(true);
    };

    const handleEditSubject = (sub: Subject) => {
        setEditingSubject(sub);
        setIsModalOpen(true);
    };

    const handleDeleteSubject = async (subjectId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
            try {
                const subjectName = subjects.find(s => s.id === subjectId)?.name || 'N/A';
                await api.delete(`/subjects/${subjectId}`);
                setSubjects(prev => prev.filter(s => s.id !== subjectId));
                await logActivity('Exclusão de Disciplina', { subjectId, name: subjectName });
            } catch (error) {
                console.error("Failed to delete subject:", error);
                alert("Falha ao excluir disciplina.");
            }
        }
    };

    const handleSaveSubject = async (sub: Subject) => {
        try {
            if (sub.id) {
                const { id, ...subjectData } = sub;
                const updatedSubject = await api.put<Subject>(`/subjects/${id}`, subjectData);
                setSubjects(prev => prev.map(s => s.id === id ? { ...updatedSubject, id } : s));
                await logActivity('Atualização de Disciplina', { subjectId: id, name: sub.name });
            } else {
                const { id, ...subjectData } = sub;
                const newSubject = await api.post<Subject>('/subjects', subjectData);
                setSubjects(prev => [...prev, newSubject]);
                await logActivity('Criação de Disciplina', { subjectId: newSubject.id, name: sub.name });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save subject:", error);
            alert("Falha ao salvar disciplina.");
        }
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Disciplinas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Cadastre e organize as disciplinas da grade curricular.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Adicionar Disciplina</span>
                </button>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <SubjectTable 
                    subjects={subjects}
                    onEdit={handleEditSubject}
                    onDelete={handleDeleteSubject} 
                />
            )}
            {isModalOpen && (
                <SubjectModal
                    subject={editingSubject}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveSubject}
                />
            )}
        </div>
    );
};

export default SubjectManagement;