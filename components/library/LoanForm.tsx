
import React, { useState } from 'react';
import { BookLoan, Book, Student } from '../../types';
import Select from '../shared/Select';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface LoanFormProps {
    onSave: (loan: Omit<BookLoan, 'id' | 'status'>) => void;
    onCancel: () => void;
    books: Book[];
    students: Student[];
}

const LoanForm: React.FC<LoanFormProps> = ({ onSave, onCancel, books, students }) => {
    const [formData, setFormData] = useState({
        bookId: '',
        studentId: '',
        loanDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="Livro" id="bookId" name="bookId" value={formData.bookId} onChange={handleChange} required>
                <option value="">Selecione um livro</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title} (Autor: {b.author})</option>)}
            </Select>
             <Select label="Aluno" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} required>
                <option value="">Selecione um aluno</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <div className="grid grid-cols-2 gap-4">
                <Input label="Data do Empréstimo" id="loanDate" name="loanDate" type="date" value={formData.loanDate} onChange={handleChange} required />
                <Input label="Data de Devolução" id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">Registrar Empréstimo</Button>
            </div>
        </form>
    );
};

export default LoanForm;
