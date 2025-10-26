import React, { useMemo } from 'react';
import { Student, LessonPlan, Material, Subject, Class } from '../../types';
import { ArrowLeftIcon, ClipboardListIcon, DocumentTextIcon, DownloadIcon } from '../icons/Icons';
import Button from '../shared/Button';

interface StudentDetailProps {
    student: Student;
    onBack: () => void;
    lessonPlans: LessonPlan[];
    materials: Material[];
    subjects: Subject[];
    classes: Class[];
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack, lessonPlans, materials, subjects, classes }) => {

    const studentClass = useMemo(() => {
        return classes.find(c => c.name === student.class);
    }, [classes, student.class]);

    const relevantLessonPlans = useMemo(() => {
        if (!studentClass) return [];
        return lessonPlans.filter(plan => plan.classId === studentClass.id);
    }, [lessonPlans, studentClass]);

    const relevantMaterials = useMemo(() => {
        if (!studentClass) return [];
        return materials.filter(material => material.classId === studentClass.id);
    }, [materials, studentClass]);

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';

    return (
        <div>
            <Button variant="secondary" onClick={onBack} className="mb-6">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Voltar para a Lista de Alunos
            </Button>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div><strong className="block text-gray-500">Turma:</strong> <span className="font-medium">{student.class}</span></div>
                    <div><strong className="block text-gray-500">Status:</strong> <span className="font-medium">{student.status}</span></div>
                    <div><strong className="block text-gray-500">Média Geral:</strong> <span className="font-medium">{student.averageGrade.toFixed(1)}</span></div>
                    <div><strong className="block text-gray-500">Frequência:</strong> <span className="font-medium">{student.attendance}%</span></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Planos de Aula e Materiais da Turma</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Lesson Plans Column */}
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center"><ClipboardListIcon className="w-5 h-5 mr-2 text-primary-600"/>Planos de Aula</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {relevantLessonPlans.length > 0 ? relevantLessonPlans.map(plan => (
                                <div key={plan.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{plan.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{getSubjectName(plan.subjectId)} - {new Date(plan.date).toLocaleDateString()}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500">Nenhum plano de aula encontrado.</p>
                            )}
                        </div>
                    </div>
                    {/* Materials Column */}
                    <div>
                         <h4 className="font-semibold mb-3 flex items-center"><DocumentTextIcon className="w-5 h-5 mr-2 text-green-600"/>Materiais Pedagógicos</h4>
                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {relevantMaterials.length > 0 ? relevantMaterials.map(material => (
                                <div key={material.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{material.fileName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{getSubjectName(material.subjectId)} - {new Date(material.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label={`Baixar ${material.fileName}`}>
                                        <DownloadIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500">Nenhum material encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;