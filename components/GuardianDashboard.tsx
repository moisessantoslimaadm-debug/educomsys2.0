import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Student, Grade, Subject, UserRole } from '../types';
import StatCard from './StatCard';
import { AcademicCapIcon, CheckCircleIcon, CurrencyDollarIcon, UsersIcon } from './icons/Icons';
import UpcomingEvents from './shared/UpcomingEvents';
import GuardianFinancials from './guardian/GuardianFinancials';
import Spinner from './shared/Spinner.tsx';

interface GuardianDashboardProps {
    user: User;
}

type GuardianView = 'overview' | 'financial';

const GuardianDashboard: React.FC<GuardianDashboardProps> = ({ user }) => {
    const [view, setView] = useState<GuardianView>('overview');
    const [student, setStudent] = useState<Student | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user.studentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [studentData, gradesData, subjectsData] = await Promise.all([
                    api.get<Student>(`/students/${user.studentId}`),
                    api.get<Grade[]>(`/grades?student_id=${user.studentId}`),
                    api.get<Subject[]>('/subjects')
                ]);
                setStudent(studentData);
                setGrades(gradesData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Failed to fetch guardian data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.studentId]);

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>;
    if (!student) return <div>Aluno não encontrado.</div>;

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';

    const renderOverview = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Média Geral" value={student.averageGrade.toFixed(1)} icon={<AcademicCapIcon className="w-8 h-8"/>} color="green" />
                <StatCard title="Frequência" value={`${student.attendance}%`} icon={<CheckCircleIcon className="w-8 h-8"/>} color="blue" />
                <StatCard title="Turma" value={student.class} icon={<UsersIcon className="w-8 h-8"/>} color="purple" />
                <StatCard title="Situação Financeira" value={'Em dia'} icon={<CurrencyDollarIcon className="w-8 h-8"/>} color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Boletim de {student.name}</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr><th scope="col" className="px-6 py-3">Disciplina</th><th scope="col" className="px-6 py-3 text-right">Nota Final</th></tr>
                                </thead>
                                <tbody>
                                    {grades.map(grade => (
                                        <tr key={grade.subjectId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"><td className="px-6 py-4 font-medium">{getSubjectName(grade.subjectId)}</td><td className={`px-6 py-4 text-right font-bold ${grade.grade >= 7 ? 'text-green-500' : 'text-red-500'}`}>{grade.grade.toFixed(1)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="space-y-6"><UpcomingEvents /></div>
            </div>
        </>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Painel do Responsável</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Acompanhe a vida escolar de {student.name}.</p>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs"><button onClick={() => setView('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'overview' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Visão Geral</button><button onClick={() => setView('financial')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'financial' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Financeiro</button></nav>
            </div>
            
            {view === 'overview' ? renderOverview() : <GuardianFinancials studentId={student.id!} />}
        </div>
    );
};

export default GuardianDashboard;