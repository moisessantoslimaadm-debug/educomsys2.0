import React from 'react';
import { Invoice, Student } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface InvoiceTableProps {
    invoices: Invoice[];
    students: Student[];
    onEdit: (invoice: Invoice) => void;
    onDelete: (invoiceId: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, students, onEdit, onDelete }) => {

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';
    
    const getStatusChip = (status: 'Pago' | 'Pendente' | 'Atrasado') => {
        const base = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'Pago': return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
            case 'Pendente': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
            case 'Atrasado': return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Aluno</th>
                            <th scope="col" className="px-6 py-3">Valor</th>
                            <th scope="col" className="px-6 py-3">Vencimento</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-6 py-4 font-medium">{getStudentName(invoice.studentId)}</td>
                                <td className="px-6 py-4">R$ {invoice.amount.toFixed(2).replace('.', ',')}</td>
                                <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={getStatusChip(invoice.status)}>{invoice.status}</span></td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                    <button onClick={() => onEdit(invoice)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(invoice.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                         {invoices.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-6">Nenhuma fatura encontrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;
