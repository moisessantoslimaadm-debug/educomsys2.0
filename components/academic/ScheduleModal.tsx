
import React from 'react';
import Modal from '../shared/Modal';
import ScheduleForm from './ScheduleForm';
import { Schedule, Class, Subject } from '../../types';

interface ScheduleModalProps {
    schedule: Schedule | null;
    onClose: () => void;
    onSave: (schedule: Schedule) => void;
    classes: Class[];
    subjects: Subject[];
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ schedule, onClose, onSave, classes, subjects }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={schedule ? 'Editar Horário' : 'Adicionar Novo Horário'}
        >
            <ScheduleForm 
                scheduleToEdit={schedule}
                onSave={onSave}
                onCancel={onClose}
                classes={classes}
                subjects={subjects}
            />
        </Modal>
    );
};

export default ScheduleModal;
