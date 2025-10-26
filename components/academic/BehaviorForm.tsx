
import React, { useState, useEffect } from 'react';
import { BehaviorRecord, Student } from '../../types';
import Select from '../shared/Select';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface BehaviorFormProps {
    recordToEdit: BehaviorRecord | null;
    onSave: (record: BehaviorRecord) => void;
    onCancel: () => void;
    students: Student[];
}

const BehaviorForm: React.FC<BehaviorFormProps> = ({ recordToEdit, onSave, onCancel, students }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'Negativo' as 'Positivo' | 'Negativo',
        description: '',
    });

    useEffect(() => {
        if (recordToEdit) {
            setFormData({
                studentId: recordToEdit.studentId,
                date: recordToEdit.date,
                type: recordToEdit.type,
                description: recordToEdit.description,
            });
        }
    }, [recordToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: recordToEdit?.id,
            authorId: recordToEdit?.authorId || '', // AuthorId is set in the parent component
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                    <Select
                        label="Aluno"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecione um aluno</option>
                        {students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
                    </Select>
                </div>
                 <Input
                    label="Data"
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                 <Select
                    label="Tipo de Ocorrência"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option>Negativo</option>
                    <option>Positivo</option>
                </Select>
            </div>
            <TextArea
                label="Descrição da Ocorrência"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default BehaviorForm;
