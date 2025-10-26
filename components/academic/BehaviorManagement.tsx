import React, { useState, useMemo, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { BehaviorRecord, Student, Class, Teacher, User } from '../../types';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner.tsx';
import BehaviorModal from './BehaviorModal';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface BehaviorManagementProps {
    user: User;
}

const BehaviorManagement: React.FC<BehaviorManagementProps> = ({ user }) => {
    const [records, setRecords] = useState<BehaviorRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<BehaviorRecord | null>(null);
    const [selectedClassId, setSelectedClassId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordsData, studentsData, classesData, teachersData] = await Promise.all([
                    api.get<BehaviorRecord[]>('/behaviorRecords'),
                    api.get<Student[]>('/students'),
                    api.get<Class[]>('/classes'),
                    api.get<Teacher[]>('/teachers'),
                ]);
                setRecords(recordsData);
                setStudents(studentsData);
                setClasses(classesData);
                setTeachers(teachersData);
            } catch (error) {
                console.error("Failed to fetch behavior management data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEditRecord = (record: BehaviorRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta ocorrência?")) {
            try {
                await api.delete(`/behaviorRecords/${recordId}`);
                setRecords(prev => prev.filter(r => r.id !== recordId));
                await logActivity('Exclusão de Ocorrência', { recordId });
            } catch (error) {
                console.error("Failed to delete behavior record:", error);
                alert("Falha ao excluir ocorrência.");
            }
        }
    };

    const handleSaveRecord = async (record: BehaviorRecord) => {
        if (!user) return;
        
        const studentName = students.find(s => s.id === record.studentId)?.name || 'N/A';
        const recordData = {
            ...record,
            authorId: user.id, // Ensure author is always current user
        };

        try {
            if (record.id) {
                const updatedRecord = await api.put<BehaviorRecord>(`/behaviorRecords/${record.id}`, recordData);
                setRecords(prev => prev.map(r => r.id === record.id ? updatedRecord : r));
                await logActivity('Atualização de Ocorrência', { recordId: record.id, student: studentName, type: record.type });
            } else {
                const newRecord = await api.post<BehaviorRecord>('/behaviorRecords', recordData);
                setRecords(prev => [...prev, newRecord]);
                await logActivity('Criação de Ocorrência', { recordId: newRecord.id, student: studentName, type: record.type });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save behavior record:", error);
            alert("Falha ao salvar ocorrência.");
        }
    };

    const filteredRecords = useMemo(() => {
        if (!selectedClassId) return records;
        const classInfo = classes.find(c => c.id === selectedClassId);
        if (!classInfo) return [];
        const studentIdsInClass = classInfo.studentIds;
        return records.filter(r => studentIdsInClass.includes(r.studentId));
    }, [selectedClassId, records, classes]);

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';
    const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'N/A';

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Registro de Ocorrências</h2>
                    <p className="text-gray-500 dark:text-gray-400">Acompanhe o comportamento e as ocorrências dos alunos.</p>
                </div>
                 <Button onClick={handleOpenModal}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Nova Ocorrência</span>
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="max-w-xs mb-4">
                    <Select id="class-filter" label="Filtrar por Turma" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                        <option value="">Todas as Turmas</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                </div>
                
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3">Registrado por</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{getStudentName(record.studentId)}</td>
                                    <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${record.type === 'Positivo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{record.description}</td>
                                    <td className="px-6 py-4">{getTeacherName(record.authorId)}</td>
                                    <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                        <button onClick={() => handleEditRecord(record)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteRecord(record.id!)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                             {filteredRecords.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-6">Nenhum registro encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <BehaviorModal
                    record={editingRecord}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRecord}
                    students={students}
                />
            )}
        </div>
    );
};

export default BehaviorManagement;