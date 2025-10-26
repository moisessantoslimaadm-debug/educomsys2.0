
import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface EmployeeFormProps {
    employeeToEdit: Employee | null;
    onSave: (employee: Employee) => void;
    onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employeeToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'Professor',
        email: '',
        phone: '',
        hireDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (employeeToEdit) {
            setFormData({
                name: employeeToEdit.name,
                role: employeeToEdit.role,
                email: employeeToEdit.email,
                phone: employeeToEdit.phone,
                hireDate: employeeToEdit.hireDate
            });
        }
    }, [employeeToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: employeeToEdit?.id || '',
            ...formData,
        } as Employee);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nome Completo"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                 <Select
                    label="Cargo"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option>Professor</option>
                    <option>Secretaria</option>
                    <option>Direção</option>
                    <option>Coordenação</option>
                </Select>
                 <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                 <Input
                    label="Telefone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                 <Input
                    label="Data de Contratação"
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default EmployeeForm;
