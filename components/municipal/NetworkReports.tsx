import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { School, Student } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../StatCard';
import { OfficeBuildingIcon, UsersIcon, AcademicCapIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner';

const NetworkReports: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schoolsData, studentsData] = await Promise.all([
                    api.get<School[]>('/schools'),
                    api.get<Student[]>('/students'),
                ]);
                setSchools(schoolsData);
                setStudents(studentsData);
            } catch (error) {
                console.error("Failed to fetch network reports data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const networkStats = useMemo(() => {
        const totalStudents = students.length;
        const totalGradeSum = students.reduce((acc, student) => acc + student.averageGrade, 0);
        const networkAverageGrade = totalStudents > 0 ? (totalGradeSum / totalStudents).toFixed(1) : 'N/A';

        const studentsByCity = schools.reduce((acc, school) => {
            acc[school.city] = (acc[school.city] || 0) + school.studentCount;
            return acc;
        }, {} as { [key: string]: number });
        
        const studentsByCityData = Object.keys(studentsByCity).map(city => ({
            name: city,
            Alunos: studentsByCity[city]
        }));
        
        const performanceBySchoolData = schools.map(school => ({
            name: school.name.split(' ').slice(0, 2).join(' '), // Shorten name for chart
            Média: school.averageGrade
        }));

        return {
            totalSchools: schools.length,
            totalStudents,
            networkAverageGrade,
            studentsByCityData,
            performanceBySchoolData,
        };
    }, [schools, students]);

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Relatórios da Rede Municipal</h2>
                    <p className="text-gray-500 dark:text-gray-400">Análise consolidada do desempenho das escolas.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total de Escolas" value={networkStats.totalSchools} icon={<OfficeBuildingIcon className="w-8 h-8"/>} color="blue" />
                <StatCard title="Total de Alunos" value={networkStats.totalStudents} icon={<UsersIcon className="w-8 h-8"/>} color="purple" />
                <StatCard title="Média Geral da Rede" value={networkStats.networkAverageGrade} icon={<AcademicCapIcon className="w-8 h-8"/>} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold mb-4">Alunos por Cidade</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={networkStats.studentsByCityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Alunos" fill="#0052CC" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold mb-4">Média de Desempenho por Escola</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={networkStats.performanceBySchoolData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Média" fill="#22C55E" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default NetworkReports;