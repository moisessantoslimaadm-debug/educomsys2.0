import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../services/api';
import { User, CalendarEvent, UserRole } from '../types';
import Spinner from './shared/Spinner';
import CalendarView from './calendar/CalendarView';
import EventModal from './calendar/EventModal';
import Button from './shared/Button';
import { PlusIcon } from './icons/Icons';

interface CalendarProps {
    user: User;
}

const Calendar: React.FC<CalendarProps> = ({ user }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const canManageEvents = user.role === UserRole.Direcao || user.role === UserRole.Secretaria;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await api.get<CalendarEvent[]>('/calendar_events');
                setEvents(eventsData);
            } catch (error) {
                console.error("Failed to fetch calendar events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleOpenModal = (date?: string, event?: CalendarEvent) => {
        setSelectedDate(date || null);
        setSelectedEvent(event || null);
        setIsModalOpen(true);
    };

    const handleSaveEvent = async (event: Omit<CalendarEvent, 'id'>) => {
        if (!canManageEvents) return;

        try {
            if (selectedEvent?.id) {
                const updatedEvent = await api.put<CalendarEvent>(`/calendar_events/${selectedEvent.id}`, event);
                setEvents(prev => prev.map(e => e.id === selectedEvent.id ? updatedEvent : e));
                await logActivity('Atualização de Evento', { eventId: selectedEvent.id, title: event.title });
            } else {
                const newEvent = await api.post<CalendarEvent>('/calendar_events', event);
                setEvents(prev => [...prev, newEvent]);
                await logActivity('Criação de Evento', { eventId: newEvent.id, title: event.title });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save event:", error);
            alert("Falha ao salvar o evento.");
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!canManageEvents || !window.confirm("Tem certeza que deseja excluir este evento?")) return;
        
        try {
            await api.delete(`/calendar_events/${eventId}`);
            setEvents(prev => prev.filter(e => e.id !== eventId));
            await logActivity('Exclusão de Evento', { eventId });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to delete event:", error);
            alert("Falha ao excluir o evento.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Calendário Escolar</h1>
                    <p className="text-gray-500 dark:text-gray-400">Acompanhe os eventos, feriados e provas da escola.</p>
                </div>
                {canManageEvents && (
                    <Button onClick={() => handleOpenModal()}>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Evento
                    </Button>
                )}
            </div>

            <CalendarView 
                events={events}
                onSelectEvent={(event) => handleOpenModal(event.start, event)}
                onSelectSlot={(date) => canManageEvents && handleOpenModal(date)}
            />

            {isModalOpen && (
                <EventModal
                    event={selectedEvent}
                    selectedDate={selectedDate}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    canManage={canManageEvents}
                />
            )}
        </div>
    );
};

export default Calendar;