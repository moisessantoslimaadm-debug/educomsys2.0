import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Student, Class, Grade, Subject } from '../../types';
import Select from '../shared/Select';
import Spinner from '../shared/Spinner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformanceAnalytics: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, classesData, gradesData, subjectsData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<Class[]>('/classes'),
                    api.get<Grade[]>('/grades'),
                    api.get<Subject[]>('/subjects'),
                ]);
                setStudents(studentsData);
                setClasses(classesData);
                if (classesData.length > 0 && !selectedClassId) setSelectedClassId(classesData[0].id!);
                setGrades(gradesData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Failed to fetch performance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedClassId]);

    const studentsInClass = useMemo(() => {
        const classInfo = classes.find(c => c.id === selectedClassId);
        if (!classInfo) return [];
        return students.filter(s => classInfo.studentIds.includes(s.id!));
    }, [selectedClassId, classes, students]);

    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId);
    }, [selectedStudentId, students]);

    useEffect(() => {
        setSelectedStudentId('');
    }, [selectedClassId]);

    const classPerformanceData = useMemo(() => {
        return studentsInClass.map(s => ({
            name: s.name.split(' ')[0], // Short name for chart
            Média: s.averageGrade,
        }));
    }, [studentsInClass]);
    
    const studentGradesData = useMemo(() => {
        if (!selectedStudent) return [];
        const studentGrades = grades.filter(g => g.studentId === selectedStudent.id);
        return studentGrades.map(g => ({
            name: subjects.find(s => s.id === g.subjectId)?.name || 'N/A',
            Nota: g.grade,
        }));
    }, [selectedStudent, grades, subjects]);

    const studentHistoryData = useMemo(() => {
        if (!selectedStudent || !selectedStudent.academicHistory) return [];
        const currentYearData = {
            year: new Date().getFullYear(),
            'Média Anual': selectedStudent.averageGrade,
        };
        const history = selectedStudent.academicHistory.map(h => {
             const yearGrades = h.grades;
             const avg = yearGrades.reduce((sum, g) => sum + g.finalGrade, 0) / (yearGrades.length || 1);
             return {
                 year: h.year,
                'Média Anual': parseFloat(avg.toFixed(1)),
             };
        });
        return [...history, currentYearData].sort((a,b) => a.year - b.year);
    }, [selectedStudent]);


    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Análise de Desempenho</h2>
                <p className="text-gray-500 dark:text-gray-400">Gráficos de desempenho por turma e por aluno.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Desempenho da Turma</h3>
                <div className="max-w-md mb-6">
                    <Select id="class-selector" label="Selecione a Turma" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                        {classes.map(c => <option key={c.id} value={c.id!}>{c.name}</option>)}
                    </Select>
                </div>
                {studentsInClass.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={classPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Média" fill="#0066FF" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <p className="text-center text-gray-500">Nenhum aluno nesta turma.</p>}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Desempenho Individual do Aluno</h3>
                 <div className="max-w-md mb-6">
                    <Select 
                        id="student-selector" 
                        label="Selecione o Aluno" 
                        value={selectedStudentId} 
                        onChange={e => setSelectedStudentId(e.target.value)}
                        disabled={studentsInClass.length === 0}
                    >
                        <option value="">Selecione um aluno</option>
                        {studentsInClass.map(s => <option key={s.id} value={s.id!}>{s.name}</option>)}
                    </Select>
                </div>

                {selectedStudent ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h4 className="font-semibold text-center mb-2">Notas por Disciplina ({new Date().getFullYear()})</h4>
                             <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={studentGradesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 10]}/>
                                    <Tooltip />
                                    <Bar dataKey="Nota" fill="#22C55E" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div>
                            <h4 className="font-semibold text-center mb-2">Histórico de Médias Anuais</h4>
                             <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={studentHistoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis domain={[0, 10]}/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Média Anual" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">Selecione uma turma e um aluno para ver os detalhes de desempenho.</p>
                )}
            </div>
        </div>
    );
};

export default PerformanceAnalytics;