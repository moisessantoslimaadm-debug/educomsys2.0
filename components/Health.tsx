
import React, { useState } from 'react';
import { User } from '../types';
import HealthTabs, { HealthView } from './health/HealthTabs';
import MedicalRecordManagement from './health/MedicalRecordManagement';
import HealthIncidentLog from './health/HealthIncidentLog';

interface HealthProps {
    user: User;
}

const Health: React.FC<HealthProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<HealthView>('ficha');

    const renderContent = () => {
        switch (activeTab) {
            case 'ficha':
                return <MedicalRecordManagement user={user} />;
            case 'ocorrencias':
                return <HealthIncidentLog user={user} />;
            default:
                return <MedicalRecordManagement user={user} />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Módulo de Saúde</h1>
            <HealthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default Health;
