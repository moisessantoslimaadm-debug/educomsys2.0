
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface EventFormProps {
    eventToEdit: CalendarEvent | null;
    selectedDate: string | null;
    onSave: (event: Omit<CalendarEvent, 'id'>) => void;
    onCancel: () => void;
    canManage: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ eventToEdit, selectedDate, onSave, onCancel, canManage }) => {
    const [formData, setFormData] = useState({
        title: '',
        start: selectedDate || new Date().toISOString().split('T')[0],
        end: '',
        type: 'Evento' as CalendarEvent['type'],
        description: '',
    });

    useEffect(() => {
        if (eventToEdit) {
            setFormData({
                title: eventToEdit.title,
                start: eventToEdit.start,
                end: eventToEdit.end || '',
                type: eventToEdit.type,
                description: eventToEdit.description || '',
            });
        }
    }, [eventToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Título do Evento"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={!canManage}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Data de Início"
                    id="start"
                    name="start"
                    type="date"
                    value={formData.start}
                    onChange={handleChange}
                    required
                    disabled={!canManage}
                />
                <Input
                    label="Data de Fim (Opcional)"
                    id="end"
                    name="end"
                    type="date"
                    value={formData.end}
                    onChange={handleChange}
                    disabled={!canManage}
                />
            </div>
            <Select
                label="Tipo de Evento"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={!canManage}
            >
                <option>Evento</option>
                <option>Prova</option>
                <option>Reunião</option>
                <option>Feriado</option>
                <option>Outro</option>
            </Select>
            <TextArea
                label="Descrição (Opcional)"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                disabled={!canManage}
            />
            {canManage && (
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Salvar Evento</Button>
                </div>
            )}
        </form>
    );
};

export default EventForm;
