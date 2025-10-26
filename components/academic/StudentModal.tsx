
import React from 'react';
import Modal from '../shared/Modal';
import StudentForm from './StudentForm';
import { Student } from '../../types';

interface StudentModalProps {
    student: Student | null;
    onClose: () => void;
    onSave: (student: Student) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={student ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
        >
            <StudentForm 
                studentToEdit={student}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default StudentModal;
