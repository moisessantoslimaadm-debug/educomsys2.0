import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarEvent } from '../../types';
import { CalendarIcon, PencilAltIcon, StarIcon, TagIcon, UsersIcon, InformationCircleIcon } from '../icons/Icons';
import Spinner from './Spinner';

const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming the API supports filtering and sorting
                const today = new Date().toISOString().split('T')[0];
                const eventsData = await api.get<CalendarEvent[]>(`/calendar_events?start_date=${today}&sort=start_asc&limit=4`);
                setEvents(eventsData);
            } catch (error) {
                console.error("Failed to fetch upcoming events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const eventTypeVisuals: { [key in CalendarEvent['type']]: { className: string, icon: React.ReactNode } } = {
        'Feriado': { className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', icon: <TagIcon className="w-4 h-4" /> },
        'Prova': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', icon: <PencilAltIcon className="w-4 h-4" /> },
        'Evento': { className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: <StarIcon className="w-4 h-4" /> },
        'Reunião': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', icon: <UsersIcon className="w-4 h-4" /> },
        'Outro': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: <InformationCircleIcon className="w-4 h-4" /> },
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00'); // Adjust for timezone
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarIcon className="w-6 h-6 mr-2" />
                Próximos Eventos
            </h2>
            {loading ? <div className="h-40"><Spinner/></div> : (
                <ul className="space-y-4">
                    {events.length > 0 ? events.map(event => {
                        const visual = eventTypeVisuals[event.type];
                        return (
                            <li key={event.id} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-16 text-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                    <p className="font-bold text-lg text-primary-600 dark:text-primary-300">{formatDate(event.start).split(' ')[0]}</p>
                                    <p className="text-xs uppercase">{formatDate(event.start).split(' ').pop()}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
                                    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${visual.className}`}>
                                        {visual.icon}
                                        <span className="ml-1.5">{event.type}</span>
                                    </span>
                                </div>
                            </li>
                        )
                    }) : (
                        <p className="text-sm text-center text-gray-500 py-8">Nenhum evento próximo.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default UpcomingEvents;