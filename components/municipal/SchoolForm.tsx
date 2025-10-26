import React, { useState, useEffect } from 'react';
import { School } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface SchoolFormProps {
    schoolToEdit: School | null;
    onSave: (school: Omit<School, 'id'>) => void;
    onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ schoolToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        studentCount: 0,
        averageGrade: 0,
    });

    useEffect(() => {
        if (schoolToEdit) {
            setFormData({
                name: schoolToEdit.name,
                city: schoolToEdit.city,
                studentCount: schoolToEdit.studentCount,
                averageGrade: schoolToEdit.averageGrade,
            });
        }
    }, [schoolToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nome da Escola"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <Input
                label="Cidade"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default SchoolForm;
