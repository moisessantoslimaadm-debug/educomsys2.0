import React, { useState, useMemo, useEffect } from 'react';
import api, { createNotification } from '../../services/api';
import Select from '../shared/Select';
import { AttendanceRecord, Grade, Class, Student, Subject, User, UserRole } from '../../types';
import Button from '../shared/Button';
import { ExclamationCircleIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner.tsx';

type JournalView = 'attendance' | 'grades';

interface ClassJournalManagementProps {
    user: User;
}

const ClassJournalManagement: React.FC<ClassJournalManagementProps> = ({ user }) => {
    const [view, setView] = useState<JournalView>('attendance');
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [allGrades, setAllGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    
    const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
    const [grades, setGrades] = useState<Map<string, Grade>>(new Map());

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [classesData, studentsData, subjectsData, usersData, gradesData] = await Promise.all([
                    api.get<Class[]>('/classes'),
                    api.get<Student[]>('/students'),
                    api.get<Subject[]>('/subjects'),
                    api.get<User[]>('/users'),
                    api.get<Grade[]>('/grades'),
                ]);

                setClasses(classesData);
                if(classesData.length > 0) setSelectedClassId(classesData[0].id!);
                
                setStudents(studentsData);
                
                setSubjects(subjectsData);
                if(subjectsData.length > 0) setSelectedSubjectId(subjectsData[0].id!);

                setUsers(usersData);
                setAllGrades(gradesData);
            } catch (error) {
                console.error("Failed to fetch class journal data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const studentsInClass = useMemo(() => {
        const classInfo = classes.find(c => c.id === selectedClassId);
        return classInfo ? students.filter(s => classInfo.studentIds.includes(s.id!)) : [];
    }, [selectedClassId, classes, students]);

    const isAttendanceLocked = selectedDate !== new Date().toISOString().split('T')[0];

    const handleAttendanceChange = (studentId: string, status: 'Presente' | 'Falta') => {
        setAttendance(prev => new Map(prev).set(studentId, { studentId, date: selectedDate, status }));
    };
    
    const handleGradeChange = (studentId: string, newGrade: string) => {
        const gradeValue = parseFloat(newGrade);
        const grade = isNaN(gradeValue) ? 0 : gradeValue;
        setGrades(prev => new Map(prev).set(studentId, { studentId, subjectId: selectedSubjectId, grade }));
    }

    const handleSave = async () => {
        try {
            if (view === 'attendance') {
                const promises = Array.from(attendance.values()).map(record => 
                    api.post('/attendance', record) // Assuming a POST endpoint for attendance
                );
                await Promise.all(promises);

            } else { // grades
                 for (const [studentId, newGradeRecord] of grades.entries()) {
                    await api.post('/grades', newGradeRecord); // Assuming a POST endpoint for grades
                    
                    const otherGradesForStudent = allGrades.filter(g => 
                        g.studentId === studentId && g.subjectId !== selectedSubjectId
                    );
                    const allCurrentGradesForStudent = [...otherGradesForStudent, newGradeRecord];
                    
                    const totalPoints = allCurrentGradesForStudent.reduce((sum, g) => sum + g.grade, 0);
                    const newAverage = allCurrentGradesForStudent.length > 0 ? totalPoints / allCurrentGradesForStudent.length : 0;
                    
                    await api.put(`/students/${studentId}`, { averageGrade: newAverage });

                    if (newAverage < 7.0) {
                        const student = students.find(s => s.id === studentId);
                        const subject = subjects.find(s => s.id === selectedSubjectId);
                        const guardianUser = users.find(u => u.role === UserRole.Responsavel && u.studentId === studentId);
                        
                        if(guardianUser && student && subject) {
                            await createNotification(
                                guardianUser.id,
                                `Atenção ao Desempenho de ${student.name}`,
                                `A média geral de ${student.name} está abaixo de 7.0 (${newAverage.toFixed(1)}). A última nota lançada foi ${newGradeRecord.grade.toFixed(1)} em ${subject.name}.`
                            );
                        }
                    }
                }
            }
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error("Error saving data: ", error);
            alert("Falha ao salvar os dados.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
             <h2 className="text-2xl font-bold mb-1">Diário de Classe</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Realize o lançamento de notas e frequência dos alunos.</p>

            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 mb-4">
                <button onClick={() => setView('attendance')} className={`py-2 px-4 text-sm font-medium ${view === 'attendance' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Lançar Frequência</button>
                <button onClick={() => setView('grades')} className={`py-2 px-4 text-sm font-medium ${view === 'grades' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Lançar Notas</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Select id="class" label="Turma" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                {view === 'attendance' && (
                    <Input label="Data" type="date" id="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                )}
                 {view === 'grades' && (
                    <Select id="subject" label="Disciplina" value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                )}
            </div>
            
            {view === 'attendance' && isAttendanceLocked && (
                 <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg"><div className="flex"><div className="flex-shrink-0"><ExclamationCircleIcon className="h-5 w-5 text-yellow-400"/></div><div className="ml-3"><p className="text-sm text-yellow-700 dark:text-yellow-200">O lançamento de frequência só é permitido para o dia atual.</p></div></div></div>
            )}
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Aluno</th>
                            <th className="px-6 py-3 text-center">{view === 'attendance' ? 'Status' : 'Nota'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsInClass.map(student => (
                            <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                <td className="px-6 py-4">
                                    {view === 'attendance' ? (
                                        <div className="flex justify-center space-x-2">
                                            <button disabled={isAttendanceLocked} onClick={() => handleAttendanceChange(student.id!, 'Presente')} className={`px-3 py-1 text-xs rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${attendance.get(student.id!)?.status === 'Presente' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Presente</button>
                                            <button disabled={isAttendanceLocked} onClick={() => handleAttendanceChange(student.id!, 'Falta')} className={`px-3 py-1 text-xs rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${attendance.get(student.id!)?.status === 'Falta' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>Falta</button>
                                        </div>
                                    ) : (
                                        <input type="number" min="0" max="10" step="0.1" value={grades.get(student.id!)?.grade ?? ''} onChange={(e) => handleGradeChange(student.id!, e.target.value)} className="w-24 mx-auto block text-center px-2 py-1 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="flex justify-end mt-6">
                    <Button disabled={(view === 'attendance' && isAttendanceLocked)} onClick={handleSave}>Salvar Alterações</Button>
                </div>
            </div>
        </div>
    );
};

// Dummy Input component to avoid import errors if shared/Input doesn't exist.
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, id, ...props}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" />
    </div>
);


export default ClassJournalManagement;