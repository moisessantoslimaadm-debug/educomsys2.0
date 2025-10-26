
import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface BookFormProps {
    bookToEdit: Book | null;
    onSave: (book: Omit<Book, 'id' | 'available'>) => void;
    onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ bookToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        coverUrl: '',
        quantity: 1,
    });

    useEffect(() => {
        if (bookToEdit) {
            setFormData({
                title: bookToEdit.title,
                author: bookToEdit.author,
                isbn: bookToEdit.isbn,
                coverUrl: bookToEdit.coverUrl,
                quantity: bookToEdit.quantity,
            });
        }
    }, [bookToEdit]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título" id="title" name="title" value={formData.title} onChange={handleChange} required />
            <Input label="Autor" id="author" name="author" value={formData.author} onChange={handleChange} required />
            <Input label="ISBN" id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
            <Input label="URL da Capa" id="coverUrl" name="coverUrl" value={formData.coverUrl} onChange={handleChange} />
            <Input label="Quantidade" id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required min="1" />
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};

export default BookForm;
