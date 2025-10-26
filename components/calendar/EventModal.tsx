
import React from 'react';
import Modal from '../shared/Modal';
import EventForm from './EventForm';
import { CalendarEvent } from '../../types';
import Button from '../shared/Button';

interface EventModalProps {
    event: CalendarEvent | null;
    selectedDate: string | null;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'>) => void;
    onDelete: (eventId: string) => void;
    canManage: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, selectedDate, onClose, onSave, onDelete, canManage }) => {
    
    const footer = canManage ? (
        <div className="flex justify-between w-full">
            <div>
                {event && (
                    <Button variant="secondary" className="!bg-red-100 !text-red-700 hover:!bg-red-200" onClick={() => onDelete(event.id!)}>
                        Excluir Evento
                    </Button>
                )}
            </div>
        </div>
    ) : null;
    
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={event ? 'Editar Evento' : 'Novo Evento'}
            footer={footer}
        >
            <EventForm
                eventToEdit={event}
                selectedDate={selectedDate}
                onSave={onSave}
                onCancel={onClose}
                canManage={canManage}
            />
        </Modal>
    );
};

export default EventModal;
