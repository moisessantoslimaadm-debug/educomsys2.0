import React, { useState, useEffect, useMemo } from 'react';
import StatCard from './StatCard';
import api from '../services/api';
import { School } from '../types';
import { AcademicCapIcon, UsersIcon, OfficeBuildingIcon } from './icons/Icons';
import Spinner from './shared/Spinner.tsx';

const MunicipalDashboard: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schoolsData = await api.get<School[]>('/schools');
                setSchools(schoolsData);
            } catch (error) {
                console.error("Failed to fetch schools:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchools();
    }, []);
    
    const networkStats = useMemo(() => {
        return schools.reduce((acc, school) => {
            acc.totalStudents += school.studentCount;
            acc.totalGradeSum += school.averageGrade * school.studentCount;
            return acc;
        }, { totalStudents: 0, totalGradeSum: 0 });
    }, [schools]);

    const networkAverageGrade = networkStats.totalStudents > 0 
        ? (networkStats.totalGradeSum / networkStats.totalStudents).toFixed(1)
        : 'N/A';
    
    if(loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner /></div>;
    
    return (
    <>
        <h1 className="text-3xl font-bold mb-6">Painel da Secretaria Municipal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                title="Total de Escolas" 
                value={schools.length} 
                icon={<OfficeBuildingIcon className="w-8 h-8"/>} 
                color="blue" 
            />
            <StatCard 
                title="Total de Alunos na Rede" 
                value={networkStats.totalStudents.toLocaleString('pt-BR')} 
                icon={<UsersIcon className="w-8 h-8"/>} 
                color="purple"
            />
            <StatCard 
                title="Média de Desempenho da Rede" 
                value={networkAverageGrade}
                icon={<AcademicCapIcon className="w-8 h-8"/>} 
                color="green"
            />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
             <h2 className="text-2xl font-bold mb-1">Gerenciamento de Escolas</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Visualize os dados consolidados das escolas da rede municipal.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome da Escola</th>
                            <th scope="col" className="px-6 py-3">Cidade</th>
                            <th scope="col" className="px-6 py-3">Nº de Alunos</th>
                            <th scope="col" className="px-6 py-3">Média Geral</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schools.map((school) => (
                            <tr key={school.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {school.name}
                                </th>
                                <td className="px-6 py-4">{school.city}</td>
                                <td className="px-6 py-4">{school.studentCount}</td>
                                <td className={`px-6 py-4 font-bold ${school.averageGrade >= 7 ? 'text-green-500' : 'text-red-500'}`}>
                                    {school.averageGrade.toFixed(1)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
);
}

export default MunicipalDashboard;