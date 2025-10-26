import React, { useState, useEffect, useCallback } from 'react';
import api, { logActivity } from '../../services/api';
import StudentTable from '../StudentTable';
import { PlusIcon } from '../icons/Icons';
import StudentModal from './StudentModal';
import { Student, LessonPlan, Material, Subject, Class } from '../../types';
import Spinner from '../shared/Spinner.tsx';
import StudentDetail from './StudentDetail';

const StudentManagement: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [studentsData, plansData, materialsData, subjectsData, classesData] = await Promise.all([
                api.get<Student[]>('/students'),
                api.get<LessonPlan[]>('/lessonPlans'),
                api.get<Material[]>('/materials'),
                api.get<Subject[]>('/subjects'),
                api.get<Class[]>('/classes'),
            ]);
            setStudents(studentsData);
            setLessonPlans(plansData);
            setMaterials(materialsData);
            setSubjects(subjectsData);
            setClasses(classesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleViewStudent = (student: Student) => {
        setViewingStudent(student);
    };

    const handleBackToList = () => {
        setViewingStudent(null);
    };

    const handleDeleteStudent = async (studentId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
            try {
                const studentName = students.find(s => s.id === studentId)?.name || 'N/A';
                await api.delete(`/students/${studentId}`);
                setStudents(prev => prev.filter(s => s.id !== studentId));
                await logActivity('Exclusão de Aluno', { studentId, name: studentName });
            } catch (error) {
                console.error("Failed to delete student:", error);
                alert("Falha ao excluir aluno.");
            }
        }
    };

    const handleSaveStudent = async (student: Student) => {
        try {
            if (student.id) { // Editing existing student
                const { id, ...studentData } = student;
                const updatedStudent = await api.put<Student>(`/students/${student.id}`, studentData);
                setStudents(prev => prev.map(s => s.id === student.id ? { ...updatedStudent, id: student.id } : s));
                await logActivity('Atualização de Aluno', { studentId: student.id, name: student.name });
            } else { // Adding new student
                const { id, ...studentData } = student;
                const newStudent = await api.post<Student>('/students', studentData);
                setStudents(prev => [...prev, newStudent]);
                await logActivity('Criação de Aluno', { studentId: newStudent.id, name: student.name });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save student:", error);
            alert("Falha ao salvar aluno.");
        }
    };

    if (viewingStudent) {
        return (
            <StudentDetail 
                student={viewingStudent}
                onBack={handleBackToList}
                lessonPlans={lessonPlans}
                materials={materials}
                subjects={subjects}
                classes={classes}
            />
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Alunos</h2>
                    <p className="text-gray-500 dark:text-gray-400">Visualize, adicione e gerencie os alunos matriculados.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Adicionar Aluno</span>
                </button>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <StudentTable 
                    students={students}
                    onView={handleViewStudent}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent} 
                />
            )}
            {isModalOpen && (
                <StudentModal
                    student={editingStudent}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveStudent}
                />
            )}
        </div>
    );
};

export default StudentManagement;