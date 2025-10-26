
import React from 'react';
import { Enrollment } from '../../types';
import { CheckIcon, BanIcon } from '../icons/Icons';

interface EnrollmentTableProps {
    enrollments: Enrollment[];
    onApprove: (enrollment: Enrollment) => void;
    onReject: (id: string) => void;
}

const EnrollmentTable: React.FC<EnrollmentTableProps> = ({ enrollments, onApprove, onReject }) => {
    
    const getStatusChip = (status: 'Pendente' | 'Aprovada' | 'Rejeitada') => {
        const base = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'Pendente': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
            case 'Aprovada': return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
            case 'Rejeitada': return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                            <th scope="col" className="px-6 py-3">Responsável</th>
                            <th scope="col" className="px-6 py-3">Data da Solicitação</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enroll) => (
                            <tr key={enroll.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium">{enroll.studentName}</td>
                                <td className="px-6 py-4">{enroll.guardianName}</td>
                                <td className="px-6 py-4">{new Date(enroll.submissionDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={getStatusChip(enroll.status)}>{enroll.status}</span></td>
                                <td className="px-6 py-4 text-center">
                                    {enroll.status === 'Pendente' ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => onApprove(enroll)} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><CheckIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onReject(enroll.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><BanIcon className="w-4 h-4" /></button>
                                        </div>
                                    ) : '—'}
                                </td>
                            </tr>
                        ))}
                        {enrollments.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-6">Nenhuma solicitação de matrícula encontrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollmentTable;
