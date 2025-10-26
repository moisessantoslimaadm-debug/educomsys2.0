import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface FinancialFormProps {
    transactionToEdit: Transaction | null;
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
}

const FinancialForm: React.FC<FinancialFormProps> = ({ transactionToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'Despesa' as 'Receita' | 'Despesa',
        date: new Date().toISOString().split('T')[0],
        category: 'Outros'
    });

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                description: transactionToEdit.description,
                amount: String(Math.abs(transactionToEdit.amount)),
                type: transactionToEdit.type,
                date: transactionToEdit.date,
                category: transactionToEdit.category,
            });
        }
    }, [transactionToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNumber = parseFloat(formData.amount);
        if (isNaN(amountNumber)) {
            alert('Por favor, insira um valor numérico válido.');
            return;
        }

        onSave({
            id: transactionToEdit?.id || '',
            description: formData.description,
            amount: formData.type === 'Receita' ? amountNumber : -amountNumber,
            type: formData.type,
            date: formData.date,
            category: formData.category,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Descrição"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
            />
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
                 <Select
                    label="Tipo de Lançamento"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option>Despesa</option>
                    <option>Receita</option>
                </Select>
                 <Input
                    label="Data"
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                 <Input
                    label="Categoria"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default FinancialForm;
