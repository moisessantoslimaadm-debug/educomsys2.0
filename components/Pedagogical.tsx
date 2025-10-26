import React, { useState } from 'react';
import PedagogicalTabs, { PedagogicalView } from './pedagogical/PedagogicalTabs';
import LessonPlanManagement from './pedagogical/LessonPlanManagement';
import PortfolioManagement from './pedagogical/PortfolioManagement';
import MaterialsManagement from './pedagogical/MaterialsManagement';
import { User } from '../types';

interface PedagogicalProps {
    user: User;
}

const Pedagogical: React.FC<PedagogicalProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<PedagogicalView>('planos');

    const renderContent = () => {
        switch(activeTab) {
            case 'planos':
                return <LessonPlanManagement />;
            case 'portfolio':
                return <PortfolioManagement user={user}/>;
            case 'materiais':
                // FIX: Pass user prop to MaterialsManagement component.
                return <MaterialsManagement user={user} />;
            default:
                return <LessonPlanManagement />;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Módulo Pedagógico</h1>
            <PedagogicalTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Pedagogical;