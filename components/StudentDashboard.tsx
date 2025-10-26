import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Student, Grade, Subject, Schedule } from '../types';
import StatCard from './StatCard';
import { AcademicCapIcon, CheckCircleIcon, CalendarIcon, UsersIcon } from './icons/Icons';
import UpcomingEvents from './shared/UpcomingEvents';
import Spinner from './shared/Spinner.tsx';

interface StudentDashboardProps {
    user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user.studentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const studentData = await api.get<Student>(`/students/${user.studentId}`);
                setStudent(studentData);

                // Once we have student data, fetch related info
                const [gradesData, subjectsData, scheduleData] = await Promise.all([
                    api.get<Grade[]>(`/grades?student_id=${user.studentId}`),
                    api.get<Subject[]>('/subjects'),
                    api.get<Schedule[]>(`/schedules?class_id=${studentData.class}`) // Assuming class is stored by name/id
                ]);
                
                setGrades(gradesData);
                setSubjects(subjectsData);
                setSchedule(scheduleData);

            } catch (error) {
                console.error("Failed to fetch student data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.studentId]);

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>
    if (!student) return <div>Aluno não encontrado.</div>;

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';
    const daysOfWeek: ('Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta')[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Olá, {student.name}!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Bem-vindo(a) ao seu painel.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Média Geral" value={student.averageGrade.toFixed(1)} icon={<AcademicCapIcon className="w-8 h-8"/>} color="green" />
                <StatCard title="Frequência" value={`${student.attendance}%`} icon={<CheckCircleIcon className="w-8 h-8"/>} color="blue" />
                <StatCard title="Sua Turma" value={student.class} icon={<UsersIcon className="w-8 h-8"/>} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Meu Boletim</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th scope="col" className="px-6 py-3">Disciplina</th><th scope="col" className="px-6 py-3 text-right">Nota Final</th></tr></thead>
                                <tbody>
                                    {grades.map(grade => (
                                        <tr key={grade.subjectId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700"><td className="px-6 py-4 font-medium">{getSubjectName(grade.subjectId)}</td><td className={`px-6 py-4 text-right font-bold ${grade.grade >= 7 ? 'text-green-500' : 'text-red-500'}`}>{grade.grade.toFixed(1)}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><CalendarIcon className="w-6 h-6 mr-2" /> Meus Horários</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th className="px-2 py-3">Horário</th>{daysOfWeek.map(day => <th key={day} className="px-2 py-3">{day}</th>)}</tr></thead>
                                <tbody>
                                     {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00'].map(time => (
                                         <tr key={time} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-2 py-4 font-mono text-xs">{time}</td>
                                            {daysOfWeek.map(day => {
                                                const scheduleItem = schedule.find(s => s.day === day && s.time === time);
                                                return <td key={day} className="px-2 py-4 text-xs font-medium">{scheduleItem ? getSubjectName(scheduleItem.subjectId) : '-'}</td>;
                                            })}
                                         </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <UpcomingEvents />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;