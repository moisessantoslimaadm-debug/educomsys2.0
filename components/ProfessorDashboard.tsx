import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import api from '../services/api';
import { Class, Student, LessonPlan, PerformanceData, User } from '../types';
import { AcademicCapIcon, ChartBarIcon, UsersIcon, CheckCircleIcon } from './icons/Icons';
import Spinner from './shared/Spinner.tsx';
import PerformanceChart from './PerformanceChart';
import UpcomingEvents from './shared/UpcomingEvents.tsx';

interface ProfessorDashboardProps {
    user: User;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming an endpoint to get classes for a specific teacher
                const [classesData, studentsData, lessonPlansData] = await Promise.all([
                    api.get<Class[]>(`/classes?teacherId=${'teacher-01'}`), // Mocked for now
                    api.get<Student[]>('/students'),
                    api.get<LessonPlan[]>('/lessonPlans'),
                ]);
                setClasses(classesData);
                setStudents(studentsData);
                setLessonPlans(lessonPlansData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const stats = useMemo(() => {
        const myStudentIds = new Set(classes.flatMap(c => c.studentIds));
        const myStudents = students.filter(s => myStudentIds.has(s.id!));
        
        const averageGrade = myStudents.length > 0 
            ? myStudents.reduce((sum, s) => sum + s.averageGrade, 0) / myStudents.length
            : 0;
            
        return {
            myStudents: myStudentIds.size,
            myClasses: classes.length,
            averageGrade: averageGrade.toFixed(1),
            lessonPlans: lessonPlans.length,
        };
    }, [classes, students, lessonPlans]);
    
    const academicPerformanceData: PerformanceData[] = [
        { month: 'Fev', averageGrade: 7.2 }, { month: 'Mar', averageGrade: 7.5 },
        { month: 'Abr', averageGrade: 7.8 }, { month: 'Mai', averageGrade: 8.1 },
        { month: 'Jun', averageGrade: 8.5 }, { month: 'Jul', averageGrade: 8.2 },
    ];


    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>

    return (
    <>
        <h1 className="text-3xl font-bold mb-6">Painel do Professor</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Meus Alunos" value={stats.myStudents} icon={<UsersIcon className="w-8 h-8"/>} color="blue" onClick={() => navigate('/academic')}/>
            <StatCard title="Minhas Turmas" value={stats.myClasses} icon={<ChartBarIcon className="w-8 h-8"/>} color="purple" onClick={() => navigate('/academic')}/>
            <StatCard title="Média de Notas (Turmas)" value={stats.averageGrade} icon={<AcademicCapIcon className="w-8 h-8"/>} color="green" onClick={() => navigate('/academic')}/>
            <StatCard title="Planos de Aula Criados" value={stats.lessonPlans} icon={<CheckCircleIcon className="w-8 h-8"/>} color="yellow" onClick={() => navigate('/pedagogical')}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Desempenho Acadêmico Mensal (Turmas)</h2>
                <PerformanceChart data={academicPerformanceData} />
            </div>
            
            <div className="space-y-6">
                <UpcomingEvents />
            </div>
        </div>
    </>
)};

export default ProfessorDashboard;