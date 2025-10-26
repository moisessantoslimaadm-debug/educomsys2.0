

import React from 'react';
import { Student } from '../types';
import { EyeIcon, PencilIcon, TrashIcon } from './icons/Icons';

interface StudentTableProps {
    students: Student[];
    onView: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (studentId: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onView, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                            <th scope="col" className="px-6 py-3">Turma</th>
                            <th scope="col" className="px-6 py-3">Média</th>
                            <th scope="col" className="px-6 py-3">Frequência</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map((student) => (
                            <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {student.name}
                                </th>
                                <td className="px-6 py-4">{student.class}</td>
                                <td className={`px-6 py-4 font-bold ${student.averageGrade >= 7 ? 'text-green-500' : 'text-red-500'}`}>
                                    {student.averageGrade.toFixed(1)}
                                </td>
                                <td className={`px-6 py-4 font-bold ${student.attendance >= 85 ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {student.attendance}%
                                </td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-1">
                                    <button onClick={() => onView(student)} className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label={`Ver detalhes de ${student.name}`}>
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onEdit(student)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label={`Editar ${student.name}`}>
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(student.id)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label={`Excluir ${student.name}`}>
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum aluno encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentTable;