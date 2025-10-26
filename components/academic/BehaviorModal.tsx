
import React from 'react';
import Modal from '../shared/Modal';
import BehaviorForm from './BehaviorForm';
import { BehaviorRecord, Student } from '../../types';

interface BehaviorModalProps {
    record: BehaviorRecord | null;
    onClose: () => void;
    onSave: (record: BehaviorRecord) => void;
    students: Student[];
}

const BehaviorModal: React.FC<BehaviorModalProps> = ({ record, onClose, onSave, students }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={record ? 'Editar Ocorrência' : 'Nova Ocorrência'}
        >
            <BehaviorForm 
                recordToEdit={record}
                onSave={onSave}
                onCancel={onClose}
                students={students}
            />
        </Modal>
    );
};

export default BehaviorModal;
