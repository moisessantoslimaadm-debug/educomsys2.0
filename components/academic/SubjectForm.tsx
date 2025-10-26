
import React, { useState, useEffect } from 'react';
import { Subject } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface SubjectFormProps {
    subjectToEdit: Subject | null;
    onSave: (subject: Subject) => void;
    onCancel: () => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subjectToEdit, onSave, onCancel }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (subjectToEdit) {
            setName(subjectToEdit.name);
        } else {
            setName('');
        }
    }, [subjectToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: subjectToEdit?.id || '',
            name,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nome da Disciplina"
                id="subjectName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default SubjectForm;
