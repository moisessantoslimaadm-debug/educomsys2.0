

import React, { useState } from 'react';
import { CalendarEvent } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, PencilAltIcon, StarIcon, TagIcon, UsersIcon, InformationCircleIcon } from '../icons/Icons';

interface CalendarViewProps {
    events: CalendarEvent[];
    onSelectEvent: (event: CalendarEvent) => void;
    onSelectSlot: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent, onSelectSlot }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const eventTypeVisuals: { [key in CalendarEvent['type']]: { className: string, icon: React.ReactNode } } = {
        'Feriado': { className: 'bg-red-500 border-red-600', icon: <TagIcon className="w-3 h-3 flex-shrink-0" /> },
        'Prova': { className: 'bg-yellow-500 border-yellow-600', icon: <PencilAltIcon className="w-3 h-3 flex-shrink-0" /> },
        'Evento': { className: 'bg-green-500 border-green-600', icon: <StarIcon className="w-3 h-3 flex-shrink-0" /> },
        'Reunião': { className: 'bg-blue-500 border-blue-600', icon: <UsersIcon className="w-3 h-3 flex-shrink-0" /> },
        'Outro': { className: 'bg-gray-500 border-gray-600', icon: <InformationCircleIcon className="w-3 h-3 flex-shrink-0" /> },
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="w-6 h-6" /></button>
        </div>
    );

    const renderDays = () => {
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return <div className="grid grid-cols-7">{daysOfWeek.map(day => <div key={day} className="text-center font-semibold text-sm py-2">{day}</div>)}</div>;
    };

    const renderCells = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

        const rows = [];
        let days = [];
        let day = new Date(startDate);
        let today = new Date();
        today.setHours(0,0,0,0);

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = new Date(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.getTime() === today.getTime();
                const dayEvents = events.filter(e => new Date(e.start + "T00:00:00").toDateString() === day.toDateString());

                days.push(
                    <div
                        key={day.toString()}
                        className={`border-t border-r border-gray-200 dark:border-gray-700 h-32 p-1.5 flex flex-col ${isCurrentMonth ? '' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400'}`}
                        onClick={() => onSelectSlot(cloneDay.toISOString().split('T')[0])}
                    >
                        <span className={`text-sm ${isToday ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{day.getDate()}</span>
                        <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                            {dayEvents.map(event => {
                                const visual = eventTypeVisuals[event.type];
                                return (
                                    <div key={event.id} onClick={(e) => { e.stopPropagation(); onSelectEvent(event); }} className={`flex items-center p-1 text-xs text-white rounded cursor-pointer ${visual.className}`}>
                                        {visual.icon}
                                        <span className="ml-1 truncate">{event.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
                day.setDate(day.getDate() + 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div className="border-l border-b border-gray-200 dark:border-gray-700">{rows}</div>;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default CalendarView;