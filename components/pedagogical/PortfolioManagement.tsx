import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { PlusIcon, UploadIcon, DownloadIcon } from '../icons/Icons';
import { PortfolioItem, Student, User } from '../../types';
import Spinner from '../shared/Spinner.tsx';

interface PortfolioManagementProps {
    user: User;
}

const PortfolioManagement: React.FC<PortfolioManagementProps> = ({ user }) => {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [portfolioData, studentsData] = await Promise.all([
                    api.get<PortfolioItem[]>('/portfolio'),
                    api.get<Student[]>('/students'),
                ]);
                setItems(portfolioData.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
                setStudents(studentsData);
            } catch (error) {
                console.error("Failed to fetch portfolio data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'Desconhecido';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const handleUpload = async () => {
        if (selectedFile && user) {
            setUploading(true);
            try {
                const uploadResponse = await api.upload(selectedFile);

                const newItemData = {
                    fileName: selectedFile.name,
                    fileUrl: uploadResponse.url,
                    studentId: 'stu-01', // Mocked student for now, should be dynamic
                    subject: 'Português', // Mocked, should be dynamic
                    uploadDate: new Date().toISOString(),
                };
                
                const newItem = await api.post<PortfolioItem>('/portfolio', newItemData);
                setItems(prev => [newItem, ...prev]);
                setSelectedFile(null);

            } catch (error) {
                console.error("Error uploading file:", error);
                alert("Falha no upload do arquivo.");
            } finally {
                setUploading(false);
            }
        } else {
            alert("Por favor, selecione um arquivo para enviar.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Portfólio de Atividades</h2>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie e visualize os trabalhos enviados pelos alunos.</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="font-semibold mb-2">Enviar Novo Arquivo</h3>
                 <div className="flex items-center space-x-4">
                    <label className="flex-1 w-full flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg tracking-wide border dark:border-gray-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/40 hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        <span className="truncate">{selectedFile ? selectedFile.name : 'Selecione um arquivo...'}</span>
                        <input type='file' className="hidden" onChange={handleFileChange} />
                    </label>
                    <button onClick={handleUpload} disabled={!selectedFile || uploading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed">
                        {uploading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome do Arquivo</th>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Disciplina</th>
                                <th scope="col" className="px-6 py-3">Data de Envio</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.fileName}</th>
                                    <td className="px-6 py-4">{getStudentName(item.studentId)}</td>
                                    <td className="px-6 py-4">{item.subject}</td>
                                    <td className="px-6 py-4">{new Date(item.uploadDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                         <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors inline-block">
                                            <DownloadIcon className="w-4 h-4" />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioManagement;