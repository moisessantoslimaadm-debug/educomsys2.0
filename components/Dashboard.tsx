import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { User, UserRole } from '../types';
import Academic from './Academic';
import Administrative from './Administrative';
import Pedagogical from './Pedagogical';
import Settings from './Settings';
import ProfessorDashboard from './ProfessorDashboard';
import DirectorDashboard from './DirectorDashboard';
import MunicipalDashboard from './MunicipalDashboard';
import StudentDashboard from './StudentDashboard';
import GuardianDashboard from './GuardianDashboard';
import Communication from './Communication';
import SecretaryDashboard from './SecretaryDashboard';
import Municipal from './Municipal';
import Library from './Library';
import Calendar from './Calendar';
import Health from './Health';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const renderDashboardByRole = () => {
        switch(user.role) {
            case UserRole.Direcao:
                return <DirectorDashboard />;
            case UserRole.Secretaria:
                return <SecretaryDashboard />;
            case UserRole.SecretariaMunicipal:
                return <MunicipalDashboard />;
            case UserRole.Aluno:
                return <StudentDashboard user={user} />;
            case UserRole.Responsavel:
                 return <GuardianDashboard user={user} />;
            case UserRole.Professor:
            default:
                return <ProfessorDashboard user={user}/>;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar 
                open={sidebarOpen} 
                setOpen={setSidebarOpen} 
                onLogout={onLogout}
                userRole={user.role}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    <div className="container mx-auto">
                       <Routes>
                           <Route path="/" element={renderDashboardByRole()} />
                           <Route path="/academic" element={<Academic user={user} />} />
                           <Route path="/pedagogical" element={<Pedagogical user={user} />} />
                           <Route path="/administrative" element={<Administrative />} />
                           <Route path="/health" element={<Health user={user} />} />
                           <Route path="/communication" element={<Communication user={user} />} />
                           <Route path="/municipal" element={<Municipal />} />
                           <Route path="/library" element={<Library user={user} />} />
                           <Route path="/calendar" element={<Calendar user={user} />} />
                           <Route path="/settings" element={<Settings user={user} />} />
                           <Route path="*" element={<Navigate to="/" replace />} />
                       </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;