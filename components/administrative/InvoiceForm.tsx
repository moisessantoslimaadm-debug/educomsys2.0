import React, { useState, useEffect } from 'react';
import { Invoice, Student } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface InvoiceFormProps {
    invoiceToEdit: Invoice | null;
    onSave: (invoice: Omit<Invoice, 'id'>) => void;
    onCancel: () => void;
    students: Student[];
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceToEdit, onSave, onCancel, students }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Pendente' as Invoice['status'],
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        paymentUrl: '#',
    });

    useEffect(() => {
        if (invoiceToEdit) {
            setFormData({
                studentId: invoiceToEdit.studentId,
                amount: invoiceToEdit.amount,
                dueDate: invoiceToEdit.dueDate,
                status: invoiceToEdit.status,
                month: invoiceToEdit.month,
                year: invoiceToEdit.year,
                paymentUrl: invoiceToEdit.paymentUrl,
            });
        }
    }, [invoiceToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select
                label="Aluno"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
            >
                <option value="">Selecione um aluno</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                    label="Valor (R$)"
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                />
                 <Input
                    label="Data de Vencimento"
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <Select
                label="Status"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
            >
                <option>Pendente</option>
                <option>Pago</option>
                <option>Atrasado</option>
            </Select>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar Fatura</Button>
            </div>
        </form>
    );
};

export default InvoiceForm;
