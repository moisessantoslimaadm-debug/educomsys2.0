import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import Select from '../shared/Select';
import { Student, Class, Grade, Subject, ClassInfo, Teacher } from '../../types';
import Button from '../shared/Button';
import { DownloadIcon, PrinterIcon, DocumentTextIcon } from '../icons/Icons';
import { exportToCSV } from '../../utils/export';
import { generatePdf } from '../../utils/pdfGenerator';
import Spinner from '../shared/Spinner.tsx';

type ReportView = 'individual' | 'pedagogical';

const StudentGradeTable: React.FC<{ student: Student, grades: Grade[], subjects: Subject[] }> = ({ student, grades, subjects }) => {
    const studentGrades = useMemo(() => {
        return grades.filter(g => g.studentId === student.id);
    }, [student, grades]);

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';

    return (
        <div className="mt-4">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Disciplina</th>
                        <th scope="col" className="px-6 py-3 text-right">Nota Final</th>
                    </tr>
                </thead>
                <tbody>
                    {studentGrades.length > 0 ? studentGrades.map((grade) => (
                        <tr key={grade.subjectId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                {getSubjectName(grade.subjectId)}
                            </th>
                            <td className={`px-6 py-4 text-right font-bold ${grade.grade >= 7 ? 'text-green-500' : 'text-red-500'}`}>
                                {grade.grade.toFixed(1)}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4">Nenhuma nota lançada para este aluno.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const IndividualReport: React.FC<{ students: Student[], classes: Class[], grades: Grade[], subjects: Subject[] }> = ({ students, classes, grades, subjects }) => {
    const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

    const availableStudents = useMemo(() => {
        const classInfo = classes.find(c => c.id === selectedClassId);
        if (!classInfo) return [];
        return students.filter(s => classInfo.studentIds.includes(s.id!));
    }, [selectedClassId, classes, students]);

    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId);
    }, [selectedStudentId, students]);
    
    React.useEffect(() => {
        setSelectedStudentId('');
    }, [selectedClassId]);

    const handleGeneratePDF = (reportType: 'boletim' | 'historico' | 'matricula') => {
        if (!selectedStudent) return;

        const studentGrades = grades.filter(g => g.studentId === selectedStudent.id);
        
        generatePdf(reportType, selectedStudent, studentGrades, subjects);
    };


     return (
        <div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select 
                    id="class-selector"
                    label="Selecione a Turma"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                 >
                    {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                 </Select>
                 <Select 
                    id="student-selector"
                    label="Selecione o Aluno"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    disabled={!selectedClassId || availableStudents.length === 0}
                 >
                    <option value="" disabled>
                        {availableStudents.length === 0 ? 'Nenhum aluno na turma' : 'Selecione um aluno'}
                    </option>
                    {availableStudents.map(student => (
                         <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                 </Select>
             </div>
             {selectedStudent ? (
                <div id="report-content" className="mt-8">
                    <h3 className="text-xl font-semibold">Boletim de {selectedStudent.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Turma: {selectedStudent.class}</p>
                    <StudentGradeTable student={selectedStudent} grades={grades} subjects={subjects}/>
                     <div className="mt-6 flex flex-wrap gap-2">
                        <Button onClick={() => handleGeneratePDF('boletim')}><PrinterIcon className="w-4 h-4 mr-2" />Gerar Boletim PDF</Button>
                        <Button onClick={() => handleGeneratePDF('historico')} variant="secondary"><DocumentTextIcon className="w-4 h-4 mr-2" />Gerar Histórico PDF</Button>
                        <Button onClick={() => handleGeneratePDF('matricula')} variant="secondary"><DocumentTextIcon className="w-4 h-4 mr-2" />Declaração de Matrícula</Button>
                    </div>
                </div>
             ) : (
                <div className="text-center py-12 mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Por favor, selecione uma turma e um aluno para ver o boletim.</p>
                </div>
             )}
        </div>
    );
};

const PedagogicalReports: React.FC<{ students: Student[], classes: Class[], teachers: Teacher[] }> = ({ students, classes, teachers }) => {
    const underperformingStudents = useMemo(() => {
        return students.filter(s => s.averageGrade < 7.0);
    }, [students]);

    const classPerformance: ClassInfo[] = useMemo(() => {
        return classes.map(c => {
            const studentsInClass = students.filter(s => c.studentIds.includes(s.id!));
            const totalGrade = studentsInClass.reduce((sum, s) => sum + s.averageGrade, 0);
            const averageGrade = studentsInClass.length > 0 ? totalGrade / studentsInClass.length : 0;
            return {
                id: c.id!,
                name: c.name,
                studentCount: studentsInClass.length,
                averageGrade: parseFloat(averageGrade.toFixed(1)),
            };
        });
    }, [classes, students]);

    const handleExportUnderperforming = () => {
        const data = underperformingStudents.map(s => ({'Nome': s.name, 'Turma': s.class, 'Média': s.averageGrade, 'Status': s.status}));
        exportToCSV(data, 'alunos_baixo_rendimento');
    };
    
    const handleExportClassPerformance = () => {
         const data = classPerformance.map(c => ({'Turma': c.name, 'Nº Alunos': c.studentCount, 'Média': c.averageGrade}));
        exportToCSV(data, 'desempenho_por_turma');
    };

    const handleExportClasses = () => {
        const data = classes.map(c => ({
            'Turma': c.name,
            'Professor': teachers.find(t => t.id === c.teacherId)?.name || 'N/A',
            'Nº de Alunos': c.studentIds.length,
        }));
        exportToCSV(data, 'lista_de_turmas');
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold">Alunos com Baixo Rendimento (Média &lt; 7.0)</h3><Button variant="secondary" onClick={handleExportUnderperforming}><DownloadIcon className="w-4 h-4 mr-2" />Exportar</Button></div>
                <div className="overflow-x-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-2 text-left">Aluno</th><th className="px-4 py-2 text-left">Turma</th><th className="px-4 py-2 text-right">Média</th></tr></thead><tbody>{underperformingStudents.map(s => <tr key={s.id} className="border-t dark:border-gray-600"><td className="px-4 py-2">{s.name}</td><td className="px-4 py-2">{s.class}</td><td className="px-4 py-2 text-right text-red-500 font-bold">{s.averageGrade.toFixed(1)}</td></tr>)}</tbody></table></div>
            </div>
             <div>
                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold">Desempenho Consolidado por Turma</h3><Button variant="secondary" onClick={handleExportClassPerformance}><DownloadIcon className="w-4 h-4 mr-2" />Exportar</Button></div>
                 <div className="overflow-x-auto border rounded-lg"><table className="w-full text-sm"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-4 py-2 text-left">Turma</th><th className="px-4 py-2 text-right">Nº Alunos</th><th className="px-4 py-2 text-right">Média</th></tr></thead><tbody>{classPerformance.map(c => <tr key={c.id} className="border-t dark:border-gray-600"><td className="px-4 py-2">{c.name}</td><td className="px-4 py-2 text-right">{c.studentCount}</td><td className={`px-4 py-2 text-right font-bold ${c.averageGrade >= 7 ? 'text-green-500' : 'text-red-500'}`}>{c.averageGrade}</td></tr>)}</tbody></table></div>
            </div>
             <div>
                <div className="flex justify-between items-center mb-2"><h3 className="font-semibold">Lista de Turmas</h3><Button variant="secondary" onClick={handleExportClasses}><DownloadIcon className="w-4 h-4 mr-2" />Exportar CSV</Button></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Exporta uma lista de todas as turmas, seus professores e número de alunos.</p>
            </div>
        </div>
    );
};


const ReportsManagement: React.FC = () => {
    const [view, setView] = useState<ReportView>('individual');
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, classesData, gradesData, subjectsData, teachersData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<Class[]>('/classes'),
                    api.get<Grade[]>('/grades'),
                    api.get<Subject[]>('/subjects'),
                    api.get<Teacher[]>('/teachers')
                ]);
                setStudents(studentsData);
                setClasses(classesData);
                setGrades(gradesData);
                setSubjects(subjectsData);
                setTeachers(teachersData);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
             <h2 className="text-2xl font-bold mb-1">Relatórios Acadêmicos</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Consulte boletins individuais e relatórios pedagógicos consolidados.</p>
             
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-4">
                <button onClick={() => setView('individual')} className={`py-2 px-4 text-sm font-medium ${view === 'individual' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Boletim Individual</button>
                <button onClick={() => setView('pedagogical')} className={`py-2 px-4 text-sm font-medium ${view === 'pedagogical' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Relatórios Pedagógicos</button>
            </div>
            
            {view === 'individual' ? <IndividualReport students={students} classes={classes} grades={grades} subjects={subjects} /> : <PedagogicalReports students={students} classes={classes} teachers={teachers} />}

        </div>
    );
};

export default ReportsManagement;