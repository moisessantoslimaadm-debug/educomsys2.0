
import React from 'react';
import Modal from '../shared/Modal';
import LoanForm from './LoanForm';
import { BookLoan, Book, Student } from '../../types';

interface LoanModalProps {
    onClose: () => void;
    onSave: (loan: Omit<BookLoan, 'id' | 'status'>) => void;
    books: Book[];
    students: Student[];
}

const LoanModal: React.FC<LoanModalProps> = ({ onClose, onSave, books, students }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Novo Empréstimo">
            <LoanForm
                onSave={onSave}
                onCancel={onClose}
                books={books}
                students={students}
            />
        </Modal>
    );
};

export default LoanModal;
