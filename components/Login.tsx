import React, { useState } from 'react';
import { BookOpenIcon, LockClosedIcon, MailIcon, ExclamationCircleIcon, CheckCircleIcon, ArrowLeftIcon, UserCircleIcon, IdentificationIcon } from './icons/Icons';
import { User, UserRole } from '../types';
import api from '../services/api';
import { AuthResponse } from '../App';


interface LoginProps {
    onLoginSuccess: (data: AuthResponse) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [view, setView] = useState<'login' | 'reset' | 'register'>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Professor);

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const response = await api.post<AuthResponse>('/auth/login', { email, password });
            onLoginSuccess(response);
        } catch (err: any) {
            setError(err.message || 'Email ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await api.post('/auth/password-reset', { email });
            setMessage('Se uma conta com este email existir, um link de recuperação foi enviado.');
            setView('login');
        } catch (err: any) {
             setError(err.message || 'Falha ao enviar o email de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        
        setLoading(true);

        try {
            await api.post('/auth/signup', {
                name,
                email,
                password,
                role,
            });
            
            setMessage('Conta criada com sucesso! Por favor, faça o login.');
            setView('login');
            setEmail(email); // Keep email for convenience
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Falha ao criar a conta.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleViewChange = (newView: 'login' | 'reset' | 'register') => {
        setView(newView);
        setError(null);
        setMessage(null);
        setPassword('');
        setConfirmPassword('');
        setName('');
    }

    const renderLoginView = () => (
        <>
            <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-6">Acesse sua conta</h2>
            <form onSubmit={handleLoginSubmit}>
                 <div className="mb-4">
                    <label htmlFor="email-login" className="sr-only">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password-login" className="sr-only">Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <div className="flex items-center justify-end mb-6">
                    <div className="text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('reset'); }} className="text-primary-600 hover:underline dark:text-primary-400">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                 <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Não tem uma conta?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('register'); }} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                        Cadastre-se
                    </a>
                </div>
            </form>
        </>
    );

    const renderResetView = () => (
         <>
            <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-2">Recuperar Senha</h2>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">Digite seu email para receber o link.</p>
            <form onSubmit={handlePasswordResetSubmit}>
                <div className="mb-6">
                    <label htmlFor="email-reset" className="sr-only">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email-reset" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
                <div className="text-center mt-4">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('login'); }} className="text-sm text-primary-600 hover:underline dark:text-primary-400 inline-flex items-center">
                        <ArrowLeftIcon className="w-4 h-4 mr-1"/>
                        Voltar para o Login
                    </a>
                </div>
            </form>
        </>
    );

    const renderRegisterView = () => (
        <>
            <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-6">Crie sua conta</h2>
            <form onSubmit={handleRegisterSubmit}>
                <div className="mb-4">
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserCircleIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                 <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdentificationIcon className="h-5 w-5 text-gray-400" /></div>
                        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none" required disabled={loading}>
                           {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar Senha" className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500" required disabled={loading}/>
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
                 <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewChange('login'); }} className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                        Faça login
                    </a>
                </div>
            </form>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex justify-center items-center mb-6">
                    <div className="bg-primary-600 p-3 rounded-full">
                        <BookOpenIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EDUCONSYS</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Gestão Educacional Inteligente</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    
                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-4 flex items-center" role="alert">
                            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                            <span className="block sm:inline text-sm">{error}</span>
                        </div>
                    )}

                    {message && (
                         <div className="bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative mb-4 flex items-center" role="alert">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            <span className="block sm:inline text-sm">{message}</span>
                        </div>
                    )}
                    
                    {view === 'login' && renderLoginView()}
                    {view === 'reset' && renderResetView()}
                    {view === 'register' && renderRegisterView()}
                </div>
            </div>
        </div>
    );
};

export default Login;