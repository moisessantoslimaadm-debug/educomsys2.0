
import React from 'react';
import { Class, Teacher, Student } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface ClassTableProps {
    classes: Class[];
    teachers: Teacher[];
    students: Student[];
    onEdit: (cls: Class) => void;
    onDelete: (classId: string) => void;
}

const ClassTable: React.FC<ClassTableProps> = ({ classes, teachers, students, onEdit, onDelete }) => {
    
    const getTeacherName = (teacherId: string) => {
        return teachers.find(t => t.id === teacherId)?.name || 'Não definido';
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome da Turma</th>
                            <th scope="col" className="px-6 py-3">Professor</th>
                            <th scope="col" className="px-6 py-3">Nº de Alunos</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.length > 0 ? classes.map((cls) => (
                            <tr key={cls.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {cls.name}
                                </th>
                                <td className="px-6 py-4">{getTeacherName(cls.teacherId)}</td>
                                <td className="px-6 py-4">{cls.studentIds.length}</td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                    <button onClick={() => onEdit(cls)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(cls.id)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhuma turma encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassTable;
