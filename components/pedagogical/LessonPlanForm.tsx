
import React, { useState, useEffect } from 'react';
import { LessonPlan, Subject, Class } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import Button from '../shared/Button';
import TextArea from '../shared/TextArea';

interface LessonPlanFormProps {
    planToEdit: LessonPlan | null;
    onSave: (plan: LessonPlan) => void;
    onCancel: () => void;
    subjects: Subject[];
    classes: Class[];
}

const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ planToEdit, onSave, onCancel, subjects, classes }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        classId: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (planToEdit) {
            setFormData({
                title: planToEdit.title,
                description: planToEdit.description,
                subjectId: planToEdit.subjectId,
                classId: planToEdit.classId,
                date: planToEdit.date,
            });
        }
    }, [planToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: planToEdit?.id || '',
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Título do Plano"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                    label="Disciplina"
                    id="subjectId"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Selecione</option>
                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </Select>
                 <Select
                    label="Turma"
                    id="classId"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Selecione</option>
                    {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
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
            </div>
            <TextArea
                label="Descrição e Objetivos"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
            />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default LessonPlanForm;
