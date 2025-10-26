import React from 'react';
import Modal from '../shared/Modal';
import SchoolForm from './SchoolForm';
import { School } from '../../types';

interface SchoolModalProps {
    school: School | null;
    onClose: () => void;
    onSave: (school: Omit<School, 'id'>) => void;
}

const SchoolModal: React.FC<SchoolModalProps> = ({ school, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={school ? 'Editar Escola' : 'Adicionar Nova Escola'}
        >
            <SchoolForm
                schoolToEdit={school}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default SchoolModal;
