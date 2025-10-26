
import React, { useState, useEffect } from 'react';
import { Schedule, Class, Subject } from '../../types';
import Select from '../shared/Select';
import Button from '../shared/Button';

interface ScheduleFormProps {
    scheduleToEdit: Schedule | null;
    onSave: (schedule: Schedule) => void;
    onCancel: () => void;
    classes: Class[];
    subjects: Subject[];
}

const daysOfWeek: Schedule['day'][] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const timeSlots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00'];

const ScheduleForm: React.FC<ScheduleFormProps> = ({ scheduleToEdit, onSave, onCancel, classes, subjects }) => {
    const [formData, setFormData] = useState({
        classId: '',
        day: 'Segunda' as Schedule['day'],
        time: '08:00 - 09:00',
        subjectId: '',
    });

    useEffect(() => {
        if (scheduleToEdit) {
            setFormData({
                classId: scheduleToEdit.classId,
                day: scheduleToEdit.day,
                time: scheduleToEdit.time,
                subjectId: scheduleToEdit.subjectId,
            });
        }
    }, [scheduleToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: scheduleToEdit?.id,
            ...formData,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Turma" id="classId" name="classId" value={formData.classId} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select label="Disciplina" id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                    <option value="">Selecione</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                 <Select label="Dia da Semana" id="day" name="day" value={formData.day} onChange={handleChange} required>
                    {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                </Select>
                 <Select label="Horário" id="time" name="time" value={formData.time} onChange={handleChange} required>
                     {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                </Select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default ScheduleForm;
