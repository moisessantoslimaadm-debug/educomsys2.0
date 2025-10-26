import React, { useState, useEffect } from 'react';
import api, { logActivity, createNotification } from '../../services/api';
import { Invoice, Student, User, UserRole } from '../../types';
import { PlusIcon } from '../icons/Icons';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import InvoiceTable from './InvoiceTable';
import InvoiceModal from './InvoiceModal';

const InvoiceManagement: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [invoicesData, studentsData, usersData] = await Promise.all([
                    api.get<Invoice[]>('/invoices'),
                    api.get<Student[]>('/students'),
                    api.get<User[]>('/users'),
                ]);
                setInvoices(invoicesData);
                setStudents(studentsData);
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch invoice data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setEditingInvoice(null);
        setIsModalOpen(true);
    };

    const handleEditInvoice = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleDeleteInvoice = async (invoiceId: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta fatura?")) {
            try {
                await api.delete(`/invoices/${invoiceId}`);
                setInvoices(prev => prev.filter(i => i.id !== invoiceId));
                await logActivity('Exclusão de Fatura', { invoiceId });
            } catch (error) {
                console.error("Failed to delete invoice:", error);
                alert("Falha ao excluir fatura.");
            }
        }
    };

    const handleSaveInvoice = async (invoice: Omit<Invoice, 'id'>) => {
        const studentName = students.find(s => s.id === invoice.studentId)?.name || 'N/A';
        const guardian = users.find(u => u.role === UserRole.Responsavel && u.studentId === invoice.studentId);
        
        try {
            if (editingInvoice?.id) {
                const updatedInvoice = await api.put<Invoice>(`/invoices/${editingInvoice.id}`, invoice);
                setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? updatedInvoice : i));
                await logActivity('Atualização de Fatura', { invoiceId: editingInvoice.id, student: studentName });
            } else {
                const newInvoice = await api.post<Invoice>('/invoices', invoice);
                setInvoices(prev => [...prev, newInvoice]);
                await logActivity('Criação de Fatura', { invoiceId: newInvoice.id, student: studentName, amount: invoice.amount });

                if (guardian) {
                     await createNotification(
                        guardian.id,
                        'Nova Fatura Gerada',
                        `Uma nova fatura de R$ ${invoice.amount.toFixed(2)} foi gerada para ${studentName}.`
                    );
                }
            }
            setIsModalOpen(false);
            setEditingInvoice(null);
        } catch (error) {
            console.error("Failed to save invoice:", error);
            alert("Falha ao salvar fatura.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Faturas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Crie e gerencie as faturas e mensalidades dos alunos.</p>
                </div>
                <Button onClick={handleOpenModal}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Nova Fatura</span>
                </Button>
            </div>

            <InvoiceTable
                invoices={invoices}
                students={students}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
            />

            {isModalOpen && (
                <InvoiceModal
                    invoice={editingInvoice}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveInvoice}
                    students={students}
                />
            )}
        </div>
    );
};

export default InvoiceManagement;