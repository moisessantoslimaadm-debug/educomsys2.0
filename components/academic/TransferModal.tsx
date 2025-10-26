
import React from 'react';
import Modal from '../shared/Modal';
import TransferForm from './TransferForm';
import { TransferRecord, Student, Class } from '../../types';

interface TransferModalProps {
    record: TransferRecord | null;
    onClose: () => void;
    onSave: (record: TransferRecord) => void;
    students: Student[];
    classes: Class[];
}

const TransferModal: React.FC<TransferModalProps> = ({ record, onClose, onSave, students, classes }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={record ? 'Editar Transferência' : 'Registrar Nova Transferência'}
        >
            <TransferForm 
                recordToEdit={record}
                onSave={onSave}
                onCancel={onClose}
                students={students}
                classes={classes}
            />
        </Modal>
    );
};

export default TransferModal;
