import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Material, Class, Subject, User } from '../../types';
import Spinner from '../shared/Spinner.tsx';
import { UploadIcon, DownloadIcon, TrashIcon } from '../icons/Icons';
import Select from '../shared/Select';

interface MaterialsManagementProps {
    user: User;
}

const MaterialsManagement: React.FC<MaterialsManagementProps> = ({ user }) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [materialsData, classesData, subjectsData] = await Promise.all([
                    api.get<Material[]>('/materials'),
                    api.get<Class[]>('/classes'),
                    api.get<Subject[]>('/subjects'),
                ]);
                setMaterials(materialsData.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
                setClasses(classesData);
                setSubjects(subjectsData);
            } catch (error) {
                console.error("Failed to fetch materials data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getClassName = (id: string) => classes.find(c => c.id === id)?.name || 'N/A';
    const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'N/A';
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
    };
    
    const handleUpload = async () => {
        if (!selectedFile || !selectedClassId || !selectedSubjectId || !user) {
            alert("Por favor, selecione um arquivo, turma e disciplina.");
            return;
        }
        setUploading(true);
        try {
            const uploadResult = await api.upload(selectedFile);

            const newMaterialData = {
                fileName: selectedFile.name,
                fileUrl: uploadResult.url,
                classId: selectedClassId,
                subjectId: selectedSubjectId,
                uploadDate: new Date().toISOString(),
                uploaderId: user.id,
            };

            const newMaterial = await api.post<Material>('/materials', newMaterialData);
            setMaterials(prev => [newMaterial, ...prev]);
            
            setSelectedFile(null);
            setSelectedClassId('');
            setSelectedSubjectId('');
        } catch (error) {
            console.error("Error uploading material:", error);
            alert("Falha no upload do material.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (material: Material) => {
        if (!window.confirm(`Tem certeza que deseja excluir "${material.fileName}"?`)) return;
        try {
            // Note: Deleting the file from storage would require a specific backend endpoint
            // which is not covered by the generic api.delete. We'll just delete the record.
            await api.delete(`/materials/${material.id}`);
            setMaterials(prev => prev.filter(m => m.id !== material.id));
        } catch(error) {
            console.error("Error deleting material:", error);
            alert("Falha ao excluir o material.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Materiais Pedagógicos</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 space-y-4">
                <h3 className="font-semibold">Enviar Novo Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select id="class-select" label="Turma" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}><option value="">Selecione</option>{classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                    <Select id="subject-select" label="Disciplina" value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}><option value="">Selecione</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select>
                </div>
                 <div className="flex items-center space-x-4">
                    <label className="flex-1 w-full flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg tracking-wide border dark:border-gray-600 cursor-pointer hover:bg-primary-50">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        <span className="truncate">{selectedFile ? selectedFile.name : 'Selecione um arquivo...'}</span>
                        <input type='file' className="hidden" onChange={handleFileChange} />
                    </label>
                    <button onClick={handleUpload} disabled={!selectedFile || uploading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-400">
                        {uploading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>

             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Arquivo</th>
                                <th className="px-6 py-3">Turma</th>
                                <th className="px-6 py-3">Disciplina</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((item) => (
                                <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium">{item.fileName}</td>
                                    <td className="px-6 py-4">{getClassName(item.classId)}</td>
                                    <td className="px-6 py-4">{getSubjectName(item.subjectId)}</td>
                                    <td className="px-6 py-4">{new Date(item.uploadDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full inline-block"><DownloadIcon className="w-4 h-4" /></a>
                                        <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>
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

export default MaterialsManagement;