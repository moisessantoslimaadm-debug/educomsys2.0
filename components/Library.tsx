import React, { useState } from 'react';
import { User, UserRole } from '../types';
import LibraryTabs, { LibraryView } from './library/LibraryTabs';
import BookManagement from './library/BookManagement';
import LoanManagement from './library/LoanManagement';

interface LibraryProps {
    user: User;
}

const Library: React.FC<LibraryProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<LibraryView>('acervo');

    const canManageLibrary = user.role === UserRole.Direcao || user.role === UserRole.Secretaria;

    const renderContent = () => {
        switch (activeTab) {
            case 'acervo':
                return <BookManagement canManage={canManageLibrary} />;
            case 'emprestimos':
                return <LoanManagement canManage={canManageLibrary} user={user} />;
            default:
                return <BookManagement canManage={canManageLibrary} />;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Módulo da Biblioteca</h1>
            <LibraryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">{renderContent()}</div>
        </div>
    );
};

export default Library;