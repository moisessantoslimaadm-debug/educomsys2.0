import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import { Transaction } from '../../types';
import FinancialModal from './FinancialModal';
import FinancialTable from './FinancialTable';
import Spinner from '../shared/Spinner.tsx';

const FinancialManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await api.get<Transaction[]>('/transactions');
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const summary = transactions.reduce((acc, t) => {
        if (t.type === 'Receita') acc.revenue += t.amount;
        else acc.expense += Math.abs(t.amount);
        return acc;
    }, { revenue: 0, expense: 0 });
    const balance = summary.revenue - summary.expense;


    const handleOpenModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEditTransaction = (trn: Transaction) => {
        setEditingTransaction(trn);
        setIsModalOpen(true);
    };

    const handleDeleteTransaction = async (trnId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
            try {
                const trnDesc = transactions.find(t => t.id === trnId)?.description || 'N/A';
                await api.delete(`/transactions/${trnId}`);
                setTransactions(prev => prev.filter(t => t.id !== trnId));
                await logActivity('Exclusão de Transação', { transactionId: trnId, description: trnDesc });
            } catch (error) {
                console.error("Failed to delete transaction:", error);
                alert("Falha ao excluir transação.");
            }
        }
    };

    const handleSaveTransaction = async (trn: Transaction) => {
        try {
            if (trn.id) {
                const { id, ...trnData } = trn;
                const updatedTrn = await api.put<Transaction>(`/transactions/${id}`, trnData);
                setTransactions(prev => prev.map(t => t.id === id ? { ...updatedTrn, id } : t));
                await logActivity('Atualização de Transação', { transactionId: id, description: trn.description, amount: trn.amount });
            } else {
                const { id, ...trnData } = trn;
                const newTrn = await api.post<Transaction>('/transactions', trnData);
                setTransactions(prev => [...prev, newTrn]);
                await logActivity('Criação de Transação', { transactionId: newTrn.id, description: trn.description, amount: trn.amount });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save transaction:", error);
            alert("Falha ao salvar transação.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento Financeiro</h2>
                    <p className="text-gray-500 dark:text-gray-400">Controle as receitas e despesas da instituição.</p>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Novo Lançamento</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/40 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-700 dark:text-green-300">Total de Receitas</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-200">R$ {summary.revenue.toLocaleString('pt-BR')}</p>
                </div>
                 <div className="bg-red-50 dark:bg-red-900/40 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <p className="text-sm text-red-700 dark:text-red-300">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-200">R$ {summary.expense.toLocaleString('pt-BR')}</p>
                </div>
                 <div className={`p-4 rounded-lg border ${balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700' : 'bg-yellow-50 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-700'}`}>
                    <p className={`text-sm ${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-yellow-700 dark:text-yellow-300'}`}>Saldo Atual</p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-200' : 'text-yellow-600 dark:text-yellow-200'}`}>R$ {balance.toLocaleString('pt-BR')}</p>
                </div>
            </div>
            
            <FinancialTable 
                transactions={transactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction} 
            />
            {isModalOpen && (
                <FinancialModal
                    transaction={editingTransaction}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransaction}
                />
            )}
        </div>
    );
};

export default FinancialManagement;