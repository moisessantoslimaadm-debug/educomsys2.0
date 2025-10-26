import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Student, Subject } from '../../types';
import Select from '../shared/Select';
import { PrinterIcon } from '../icons/Icons';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner.tsx';

const HistoryManagement: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState('');

     useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, subjectsData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<Subject[]>('/subjects'),
                ]);
                setStudents(studentsData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Failed to fetch history data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId);
    }, [selectedStudentId, students]);

    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';

    const handlePrint = () => {
        window.print();
    };
    
    if(loading) return <Spinner />;

    return (
        <div>
             <div className="flex justify-between items-center mb-6 no-print">
                <div>
                    <h2 className="text-2xl font-bold">Histórico Escolar do Aluno</h2>
                    <p className="text-gray-500 dark:text-gray-400">Consulte o histórico completo de notas e frequência.</p>
                </div>
                 {selectedStudent && (
                    <Button onClick={handlePrint}>
                        <PrinterIcon className="w-5 h-5 mr-2" />
                        Imprimir / Gerar PDF
                    </Button>
                )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 printable-area">
                <div className="max-w-md mb-6 no-print">
                    <Select
                        id="student-selector"
                        label="Selecione o Aluno"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="" disabled>Selecione um aluno</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </Select>
                </div>

                {selectedStudent ? (
                    <div>
                        <div className="text-center border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Histórico Escolar</h1>
                            <p className="text-lg font-semibold">{selectedStudent.name}</p>
                            <p className="text-sm text-gray-500">CPF: {selectedStudent.cpf} | Data de Nasc.: {new Date(selectedStudent.birthDate).toLocaleDateString()}</p>
                        </div>
                        
                        {selectedStudent.academicHistory.map(yearData => (
                             <div key={yearData.year} className="mb-6">
                                <h3 className="text-lg font-semibold bg-gray-100 dark:bg-gray-700 p-2 rounded-md">Ano Letivo: {yearData.year} - Turma: {yearData.class}</h3>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                     <p><strong>Frequência Anual:</strong> {yearData.attendance}%</p>
                                </div>
                                <table className="w-full mt-2 text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-2">Disciplina</th>
                                            <th className="px-4 py-2 text-right">Nota Final</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {yearData.grades.map(grade => (
                                            <tr key={grade.subjectId} className="border-b dark:border-gray-700">
                                                <td className="px-4 py-2">{getSubjectName(grade.subjectId)}</td>
                                                <td className="px-4 py-2 text-right font-bold">{grade.finalGrade.toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                         {selectedStudent.academicHistory.length === 0 && (
                            <p className="text-center text-gray-500 py-4">Nenhum histórico anterior registrado para este aluno.</p>
                        )}
                    </div>
                ) : (
                     <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">Por favor, selecione um aluno para ver seu histórico.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryManagement;