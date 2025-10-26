
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { MedicalRecord } from '../../types';
import Input from '../shared/Input';
import Select from '../shared/Select';
import TextArea from '../shared/TextArea';
import Button from '../shared/Button';

interface MedicalRecordModalProps {
    record: MedicalRecord | null;
    onClose: () => void;
    onSave: (record: MedicalRecord) => void;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({ record, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<MedicalRecord, 'id'>>({
        bloodType: 'A+',
        allergies: '',
        chronicConditions: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    });

    useEffect(() => {
        if (record) {
            setFormData({
                bloodType: record.bloodType,
                allergies: record.allergies,
                chronicConditions: record.chronicConditions,
                emergencyContactName: record.emergencyContactName,
                emergencyContactPhone: record.emergencyContactPhone,
            });
        }
    }, [record]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: record?.id, ...formData });
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Editar Ficha Médica">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Tipo Sanguíneo" id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange}>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                </div>
                <TextArea label="Alergias Conhecidas" id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} rows={3} />
                <TextArea label="Condições Crônicas / Medicamentos" id="chronicConditions" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} rows={3} />
                <h3 className="text-md font-semibold pt-2 border-t">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nome do Contato" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
                    <Input label="Telefone do Contato" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </Modal>
    );
};

export default MedicalRecordModal;
