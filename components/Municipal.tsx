import React, { useState } from 'react';
import MunicipalTabs, { MunicipalView } from './municipal/MunicipalTabs';
import SchoolManagement from './municipal/SchoolManagement';
import NetworkReports from './municipal/NetworkReports';

const Municipal: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MunicipalView>('escolas');

    const renderContent = () => {
        switch(activeTab) {
            case 'escolas':
                return <SchoolManagement />;
            case 'relatorios':
                return <NetworkReports />;
            default:
                return <SchoolManagement />;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Módulo de Gestão Municipal</h1>
            <MunicipalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Municipal;
