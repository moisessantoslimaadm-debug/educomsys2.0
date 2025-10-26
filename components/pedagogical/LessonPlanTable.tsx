
import React from 'react';
import { LessonPlan, Subject, Class } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface LessonPlanTableProps {
    plans: LessonPlan[];
    subjects: Subject[];
    classes: Class[];
    onEdit: (plan: LessonPlan) => void;
    onDelete: (planId: string) => void;
}

const LessonPlanTable: React.FC<LessonPlanTableProps> = ({ plans, subjects, classes, onEdit, onDelete }) => {
    
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';
    const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Título</th>
                            <th scope="col" className="px-6 py-3">Disciplina</th>
                            <th scope="col" className="px-6 py-3">Turma</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.length > 0 ? plans.map((plan) => (
                            <tr key={plan.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {plan.title}
                                </th>
                                <td className="px-6 py-4">{getSubjectName(plan.subjectId)}</td>
                                <td className="px-6 py-4">{getClassName(plan.classId)}</td>
                                <td className="px-6 py-4">{new Date(plan.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                    <button onClick={() => onEdit(plan)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(plan.id)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum plano de aula encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LessonPlanTable;
