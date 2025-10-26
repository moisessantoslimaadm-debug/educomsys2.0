import React from 'react';
import Modal from '../shared/Modal';
import FinancialForm from './FinancialForm';
import { Transaction } from '../../types';

interface FinancialModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onSave: (transaction: Transaction) => void;
}

const FinancialModal: React.FC<FinancialModalProps> = ({ transaction, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={transaction ? 'Editar Lançamento' : 'Novo Lançamento Financeiro'}
        >
            <FinancialForm 
                transactionToEdit={transaction}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default FinancialModal;
