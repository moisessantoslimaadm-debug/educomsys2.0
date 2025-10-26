
import React from 'react';
import Modal from '../shared/Modal';
import BookForm from './BookForm';
import { Book } from '../../types';

interface BookModalProps {
    book: Book | null;
    onClose: () => void;
    onSave: (book: Omit<Book, 'id' | 'available'>) => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose, onSave }) => {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={book ? 'Editar Livro' : 'Adicionar Novo Livro'}
        >
            <BookForm
                bookToEdit={book}
                onSave={onSave}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default BookModal;
