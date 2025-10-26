import React from 'react';
import Modal from '../shared/Modal';
import InvoiceForm from './InvoiceForm';
import { Invoice, Student } from '../../types';

interface InvoiceModalProps {
    invoice: Invoice | null;
    onClose: () => void;
    onSave: (invoice: Omit<Invoice, 'id'>) => void;
    students: Student[];
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose, onSave, students }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={invoice ? 'Editar Fatura' : 'Nova Fatura'}
        >
            <InvoiceForm
                invoiceToEdit={invoice}
                onSave={onSave}
                onCancel={onClose}
                students={students}
            />
        </Modal>
    );
};

export default InvoiceModal;
