import React, { useState } from 'react';
import api from '../../services/api';
import { UploadIcon, CheckCircleIcon, DocumentTextIcon } from '../icons/Icons';

interface FileUploadProps {
    label: string;
    onUploadSuccess: (url: string) => void;
    currentFileUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onUploadSuccess, currentFileUrl }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadComplete(false);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError('');
        try {
            const response = await api.upload(file);
            onUploadSuccess(response.url);
            setUploadComplete(true);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setError("Falha no upload do arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="flex items-center space-x-4">
                <label className="flex-1 w-full flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg tracking-wide border dark:border-gray-600 cursor-pointer hover:bg-primary-50">
                    <UploadIcon className="w-5 h-5 mr-2" />
                    <span className="truncate">{file ? file.name : 'Selecione um arquivo...'}</span>
                    <input type='file' className="hidden" onChange={handleFileChange} />
                </label>
                <button type="button" onClick={handleUpload} disabled={!file || isUploading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-400">
                    {isUploading ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
            {isUploading && (
                 <p className="text-sm text-gray-500 mt-2">Enviando...</p>
            )}
            {uploadComplete && (
                <div className="flex items-center text-green-600 mt-2 text-sm">
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    <span>Upload concluído!</span>
                </div>
            )}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {currentFileUrl && !file && (
                 <div className="mt-2 text-sm">
                    <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                        <DocumentTextIcon className="w-5 h-5 mr-1" />
                        Ver arquivo atual
                    </a>
                </div>
            )}
        </div>
    );
};

export default FileUpload;