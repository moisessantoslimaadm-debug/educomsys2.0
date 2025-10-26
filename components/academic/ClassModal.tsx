
import React from 'react';
import Modal from '../shared/Modal';
import ClassForm from './ClassForm';
import { Class, Teacher, Student } from '../../types';

interface ClassModalProps {
    classData: Class | null;
    onClose: () => void;
    onSave: (cls: Class) => void;
    teachers: Teacher[];
    students: Student[];
}

const ClassModal: React.FC<ClassModalProps> = ({ classData, onClose, onSave, teachers, students }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={classData ? 'Editar Turma' : 'Adicionar Nova Turma'}
        >
            <ClassForm 
                classToEdit={classData}
                onSave={onSave}
                onCancel={onClose}
                teachers={teachers}
                students={students}
            />
        </Modal>
    );
};

export default ClassModal;
