import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Invoice } from '../../types';
import { CurrencyDollarIcon } from '../icons/Icons';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner.tsx';

interface GuardianFinancialsProps {
    studentId: string;
}

const GuardianFinancials: React.FC<GuardianFinancialsProps> = ({ studentId }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;

        const fetchInvoices = async () => {
            try {
                const data = await api.get<Invoice[]>(`/invoices?student_id=${studentId}`);
                setInvoices(data);
            } catch (error) {
                console.error("Failed to fetch invoices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [studentId]);

    const getStatusChip = (status: 'Pago' | 'Pendente' | 'Atrasado') => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'Pago': return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
            case 'Pendente': return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
            case 'Atrasado': return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
        }
    };
    
    const getMonthName = (monthNumber: number) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('pt-BR', { month: 'long' });
    }

    if(loading) return <Spinner />;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2" />
                Minhas Mensalidades
            </h2>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Referência</th>
                            <th scope="col" className="px-6 py-3">Valor</th>
                            <th scope="col" className="px-6 py-3">Vencimento</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium capitalize">{getMonthName(invoice.month)} / {invoice.year}</td>
                                <td className="px-6 py-4">R$ {invoice.amount.toFixed(2).replace('.', ',')}</td>
                                <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={getStatusChip(invoice.status)}>{invoice.status}</span></td>
                                <td className="px-6 py-4 text-center"><Button variant="secondary" onClick={() => alert('Visualizando boleto...')}>Ver Boleto</Button></td>
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

export default GuardianFinancials;