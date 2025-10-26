import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { School } from '../../types';
import { PlusIcon } from '../icons/Icons';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import SchoolTable from './SchoolTable';
import SchoolModal from './SchoolModal';

const SchoolManagement: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<School | null>(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data = await api.get<School[]>('/schools');
                setSchools(data);
            } catch (error) {
                console.error("Failed to fetch schools:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);

    const handleOpenModal = () => {
        setEditingSchool(null);
        setIsModalOpen(true);
    };

    const handleEditSchool = (school: School) => {
        setEditingSchool(school);
        setIsModalOpen(true);
    };

    const handleDeleteSchool = async (schoolId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta escola?")) {
            try {
                const schoolName = schools.find(s => s.id === schoolId)?.name || 'N/A';
                await api.delete(`/schools/${schoolId}`);
                setSchools(prev => prev.filter(s => s.id !== schoolId));
                await logActivity('Exclusão de Escola', { schoolId, name: schoolName });
            } catch (error) {
                console.error("Failed to delete school:", error);
                alert("Falha ao excluir escola.");
            }
        }
    };

    const handleSaveSchool = async (school: Omit<School, 'id'>) => {
        try {
            if (editingSchool?.id) {
                const updatedSchool = await api.put<School>(`/schools/${editingSchool.id}`, school);
                setSchools(prev => prev.map(s => s.id === editingSchool.id ? updatedSchool : s));
                await logActivity('Atualização de Escola', { schoolId: editingSchool.id, ...school });
            } else {
                const newSchool = await api.post<School>('/schools', school);
                setSchools(prev => [...prev, newSchool]);
                await logActivity('Criação de Escola', { schoolId: newSchool.id, ...school });
            }
            setIsModalOpen(false);
            setEditingSchool(null);
        } catch (error) {
            console.error("Failed to save school:", error);
            alert("Falha ao salvar escola.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Escolas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Cadastre e gerencie as escolas da rede municipal.</p>
                </div>
                <Button onClick={handleOpenModal}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Adicionar Escola</span>
                </Button>
            </div>

            <SchoolTable
                schools={schools}
                onEdit={handleEditSchool}
                onDelete={handleDeleteSchool}
            />

            {isModalOpen && (
                <SchoolModal
                    school={editingSchool}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveSchool}
                />
            )}
        </div>
    );
};

export default SchoolManagement;