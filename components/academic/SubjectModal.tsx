
import React from 'react';
import Modal from '../shared/Modal';
import SubjectForm from './SubjectForm';
import { Subject } from '../../types';

interface SubjectModalProps {
    subject: Subject | null;
    onClose: () => void;
    onSave: (subject: Subject) => void;
}

const SubjectModal: React.FC<SubjectModalProps> = ({ subject, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={subject ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
        >
            <SubjectForm 
                subjectToEdit={subject}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default SubjectModal;
