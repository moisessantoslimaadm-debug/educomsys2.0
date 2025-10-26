import React, { useState } from 'react';
import AcademicTabs, { AcademicView } from './academic/AcademicTabs';
import StudentManagement from './academic/StudentManagement';
import ClassManagement from './academic/ClassManagement';
import SubjectManagement from './academic/SubjectManagement';
import ReportsManagement from './academic/ReportsManagement';
import ClassJournalManagement from './academic/ClassJournalManagement';
import ScheduleManagement from './academic/ScheduleManagement';
import BehaviorManagement from './academic/BehaviorManagement';
import TransferManagement from './academic/TransferManagement';
import HistoryManagement from './academic/HistoryManagement';
import EnrollmentManagement from './academic/EnrollmentManagement';
import PerformanceAnalytics from './academic/PerformanceAnalytics';
import { User } from '../types';

interface AcademicProps {
    user: User;
}

const Academic: React.FC<AcademicProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<AcademicView>('alunos');

    const renderContent = () => {
        switch(activeTab) {
            case 'alunos':
                return <StudentManagement />;
            case 'turmas':
                return <ClassManagement />;
            case 'disciplinas':
                return <SubjectManagement />;
            case 'diario':
                return <ClassJournalManagement user={user} />;
            case 'comportamento':
                // FIX: Pass user prop to BehaviorManagement component.
                return <BehaviorManagement user={user} />;
            case 'horarios':
                return <ScheduleManagement />;
            case 'desempenho':
                return <PerformanceAnalytics />;
            case 'relatorios':
                return <ReportsManagement />;
            case 'transferencias':
                return <TransferManagement />;
            case 'historico':
                return <HistoryManagement />;
            case 'matriculas':
                return <EnrollmentManagement />;
            default:
                return <StudentManagement />;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Módulo Acadêmico</h1>
            <AcademicTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default Academic;