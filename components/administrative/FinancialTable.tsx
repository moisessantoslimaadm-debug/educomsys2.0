import React from 'react';
import { Transaction } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface FinancialTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transactionId: string) => void;
}

const FinancialTable: React.FC<FinancialTableProps> = ({ transactions, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Descrição</th>
                            <th scope="col" className="px-6 py-3">Valor</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map((trn) => (
                            <tr key={trn.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {trn.description}
                                </th>
                                <td className={`px-6 py-4 font-bold ${trn.type === 'Receita' ? 'text-green-500' : 'text-red-500'}`}>
                                    R$ {Math.abs(trn.amount).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${trn.type === 'Receita' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                        {trn.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(trn.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                    <button onClick={() => onEdit(trn)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onDelete(trn.id)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum lançamento financeiro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinancialTable;
