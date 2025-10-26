
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { HealthIncident, Student } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface HealthIncidentModalProps {
    incident: HealthIncident | null;
    onClose: () => void;
    onSave: (incident: Omit<HealthIncident, 'id' | 'reportedById'>) => void;
    students: Student[];
}

const HealthIncidentModal: React.FC<HealthIncidentModalProps> = ({ incident, onClose, onSave, students }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0,5),
        description: '',
        actionsTaken: ''
    });

    useEffect(() => {
        if (incident) {
            setFormData({
                studentId: incident.studentId,
                date: incident.date,
                time: incident.time,
                description: incident.description,
                actionsTaken: incident.actionsTaken,
            });
        }
    }, [incident]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={incident ? "Editar Ocorrência" : "Nova Ocorrência de Saúde"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="Aluno" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required>
                    <option value="">Selecione um aluno</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Data" id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    <Input label="Hora" id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
                <TextArea label="Descrição da Ocorrência" id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
                <TextArea label="Ações Tomadas / Providências" id="actionsTaken" name="actionsTaken" value={formData.actionsTaken} onChange={handleChange} rows={3} required />

                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar Registro</Button>
                </div>
            </form>
        </Modal>
    );
};

export default HealthIncidentModal;
