import React from 'react';
import Modal from '../shared/Modal';
import LessonPlanForm from './LessonPlanForm';
import { LessonPlan, Subject, Class } from '../../types';

interface LessonPlanModalProps {
    plan: LessonPlan | null;
    onClose: () => void;
    onSave: (plan: LessonPlan) => void;
    subjects: Subject[];
    classes: Class[];
}

const LessonPlanModal: React.FC<LessonPlanModalProps> = ({ plan, onClose, onSave, subjects, classes }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={plan ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
        >
            <LessonPlanForm 
                planToEdit={plan}
                onSave={onSave}
                onCancel={onClose}
                subjects={subjects}
                classes={classes}
            />
        </Modal>
    );
};

export default LessonPlanModal;