import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, AcademicCapIcon } from './icons/Icons';

const QuickActions: React.FC = () => {
    const navigate = useNavigate();
    
    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
                <button 
                    onClick={() => handleNavigate('/academic')}
                    className="w-full flex items-center space-x-3 text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/40 transition-colors group"
                >
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-300">
                       <PlusIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-200">Cadastrar Aluno</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Adicionar um novo estudante</p>
                    </div>
                </button>
                 <button 
                    onClick={() => handleNavigate('/academic')}
                    className="w-full flex items-center space-x-3 text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors group">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-300">
                       <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-200">Lançar Notas</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Registrar notas e frequência</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;