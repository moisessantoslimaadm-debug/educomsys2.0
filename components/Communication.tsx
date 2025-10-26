import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../services/api';
import { User, UserRole, Message, Announcement } from '../types';
import { MailIcon, PencilAltIcon, TrashIcon, PlusIcon } from './icons/Icons';
import ComposeMessageModal from './communication/ComposeMessageModal';
import Spinner from './shared/Spinner.tsx';
import AnnouncementModal from './communication/AnnouncementModal';
import Button from './shared/Button';

interface CommunicationProps {
    user: User;
}

const Communication: React.FC<CommunicationProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');
    const [messages, setMessages] = useState<Message[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State for messages
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    // State for announcements
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const canManageAnnouncements = user.role === UserRole.Direcao || user.role === UserRole.Secretaria;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [msgs, anns, allUsers] = await Promise.all([
                    api.get<Message[]>(`/messages?user_name=${user.name}`), // Assuming API can filter by user
                    api.get<Announcement[]>('/announcements'),
                    api.get<User[]>('/users'),
                ]);
                
                const sortedMsgs = msgs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setMessages(sortedMsgs);
                if (!selectedMessage && sortedMsgs.length > 0) {
                    setSelectedMessage(sortedMsgs[0]);
                }

                setAnnouncements(anns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setUsers(allUsers);

            } catch (error) {
                console.error("Failed to fetch communication data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.name, selectedMessage]);
    
    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message);
        if (message.to === user.name && !message.read) {
            api.put(`/messages/${message.id}`, { ...message, read: true })
               .then(updatedMessage => {
                   setMessages(prev => prev.map(m => m.id === message.id ? updatedMessage : m));
               });
        }
    }

    const handleSendMessage = async (newMessage: Omit<Message, 'id' | 'timestamp' | 'read' | 'from'>) => {
        const fullMessage: Omit<Message, 'id'> = {
            ...newMessage,
            from: user.name,
            timestamp: new Date().toISOString(),
            read: false,
        };
        const sentMessage = await api.post<Message>("/messages", fullMessage);
        setMessages(prev => [sentMessage, ...prev]);
        setIsComposeModalOpen(false);
    }

    const handleSaveAnnouncement = async (announcement: Announcement) => {
        const announcementData = { ...announcement, author: user.name };
        if (announcement.id) {
            const updatedAnn = await api.put<Announcement>(`/announcements/${announcement.id}`, announcementData);
            setAnnouncements(prev => prev.map(a => a.id === updatedAnn.id ? updatedAnn : a));
            await logActivity('Update Announcement', { id: announcement.id, title: announcement.title });
        } else {
            const newAnn = await api.post<Announcement>("/announcements", announcementData);
            setAnnouncements(prev => [newAnn, ...prev]);
            await logActivity('Create Announcement', { title: announcement.title });
        }
        setIsAnnouncementModalOpen(false);
        setEditingAnnouncement(null);
    }

    const handleDeleteAnnouncement = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este comunicado?")) {
            await api.delete(`/announcements/${id}`);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            await logActivity('Delete Announcement', { id });
        }
    }

    const handleEditAnnouncement = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsAnnouncementModalOpen(true);
    }

    const renderMessages = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex min-h-[70vh]">
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"><h2 className="font-semibold">Caixa de Entrada</h2><button onClick={() => setIsComposeModalOpen(true)} className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-full"><PencilAltIcon className="w-5 h-5"/></button></div>
                <ul className="overflow-y-auto flex-1">
                    {messages.map(msg => (
                        <li key={msg.id} onClick={() => handleSelectMessage(msg)} className={`p-4 cursor-pointer border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedMessage?.id === msg.id ? 'bg-primary-50 dark:bg-primary-900/40' : ''}`}>
                            <div className="flex justify-between items-start"><p className={`font-semibold ${!msg.read && msg.to === user.name ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{msg.to === user.name ? msg.from : `Para: ${msg.to}`}</p>{!msg.read && msg.to === user.name && <span className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 mt-1.5"></span>}</div>
                            <p className={`truncate text-sm ${!msg.read && msg.to === user.name ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{msg.subject}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 p-6">
                {selectedMessage ? (
                    <div>
                         <div className="pb-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-xl font-bold">{selectedMessage.subject}</h3><p className="text-sm text-gray-500 dark:text-gray-400">De: {selectedMessage.from}</p><p className="text-sm text-gray-500 dark:text-gray-400">Para: {selectedMessage.to}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(selectedMessage.timestamp).toLocaleString()}</p></div>
                        <div className="mt-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.body}</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400"><MailIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" /><p>Selecione uma mensagem para ler ou crie uma nova.</p></div>
                )}
            </div>
        </div>
    );

    const renderAnnouncements = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold">Mural de Comunicados</h2>
                    <p className="text-gray-500 dark:text-gray-400">Veja e gerencie os comunicados para toda a escola.</p>
                </div>
                 {canManageAnnouncements && <Button onClick={() => { setEditingAnnouncement(null); setIsAnnouncementModalOpen(true); }}><PlusIcon className="w-5 h-5 mr-2" /> Novo Comunicado</Button>}
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                <ul className="space-y-4">
                    {announcements.map(ann => (
                        <li key={ann.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-primary-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-200">{ann.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ann.content}</p>
                                </div>
                                {canManageAnnouncements && (
                                    <div className="flex-shrink-0 ml-4 space-x-1">
                                        <button onClick={() => handleEditAnnouncement(ann)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><PencilAltIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleDeleteAnnouncement(ann.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                )}
                            </div>
                             <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                               - {ann.author}, {new Date(ann.date).toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                    {announcements.length === 0 && <p className="text-sm text-center text-gray-500 py-4">Nenhum comunicado no mural.</p>}
                </ul>
            </div>
        </div>
    );
    
    if (loading) return <Spinner />;

    return (
        <div>
             <h1 className="text-3xl font-bold mb-6">Comunicação</h1>
             <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('messages')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>Mensagens</button>
                    <button onClick={() => setActiveTab('announcements')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'announcements' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>Mural de Comunicados</button>
                </nav>
            </div>
            
            {activeTab === 'messages' ? renderMessages() : renderAnnouncements()}

            {isComposeModalOpen && <ComposeMessageModal onClose={() => setIsComposeModalOpen(false)} onSend={handleSendMessage} users={users.filter(u => u.id !== user.id)} />}
            {isAnnouncementModalOpen && <AnnouncementModal onClose={() => setIsAnnouncementModalOpen(false)} onSave={handleSaveAnnouncement} announcement={editingAnnouncement} />}
        </div>
    );
};

export default Communication;