
import React, { useState, useEffect } from 'react';
import { TransferRecord, Student, Class } from '../../types';
import Select from '../shared/Select';
import Input from '../shared/Input';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface TransferFormProps {
    recordToEdit: TransferRecord | null;
    onSave: (record: TransferRecord) => void;
    onCancel: () => void;
    students: Student[];
    classes: Class[];
}

const TransferForm: React.FC<TransferFormProps> = ({ recordToEdit, onSave, onCancel, students, classes }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        fromClass: '',
        toClass: '',
        date: new Date().toISOString().split('T')[0],
        reason: '',
        observations: '',
    });

    useEffect(() => {
        if (recordToEdit) {
            setFormData(recordToEdit);
        }
    }, [recordToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        // Auto-fill fromClass when student is selected
        if (name === 'studentId') {
            const student = students.find(s => s.id === value);
            setFormData(prev => ({
                ...prev,
                studentId: value,
                fromClass: student?.class || ''
            }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: recordToEdit?.id,
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                 <Input
                    label="Data da Transferência"
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                 <Input
                    label="Turma de Origem"
                    id="fromClass"
                    name="fromClass"
                    value={formData.fromClass}
                    onChange={handleChange}
                    required
                    disabled
                />
                 <Select
                    label="Turma de Destino"
                    id="toClass"
                    name="toClass"
                    value={formData.toClass}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Selecione a turma</option>
                    {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    <option value="Outra Escola">Outra Escola</option>
                </Select>
            </div>
             <Input
                label="Motivo"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
            />
            <TextArea
                label="Observações"
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={3}
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default TransferForm;
