import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from './StatCard';
import PerformanceChart from './PerformanceChart';
import { Student, Employee, Transaction, PerformanceData } from '../types';
import { AcademicCapIcon, UsersIcon, CheckCircleIcon, CashIcon, BanIcon } from './icons/Icons';
import Spinner from './shared/Spinner.tsx';
import UpcomingEvents from './shared/UpcomingEvents.tsx';

const DirectorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, employeesData, transactionsData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<Employee[]>('/employees'),
                    api.get<Transaction[]>('/transactions'),
                ]);
                setStudents(studentsData);
                setEmployees(employeesData);
                setTransactions(transactionsData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const financialSummary = transactions.reduce((acc, curr) => {
            if (curr.type === 'Receita') acc.revenue += curr.amount;
            if (curr.type === 'Despesa') acc.expense += curr.amount; // amount is already negative for expenses
            return acc;
        }, { revenue: 0, expense: 0 });

        const dropoutCount = students.filter(s => s.status === 'Evadido').length;
        const activeStudents = students.filter(s => s.status === 'Ativo');
        const dropoutRate = students.length > 0 ? ((dropoutCount / students.length) * 100).toFixed(1) : '0.0';
        
        const averageGrade = activeStudents.length > 0 
            ? (activeStudents.reduce((sum, s) => sum + s.averageGrade, 0) / activeStudents.length).toFixed(1)
            : '0.0';
        
        return {
            totalStudents: students.length,
            averageGrade,
            activeEmployees: employees.length,
            financialBalance: (financialSummary.revenue + financialSummary.expense),
            dropoutRate,
        };
    }, [students, employees, transactions]);
    
    const academicPerformanceData: PerformanceData[] = [
        { month: 'Fev', averageGrade: 7.2 }, { month: 'Mar', averageGrade: 7.5 },
        { month: 'Abr', averageGrade: 7.8 }, { month: 'Mai', averageGrade: 8.1 },
        { month: 'Jun', averageGrade: 8.5 }, { month: 'Jul', averageGrade: 8.2 },
    ];

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>

    return (
    <>
        <h1 className="text-3xl font-bold mb-6">Painel da Direção</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <StatCard title="Total de Alunos" value={stats.totalStudents} icon={<UsersIcon className="w-8 h-8"/>} color="blue" onClick={() => navigate('/academic')}/>
            <StatCard title="Média Geral" value={stats.averageGrade} icon={<AcademicCapIcon className="w-8 h-8"/>} color="green" onClick={() => navigate('/academic')}/>
            <StatCard title="Funcionários Ativos" value={stats.activeEmployees} icon={<CheckCircleIcon className="w-8 h-8"/>} color="yellow" onClick={() => navigate('/administrative')}/>
            <StatCard title="Balanço Financeiro" value={`R$ ${stats.financialBalance.toLocaleString('pt-BR')}`} icon={<CashIcon className="w-8 h-8"/>} color="purple" onClick={() => navigate('/administrative')}/>
            <StatCard title="Evasão Escolar" value={`${stats.dropoutRate}%`} icon={<BanIcon className="w-8 h-8"/>} color="purple" onClick={() => navigate('/academic')}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Desempenho Geral da Escola</h2>
                <PerformanceChart data={academicPerformanceData} />
            </div>
            
            <div className="space-y-6">
                <UpcomingEvents />
            </div>
        </div>
    </>
);
}

export default DirectorDashboard;