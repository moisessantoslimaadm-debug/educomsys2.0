

import React from 'react';
import { UsersIcon, ChartBarIcon, BookOpenIcon, DocumentTextIcon, ClipboardListIcon, CalendarIcon, BanIcon, SwitchHorizontalIcon, DocumentReportIcon, PlusIcon, TrendingUpIcon } from '../icons/Icons';

export type AcademicView = 'alunos' | 'turmas' | 'disciplinas' | 'diario' | 'comportamento' | 'horarios' | 'desempenho' | 'relatorios' | 'transferencias' | 'historico' | 'matriculas';

interface AcademicTabsProps {
    activeTab: AcademicView;
    setActiveTab: (tab: AcademicView) => void;
}

const tabs: { id: AcademicView; name: string; icon: React.ReactNode }[] = [
    { id: 'alunos', name: 'Alunos', icon: <UsersIcon className="w-5 h-5 mr-2" /> },
    { id: 'matriculas', name: 'Matrículas', icon: <PlusIcon className="w-5 h-5 mr-2" /> },
    { id: 'turmas', name: 'Turmas', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
    { id: 'disciplinas', name: 'Disciplinas', icon: <BookOpenIcon className="w-5 h-5 mr-2" /> },
    { id: 'diario', name: 'Diário de Classe', icon: <ClipboardListIcon className="w-5 h-5 mr-2" /> },
    { id: 'comportamento', name: 'Comportamento', icon: <BanIcon className="w-5 h-5 mr-2" /> },
    { id: 'horarios', name: 'Horários', icon: <CalendarIcon className="w-5 h-5 mr-2" /> },
    { id: 'desempenho', name: 'Desempenho', icon: <TrendingUpIcon className="w-5 h-5 mr-2" /> },
    { id: 'relatorios', name: 'Relatórios', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { id: 'transferencias', name: 'Transferências', icon: <SwitchHorizontalIcon className="w-5 h-5 mr-2" /> },
    { id: 'historico', name: 'Histórico', icon: <DocumentReportIcon className="w-5 h-5 mr-2" /> },
];

const AcademicTabs: React.FC<AcademicTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                            transition-colors
                            ${
                                activeTab === tab.id
                                    ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AcademicTabs;