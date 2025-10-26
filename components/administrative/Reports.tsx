import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Student, Class } from '../../types';
import { exportToCSV } from '../../utils/export';
import Button from '../shared/Button';
import { DocumentReportIcon, DownloadIcon } from '../icons/Icons';
import Spinner from '../shared/Spinner.tsx';

const Reports: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, classesData] = await Promise.all([
                    api.get<Student[]>('/students'),
                    api.get<Class[]>('/classes'),
                ]);
                setStudents(studentsData);
                setClasses(classesData);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExportStudentsByClass = () => {
        const dataToExport = students.map(student => ({
            'ID do Aluno': student.id,
            'Nome do Aluno': student.name,
            'CPF': student.cpf,
            'Data de Nascimento': student.birthDate,
            'Turma': student.class || 'Não alocado',
            'Média': student.averageGrade,
            'Frequência (%)': student.attendance,
        }));
        exportToCSV(dataToExport, 'alunos_por_turma');
    };
    
    const handleExportAllClasses = () => {
        const dataToExport = classes.map(c => ({
            'ID da Turma': c.id,
            'Nome da Turma': c.name,
            'Nº de Alunos': c.studentIds.length,
        }));
         exportToCSV(dataToExport, 'lista_de_turmas');
    }

    if (loading) return <Spinner />;

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
             <h2 className="text-2xl font-bold mb-1">Relatórios Administrativos</h2>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Gere e exporte relatórios consolidados da instituição.</p>
            
            <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold flex items-center"><DocumentReportIcon className="w-5 h-5 mr-2" /> Relação de Alunos</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Exporta a lista completa de alunos com suas respectivas turmas e dados acadêmicos.</p>
                    </div>
                    <Button onClick={handleExportStudentsByClass} variant="secondary">
                       <DownloadIcon className="w-4 h-4 mr-2" /> Exportar CSV
                    </Button>
                </div>

                 <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold flex items-center"><DocumentReportIcon className="w-5 h-5 mr-2" /> Relação de Turmas</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Exporta a lista de todas as turmas cadastradas e o número de alunos em cada uma.</p>
                    </div>
                    <Button onClick={handleExportAllClasses} variant="secondary">
                       <DownloadIcon className="w-4 h-4 mr-2" /> Exportar CSV
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Reports;