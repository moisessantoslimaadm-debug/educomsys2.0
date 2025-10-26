

import React from 'react';
import { UsersIcon, BriefcaseIcon, DocumentReportIcon, EyeIcon, CurrencyDollarIcon } from '../icons/Icons';

export type AdministrativeView = 'funcionarios' | 'financeiro' | 'faturas' | 'relatorios' | 'logs';

interface AdministrativeTabsProps {
    activeTab: AdministrativeView;
    setActiveTab: (tab: AdministrativeView) => void;
}

const tabs: { id: AdministrativeView; name: string; icon: React.ReactNode }[] = [
    { id: 'funcionarios', name: 'Funcionários', icon: <UsersIcon className="w-5 h-5 mr-2" /> },
    { id: 'financeiro', name: 'Financeiro', icon: <BriefcaseIcon className="w-5 h-5 mr-2" /> },
    { id: 'faturas', name: 'Faturas', icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
    { id: 'relatorios', name: 'Relatórios', icon: <DocumentReportIcon className="w-5 h-5 mr-2" /> },
    { id: 'logs', name: 'Logs de Atividade', icon: <EyeIcon className="w-5 h-5 mr-2" /> },
];

const AdministrativeTabs: React.FC<AdministrativeTabsProps> = ({ activeTab, setActiveTab }) => {
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

export default AdministrativeTabs;