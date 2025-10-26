import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { TransferRecord, Student, Class } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../icons/Icons';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner.tsx';
import TransferModal from './TransferModal';

const TransferManagement: React.FC = () => {
    const [records, setRecords] = useState<TransferRecord[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TransferRecord | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recordsData, studentsData, classesData] = await Promise.all([
                    api.get<TransferRecord[]>('/transferRecords'),
                    api.get<Student[]>('/students'),
                    api.get<Class[]>('/classes'),
                ]);
                setRecords(recordsData);
                setStudents(studentsData);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch transfer data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';
    
    const handleOpenModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEditRecord = (record: TransferRecord) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este registro de transferência? A ação não pode ser desfeita.")) {
            try {
                await api.delete(`/transferRecords/${recordId}`);
                setRecords(prev => prev.filter(r => r.id !== recordId));
                await logActivity('Exclusão de Registro de Transferência', { recordId });
            } catch (error) {
                console.error("Failed to delete transfer record:", error);
                alert("Falha ao excluir registro.");
            }
        }
    };

    const handleSaveRecord = async (record: TransferRecord) => {
        const student = students.find(s => s.id === record.studentId);
        if (!student) {
            alert("Aluno não encontrado!");
            return;
        }
        
        // This is a complex transaction. In a real backend, this would be a single endpoint.
        // Here we simulate it with multiple calls.
        try {
            // 1. Update Student's record
            await api.put(`/students/${record.studentId}`, {
                class: record.toClass,
                status: record.toClass === 'Outra Escola' ? 'Transferido' : 'Ativo',
            });

            // 2. Update Class records
            const originClass = classes.find(c => c.name === record.fromClass);
            if (originClass) {
                await api.put(`/classes/${originClass.id}`, { 
                    studentIds: originClass.studentIds.filter(id => id !== record.studentId)
                });
            }
            
            const destinationClass = classes.find(c => c.name === record.toClass);
            if (destinationClass) {
                 await api.put(`/classes/${destinationClass.id}`, {
                     studentIds: [...destinationClass.studentIds, record.studentId]
                 });
            }

            // 3. Save the transfer record itself
            if (record.id) {
                await api.put(`/transferRecords/${record.id}`, record);
            } else {
                const newRecord = await api.post<TransferRecord>('/transferRecords', record);
                record.id = newRecord.id;
            }

            // Refresh local data to reflect changes
            const [updatedStudents, updatedClasses, updatedRecords] = await Promise.all([
                api.get<Student[]>('/students'),
                api.get<Class[]>('/classes'),
                api.get<TransferRecord[]>('/transferRecords')
            ]);
            setStudents(updatedStudents);
            setClasses(updatedClasses);
            setRecords(updatedRecords);

            await logActivity(record.id ? 'Atualização de Transferência' : 'Criação de Transferência', { recordId: record.id, student: student.name, from: record.fromClass, to: record.toClass });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao processar transferência: ", error);
            alert("Falha ao processar a transferência.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Transferências</h2>
                    <p className="text-gray-500 dark:text-gray-400">Registre e consulte as transferências de alunos.</p>
                </div>
                 <Button onClick={handleOpenModal}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Nova Transferência</span>
                </Button>
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4">Histórico de Transferências</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">De</th>
                                <th scope="col" className="px-6 py-3">Para</th>
                                <th scope="col" className="px-6 py-3">Motivo</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{getStudentName(record.studentId)}</td>
                                    <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{record.fromClass}</td>
                                    <td className="px-6 py-4">{record.toClass}</td>
                                    <td className="px-6 py-4">{record.reason}</td>
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
                            {records.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-6">Nenhum registro de transferência encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <TransferModal 
                    record={editingRecord}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRecord}
                    students={students}
                    classes={classes}
                />
            )}
        </div>
    );
};

export default TransferManagement;