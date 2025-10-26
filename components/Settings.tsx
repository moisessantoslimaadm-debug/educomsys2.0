import React, { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import api from '../services/api';
import Input from './shared/Input';
import Button from './shared/Button';
import { SunIcon, MoonIcon, CogIcon } from './icons/Icons';
import { User } from '../types';

interface SettingsProps {
    user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
    const { setTheme } = useTheme();

    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [error, setError] = useState('');
    const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | 'system'>('system');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
         if (storedTheme === 'light' || storedTheme === 'dark') {
            setActiveTheme(storedTheme);
        } else {
            setActiveTheme('system');
        }
    }, []);


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Usuário não autenticado.");
            return;
        }

        setStatus('saving');
        setError('');

        try {
            await api.put(`/users/${user.id}`, { name });
            // Note: In a real app, the user object in App's state should be updated.
            // This would require lifting state up or using a global state manager.
            // For now, a page refresh would show the new name.
            setStatus('saved');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Falha ao salvar as alterações.");
            setStatus('idle');
        }
    };

    const handleThemeChange = (newThemeSelection: 'light' | 'dark' | 'system') => {
        setActiveTheme(newThemeSelection);
        if (newThemeSelection === 'system') {
            localStorage.setItem('theme', 'system');
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
        } else {
            localStorage.setItem('theme', newThemeSelection);
            setTheme(newThemeSelection);
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Configurações</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Perfil</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Nome Completo"
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                value={email}
                                disabled // Email is generally not editable
                                onChange={() => {}}
                            />
                             {error && <p className="text-sm text-red-500">{error}</p>}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={status === 'saving'}>
                                    {status === 'saving' ? 'Salvando...' : status === 'saved' ? 'Salvo!' : 'Salvar Alterações'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Tema da Interface</h2>
                        <div className="space-y-2">
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Escolha como o EDUCONSYS deve aparecer para você.</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleThemeChange('light')} className={`p-2 rounded-lg border-2 ${activeTheme === 'light' ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-100 dark:bg-gray-700`}>
                                    <SunIcon className="w-5 h-5 mx-auto text-yellow-500"/>
                                    <span className="text-sm">Claro</span>
                                </button>
                                 <button onClick={() => handleThemeChange('dark')} className={`p-2 rounded-lg border-2 ${activeTheme === 'dark' ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-100 dark:bg-gray-700`}>
                                    <MoonIcon className="w-5 h-5 mx-auto text-blue-400"/>
                                    <span className="text-sm">Escuro</span>
                                </button>
                                 <button onClick={() => handleThemeChange('system')} className={`p-2 rounded-lg border-2 ${activeTheme === 'system' ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'} bg-gray-100 dark:bg-gray-700`}>
                                    <CogIcon className="w-5 h-5 mx-auto text-gray-500"/>
                                    <span className="text-sm">Sistema</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;