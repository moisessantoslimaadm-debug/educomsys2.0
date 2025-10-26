import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    BookOpenIcon, 
    HomeIcon, 
    AcademicCapIcon, 
    BriefcaseIcon, 
    CollectionIcon, 
    CogIcon, 
    LogoutIcon,
    ChatAlt2Icon,
    CalendarIcon,
    BookmarkSquareIcon,
    HeartIcon,
    CubeIcon
} from './icons/Icons';
import { UserRole } from '../types';

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onLogout: () => void;
    userRole: UserRole;
}

interface NavItemProps {
    icon: React.ReactNode;
    text: string;
    open: boolean;
    to: string;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, open, to, onClick }) => (
    <NavLink
        to={to}
        end={to === '/'}
        onClick={onClick}
        className={({ isActive }) => `
            relative flex items-center py-3 px-4 my-1
            font-medium rounded-lg cursor-pointer
            transition-colors group
            ${isActive 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
        `}
    >
        {icon}
        <span className={`overflow-hidden transition-all ${open ? 'w-40 ml-3' : 'w-0'}`}>{text}</span>
        {!open && (
             <div className={`
                absolute left-full rounded-md px-2 py-1 ml-6
                bg-primary-100 text-primary-800 text-sm
                invisible opacity-20 -translate-x-3 transition-all
                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 dark:bg-gray-700 dark:text-gray-200
            `}>
                {text}
            </div>
        )}
    </NavLink>
);

const allNavItems = {
    'Dashboard': { icon: <HomeIcon className="w-6 h-6" />, text: 'Dashboard', to: '/' },
    'Acadêmico': { icon: <AcademicCapIcon className="w-6 h-6" />, text: 'Acadêmico', to: '/academic' },
    'Pedagógico': { icon: <CollectionIcon className="w-6 h-6" />, text: 'Pedagógico', to: '/pedagogical' },
    'Administrativo': { icon: <BriefcaseIcon className="w-6 h-6" />, text: 'Administrativo', to: '/administrative' },
    'Saúde': { icon: <HeartIcon className="w-6 h-6" />, text: 'Saúde', to: '/health' },
    'Comunicação': { icon: <ChatAlt2Icon className="w-6 h-6" />, text: 'Comunicação', to: '/communication' },
    'Gestão Municipal': { icon: <CubeIcon className="w-6 h-6" />, text: 'Gestão Municipal', to: '/municipal' },
    'Calendário': { icon: <CalendarIcon className="w-6 h-6" />, text: 'Calendário', to: '/calendar' },
    'Biblioteca': { icon: <BookmarkSquareIcon className="w-6 h-6" />, text: 'Biblioteca', to: '/library' },
};

const navConfig = {
    [UserRole.Professor]: ['Dashboard', 'Acadêmico', 'Pedagógico', 'Calendário', 'Biblioteca', 'Comunicação'],
    [UserRole.Direcao]: ['Dashboard', 'Acadêmico', 'Pedagógico', 'Administrativo', 'Saúde', 'Calendário', 'Biblioteca', 'Comunicação'],
    [UserRole.Secretaria]: ['Dashboard', 'Acadêmico', 'Pedagógico', 'Administrativo', 'Saúde', 'Calendário', 'Biblioteca', 'Comunicação'],
    [UserRole.SecretariaMunicipal]: ['Dashboard', 'Gestão Municipal', 'Acadêmico', 'Administrativo'],
    [UserRole.Aluno]: ['Dashboard', 'Calendário', 'Biblioteca'],
    [UserRole.Responsavel]: ['Dashboard', 'Saúde', 'Calendário', 'Biblioteca'],
};

const Sidebar: React.FC<SidebarProps> = ({ open, onLogout, userRole }) => {
    const availableNavs = navConfig[userRole] || [];

    return (
        <aside className={`h-screen transition-all duration-300 ease-in-out no-print ${open ? 'w-64' : 'w-20'}`} aria-label="Sidebar">
            <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md">
                <div className="flex items-center justify-center p-4 h-[65px] border-b border-gray-200 dark:border-gray-700">
                     <div className="bg-primary-600 p-2 rounded-lg">
                        <BookOpenIcon className="w-6 h-6 text-white" />
                    </div>
                    <h1 className={`overflow-hidden transition-all font-bold text-xl ml-2 ${open ? 'w-32' : 'w-0'}`}>
                        EDUCONSYS
                    </h1>
                </div>

                <ul className="flex-1 px-4 py-4">
                    {availableNavs.map(navKey => {
                        const item = allNavItems[navKey as keyof typeof allNavItems];
                        return item ? (
                            <NavItem 
                                key={item.text}
                                icon={item.icon}
                                text={item.text}
                                open={open}
                                to={item.to}
                            />
                        ) : null
                    })}
                </ul>

                <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                    <NavItem icon={<CogIcon className="w-6 h-6" />} text="Configurações" open={open} to="/settings" />
                    <li
                        onClick={onLogout}
                        className={`relative flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer transition-colors group hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400`}
                    >
                        <LogoutIcon className="w-6 h-6" />
                        <span className={`overflow-hidden transition-all ${open ? 'w-40 ml-3' : 'w-0'}`}>Sair</span>
                         {!open && (
                             <div className={`
                                absolute left-full rounded-md px-2 py-1 ml-6
                                bg-primary-100 text-primary-800 text-sm
                                invisible opacity-20 -translate-x-3 transition-all
                                group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 dark:bg-gray-700 dark:text-gray-200
                            `}>
                                Sair
                            </div>
                        )}
                    </li>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;