import React, { useState, useEffect, useMemo } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { Class, Teacher, Student } from '../../types';
import ClassModal from './ClassModal';
import ClassTable from './ClassTable';
import Spinner from '../shared/Spinner.tsx';
import Select from '../shared/Select';

const ClassManagement: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesData, teachersData, studentsData] = await Promise.all([
                    api.get<Class[]>('/classes'),
                    api.get<Teacher[]>('/teachers'),
                    api.get<Student[]>('/students'),
                ]);
                setClasses(classesData);
                setTeachers(teachersData);
                setStudents(studentsData);
            } catch (error) {
                console.error("Failed to fetch class management data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredClasses = useMemo(() => {
        if (!selectedTeacherId) {
            return classes;
        }
        return classes.filter(cls => cls.teacherId === selectedTeacherId);
    }, [selectedTeacherId, classes]);

    const handleOpenModal = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const handleEditClass = (cls: Class) => {
        setEditingClass(cls);
        setIsModalOpen(true);
    };

    const handleDeleteClass = async (classId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta turma?")) {
            try {
                const className = classes.find(c => c.id === classId)?.name || 'N/A';
                await api.delete(`/classes/${classId}`);
                setClasses(prev => prev.filter(c => c.id !== classId));
                await logActivity('Exclusão de Turma', { classId, name: className });
            } catch (error) {
                console.error("Failed to delete class:", error);
                alert("Falha ao excluir turma.");
            }
        }
    };

    const handleSaveClass = async (cls: Class) => {
        try {
            if (cls.id) {
                const { id, ...classData } = cls;
                const updatedClass = await api.put<Class>(`/classes/${id}`, classData);
                setClasses(prev => prev.map(c => c.id === id ? { ...updatedClass, id } : c));
                await logActivity('Atualização de Turma', { classId: id, name: cls.name });
            } else {
                const { id, ...classData } = cls;
                const newClass = await api.post<Class>('/classes', classData);
                setClasses(prev => [...prev, newClass]);
                await logActivity('Criação de Turma', { classId: newClass.id, name: cls.name });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save class:", error);
            alert("Falha ao salvar turma.");
        }
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Turmas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Crie, edite e organize as turmas da escola.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Adicionar Turma</span>
                </button>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="mb-4 max-w-sm">
                        <Select
                            id="teacher-filter"
                            label="Filtrar por Professor"
                            value={selectedTeacherId}
                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                        >
                            <option value="">Todos os Professores</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id!}>
                                    {teacher.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <ClassTable 
                        classes={filteredClasses}
                        teachers={teachers}
                        students={students}
                        onEdit={handleEditClass}
                        onDelete={handleDeleteClass} 
                    />
                </>
            )}
            {isModalOpen && (
                <ClassModal
                    classData={editingClass}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveClass}
                    teachers={teachers}
                    students={students}
                />
            )}
        </div>
    );
};

export default ClassManagement;