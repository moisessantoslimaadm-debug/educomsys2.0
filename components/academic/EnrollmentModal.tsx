
import React from 'react';
import Modal from '../shared/Modal';
import EnrollmentForm from './EnrollmentForm';

interface EnrollmentModalProps {
    onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ onClose }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Nova Solicitação de Matrícula"
        >
            <EnrollmentForm onCancel={onClose} />
        </Modal>
    );
};

export default EnrollmentModal;
