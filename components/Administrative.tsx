import React, { useState } from 'react';
import AdministrativeTabs, { AdministrativeView } from './administrative/AdministrativeTabs';
import EmployeeManagement from './administrative/EmployeeManagement';
import FinancialManagement from './administrative/FinancialManagement';
import Reports from './administrative/Reports';
import ActivityLog from './administrative/ActivityLog';
import InvoiceManagement from './administrative/InvoiceManagement';


const Administrative: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdministrativeView>('funcionarios');

    const renderContent = () => {
        switch(activeTab) {
            case 'funcionarios':
                return <EmployeeManagement />;
            case 'financeiro':
                 return <FinancialManagement />;
            case 'faturas':
                 return <InvoiceManagement />;
            case 'relatorios':
                 return <Reports />;
            case 'logs':
                 return <ActivityLog />;
            default:
                return <EmployeeManagement />;
        }
    }

    return (
         <div>
            <h1 className="text-3xl font-bold mb-6">Módulo Administrativo</h1>
            <AdministrativeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Administrative;