import React, { useState } from 'react';
import api from '../../services/api';
import { Enrollment } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icons';

interface EnrollmentFormProps {
    onCancel: () => void;
}

const initialFormState: Omit<Enrollment, 'id' | 'submissionDate' | 'status'> = {
    studentName: '',
    studentCpf: '',
    studentBirthDate: '',
    guardianName: '',
    guardianCpf: '',
    guardianPhone: '',
    desiredClass: '',
};

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onCancel }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/enrollments', {
                ...formData,
                submissionDate: new Date().toISOString(),
                status: 'Pendente',
            });
            alert("Solicitação de matrícula enviada com sucesso!");
            onCancel(); // Close modal on success
        } catch (error) {
            console.error("Error submitting enrollment: ", error);
            alert("Falha ao enviar a matrícula. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Dados do Aluno</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Nome Completo do Aluno" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required />
                    <Input label="CPF do Aluno" id="studentCpf" name="studentCpf" value={formData.studentCpf} onChange={handleChange} required />
                    <Input label="Data de Nascimento" id="studentBirthDate" name="studentBirthDate" type="date" value={formData.studentBirthDate} onChange={handleChange} required />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Dados do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Nome Completo do Responsável" id="guardianName" name="guardianName" value={formData.guardianName} onChange={handleChange} required />
                    <Input label="CPF do Responsável" id="guardianCpf" name="guardianCpf" value={formData.guardianCpf} onChange={handleChange} required />
                    <Input label="Telefone de Contato" id="guardianPhone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} required />
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informações da Matrícula</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Turma Desejada" id="desiredClass" name="desiredClass" value={formData.desiredClass} onChange={handleChange} required />
                </div>
            </div>
            
             <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
            </div>
        </form>
    );
};

export default EnrollmentForm;