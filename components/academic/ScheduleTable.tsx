
import React from 'react';
import { Schedule, Class, Subject } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface ScheduleTableProps {
    schedules: Schedule[];
    classes: Class[];
    subjects: Subject[];
    onEdit: (schedule: Schedule) => void;
    onDelete: (scheduleId: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, classes, subjects, onEdit, onDelete }) => {
    
    const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Turma</th>
                            <th scope="col" className="px-6 py-3">Dia</th>
                            <th scope="col" className="px-6 py-3">Horário</th>
                            <th scope="col" className="px-6 py-3">Disciplina</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((item) => (
                            <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-6 py-4 font-medium">{getClassName(item.classId)}</td>
                                <td className="px-6 py-4">{item.day}</td>
                                <td className="px-6 py-4">{item.time}</td>
                                <td className="px-6 py-4">{getSubjectName(item.subjectId)}</td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                    <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(item.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                         {schedules.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-6">Nenhum horário cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;
