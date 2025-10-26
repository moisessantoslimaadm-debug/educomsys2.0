
import React from 'react';
import Modal from '../shared/Modal';
import EmployeeForm from './EmployeeForm';
import { Employee } from '../../types';

interface EmployeeModalProps {
    employee: Employee | null;
    onClose: () => void;
    onSave: (employee: Employee) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={employee ? 'Editar Funcionário' : 'Novo Funcionário'}
        >
            <EmployeeForm 
                employeeToEdit={employee}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default EmployeeModal;
