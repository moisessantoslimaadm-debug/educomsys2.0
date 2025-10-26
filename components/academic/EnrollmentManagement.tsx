import React, { useState, useEffect } from 'react';
import api, { createNotification } from '../../services/api';
import { Enrollment, Student, User, UserRole } from '../../types';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner';
import EnrollmentTable from './EnrollmentTable';
import EnrollmentModal from './EnrollmentModal';

const EnrollmentManagement: React.FC = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollmentsData, usersData] = await Promise.all([
                    api.get<Enrollment[]>('/enrollments'),
                    api.get<User[]>('/users'),
                ]);
                setEnrollments(enrollmentsData);
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch enrollment data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdateStatus = async (id: string, status: 'Aprovada' | 'Rejeitada') => {
        const enrollment = enrollments.find(e => e.id === id);
        if (enrollment) {
            const updatedEnrollment = await api.put<Enrollment>(`/enrollments/${id}`, { status });
            setEnrollments(prev => prev.map(e => e.id === id ? updatedEnrollment : e));

            // This is a simplified notification system. A real system would need a robust way to link guardians to enrollments.
            const guardianUser = users.find(u => u.role === UserRole.Responsavel && u.name === enrollment.guardianName);
            if(guardianUser){
                 await createNotification(
                    guardianUser.id,
                    `Matrícula ${status}`,
                    `A solicitação de matrícula para ${enrollment.studentName} foi ${status.toLowerCase()}.`
                );
            }
        }
    };

    const handleApprove = async (enrollment: Enrollment) => {
        // In a real application, this would trigger a workflow to create a new student record
        // from the enrollment data. For now, we just update the status.
        if (enrollment.id) {
             await api.post<Student>('/students', {
                name: enrollment.studentName,
                cpf: enrollment.studentCpf,
                birthDate: enrollment.studentBirthDate,
                class: enrollment.desiredClass,
                status: 'Ativo',
                averageGrade: 0,
                attendance: 100,
                // other fields would be collected in a more detailed form
            } as Omit<Student, 'id'>);
            handleUpdateStatus(enrollment.id, 'Aprovada');
        }
    };

    const handleReject = (id: string) => {
        handleUpdateStatus(id, 'Rejeitada');
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Matrículas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Aprove ou rejeite as solicitações de matrícula pendentes.</p>
                </div>
                 <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Nova Solicitação</span>
                </Button>
            </div>

            <EnrollmentTable
                enrollments={enrollments}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {isModalOpen && (
                <EnrollmentModal 
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default EnrollmentManagement;