import React from 'react';
import { OfficeBuildingIcon, DocumentReportIcon } from '../icons/Icons';

export type MunicipalView = 'escolas' | 'relatorios';

interface MunicipalTabsProps {
    activeTab: MunicipalView;
    setActiveTab: (tab: MunicipalView) => void;
}

const tabs: { id: MunicipalView; name: string; icon: React.ReactNode }[] = [
    { id: 'escolas', name: 'Escolas', icon: <OfficeBuildingIcon className="w-5 h-5 mr-2" /> },
    { id: 'relatorios', name: 'Relatórios da Rede', icon: <DocumentReportIcon className="w-5 h-5 mr-2" /> },
];

const MunicipalTabs: React.FC<MunicipalTabsProps> = ({ activeTab, setActiveTab }) => {
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

export default MunicipalTabs;
