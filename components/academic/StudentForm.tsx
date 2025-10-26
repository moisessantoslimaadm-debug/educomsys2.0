import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';
import FileUpload from '../shared/FileUpload';

interface StudentFormProps {
    studentToEdit: Student | null;
    onSave: (student: Student) => void;
    onCancel: () => void;
}

const initialFormState: Omit<Student, 'id' | 'averageGrade' | 'attendance'> = {
    name: '',
    cpf: '',
    birthDate: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    isPCD: false,
    pcdDetails: '',
    medicalReportUrl: '',
    guardians: [],
    class: '',
    status: 'Ativo',
    academicHistory: [],
};

const StudentForm: React.FC<StudentFormProps> = ({ studentToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [cepLoading, setCepLoading] = useState(false);

    useEffect(() => {
        if (studentToEdit) {
            const { id, averageGrade, attendance, ...editableData } = studentToEdit;
            setFormData(editableData);
        } else {
            setFormData(initialFormState);
        }
    }, [studentToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked, ...(!checked && { pcdDetails: '', medicalReportUrl: '' }) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, cep }));

        if (cep.length === 8) {
            setCepLoading(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if(response.ok) {
                    const data = await response.json();
                    if (!data.erro) {
                        setFormData(prev => ({
                            ...prev,
                            street: data.logouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf,
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch CEP", error);
            } finally {
                setCepLoading(false);
            }
        }
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.cpf || !formData.birthDate) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }
        onSave({
            ...formData,
            id: studentToEdit?.id || '',
            averageGrade: studentToEdit?.averageGrade || 0,
            attendance: studentToEdit?.attendance || 0,
            academicHistory: studentToEdit?.academicHistory || [],
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome Completo" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="CPF" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
                <Input label="Data de Nascimento" id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
                <Input label="Turma" id="class" name="class" value={formData.class} onChange={handleChange} />
                
                <div className="md:col-span-2">
                    <hr className="my-4 dark:border-gray-600"/>
                    <h3 className="text-md font-semibold mb-2">Endereço</h3>
                </div>

                <Input label="CEP" id="cep" name="cep" value={formData.cep} onChange={handleCepChange} disabled={cepLoading} />
                <Input label="Rua" id="street" name="street" value={formData.street} onChange={handleChange} />
                <Input label="Número" id="number" name="number" value={formData.number} onChange={handleChange} />
                <Input label="Bairro" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
                <Input label="Cidade" id="city" name="city" value={formData.city} onChange={handleChange} />
                <Input label="Estado" id="state" name="state" value={formData.state} onChange={handleChange} />
                 
                <div className="md:col-span-2">
                    <hr className="my-4 dark:border-gray-600"/>
                    <h3 className="text-md font-semibold mb-2">Informações Adicionais</h3>
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                    <input type="checkbox" id="isPCD" name="isPCD" checked={formData.isPCD} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 cursor-pointer" />
                    <label htmlFor="isPCD">Aluno com Deficiência (PCD)</label>
                </div>

                {formData.isPCD && (
                    <>
                        <div className="md:col-span-2">
                            <textarea
                                id="pcdDetails"
                                name="pcdDetails"
                                value={formData.pcdDetails || ''}
                                onChange={handleChange}
                                placeholder="Descreva a deficiência e necessidades especiais..."
                                className="w-full mt-1 h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                           <FileUpload
                             label="Laudo Médico"
                             onUploadSuccess={(url) => setFormData(prev => ({...prev, medicalReportUrl: url}))}
                             currentFileUrl={formData.medicalReportUrl}
                           />
                        </div>
                    </>
                )}
            </div>
             <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default StudentForm;