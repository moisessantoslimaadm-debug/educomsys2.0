import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { User } from '../types';
import { useTheme } from '../hooks/useTheme';
import { BellIcon, MenuIcon, MoonIcon, SunIcon } from './icons/Icons';
import { Notification } from '../types';

interface HeaderProps {
    user: User;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user?.id) return;
        
        const fetchNotifications = async () => {
            try {
                // Assuming an endpoint that returns notifications for the current user
                const notifs = await api.get<Notification[]>(`/notifications?user_id=${user.id}`);
                setNotifications(notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        
        // Polling for new notifications as a simple replacement for real-time
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);

    }, [user.id]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationsToggle = () => setIsNotificationsOpen(prev => !prev);

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        try {
            // Assuming a batch update endpoint
            await api.post('/notifications/mark-as-read', { ids: unreadIds });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm no-print">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden">
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-600" />}
                </button>
                <div className="relative" ref={notificationsRef}>
                    <button onClick={handleNotificationsToggle} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400"/>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span></span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                         <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-10">
                            <div className="p-3 flex justify-between items-center border-b dark:border-gray-700"><h3 className="font-semibold">Notificações</h3><button onClick={handleMarkAllAsRead} disabled={unreadCount === 0} className="text-xs text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline">Marcar todas como lidas</button></div>
                            <ul className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notification => (
                                    <li key={notification.id} className={`p-3 border-b dark:border-gray-700/50 ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                        <div className="flex items-start">
                                            {!notification.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0 mr-2"></div>}
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{notification.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-4 text-center text-sm text-gray-500">Nenhuma notificação nova.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
                    <div className="ml-3 hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;