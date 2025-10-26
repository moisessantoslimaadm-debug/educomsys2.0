import React, { useState, useEffect, useMemo } from 'react';
import api, { logActivity } from '../../services/api';
import { User, Student, MedicalRecord, UserRole } from '../../types';
import Spinner from '../shared/Spinner';
import Select from '../shared/Select';
import MedicalRecordModal from './MedicalRecordModal';
import Button from '../shared/Button';
import { PencilIcon } from '../icons/Icons';

interface MedicalRecordManagementProps {
    user: User;
}

const MedicalRecordManagement: React.FC<MedicalRecordManagementProps> = ({ user }) => {
    const [record, setRecord] = useState<MedicalRecord | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canManage = user.role === UserRole.Direcao || user.role === UserRole.Secretaria;

    useEffect(() => {
        if (canManage) {
            api.get<Student[]>('/students').then(setStudents);
        } else if (user.studentId) {
            setSelectedStudentId(user.studentId);
        }
    }, [canManage, user.studentId]);

    useEffect(() => {
        if (!selectedStudentId) {
            setRecord(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        api.get<MedicalRecord>(`/medicalRecords/${selectedStudentId}`)
            .then(data => {
                setRecord(data);
            })
            .catch(error => {
                console.error("No medical record found for student, which may be normal.", error);
                setRecord(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedStudentId]);
    
    const handleSave = async (data: MedicalRecord) => {
        if (!selectedStudentId) return;
        try {
            const savedRecord = await api.post<MedicalRecord>(`/medicalRecords/${selectedStudentId}`, data);
            setRecord(savedRecord);
            await logActivity('Atualização de Ficha Médica', { studentId: selectedStudentId });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save medical record:", error);
            alert("Falha ao salvar ficha médica.");
        }
    };

    const selectedStudentName = useMemo(() => students.find(s => s.id === selectedStudentId)?.name || user.name, [selectedStudentId, students, user.name]);

    if (loading && !record) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Ficha Médica dos Alunos</h2>
                    <p className="text-gray-500 dark:text-gray-400">Consulte e gerencie as informações de saúde.</p>
                </div>
            </div>

            {canManage && (
                <div className="max-w-md mb-6">
                    <Select
                        id="student-selector"
                        label="Selecione o Aluno"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="" disabled>Selecione um aluno</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </Select>
                </div>
            )}

            {selectedStudentId ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Ficha de {selectedStudentName}</h3>
                        {canManage && (
                            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                                <PencilIcon className="w-4 h-4 mr-2"/>
                                Editar
                            </Button>
                        )}
                    </div>
                    {record ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong className="block text-gray-500">Tipo Sanguíneo:</strong> <span className="font-medium">{record.bloodType}</span></div>
                            <div><strong className="block text-gray-500">Contato de Emergência:</strong> <span className="font-medium">{record.emergencyContactName} ({record.emergencyContactPhone})</span></div>
                            <div className="md:col-span-2"><strong className="block text-gray-500">Alergias:</strong> <p className="font-medium whitespace-pre-wrap">{record.allergies || 'Nenhuma informada'}</p></div>
                            <div className="md:col-span-2"><strong className="block text-gray-500">Condições Crônicas:</strong> <p className="font-medium whitespace-pre-wrap">{record.chronicConditions || 'Nenhuma informada'}</p></div>
                        </div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">Nenhuma ficha médica encontrada para este aluno.</p>
                    )}
                </div>
            ) : (
                 <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                        {canManage ? 'Selecione um aluno para visualizar a ficha médica.' : 'Não foi possível carregar os dados de saúde.'}
                    </p>
                </div>
            )}

            {isModalOpen && (
                <MedicalRecordModal 
                    record={record}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default MedicalRecordManagement;