import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { Book } from '../../types';
import Spinner from '../shared/Spinner';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icons';
import BookTable from './BookTable';
import BookModal from './BookModal';

interface BookManagementProps {
    canManage: boolean;
}

const BookManagement: React.FC<BookManagementProps> = ({ canManage }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await api.get<Book[]>('/books');
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleOpenModal = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    const handleEditBook = (book: Book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleDeleteBook = async (bookId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este livro?")) {
            try {
                const bookTitle = books.find(b => b.id === bookId)?.title || 'N/A';
                await api.delete(`/books/${bookId}`);
                setBooks(prev => prev.filter(b => b.id !== bookId));
                await logActivity('Exclusão de Livro', { bookId, title: bookTitle });
            } catch (error) {
                console.error("Failed to delete book:", error);
                alert("Falha ao excluir livro.");
            }
        }
    };

    const handleSaveBook = async (book: Omit<Book, 'id' | 'available'>) => {
        const bookData = { ...book, available: book.quantity }; // Assume all are available when adding/editing quantity
        
        try {
            if (editingBook?.id) {
                const updatedBook = await api.put<Book>(`/books/${editingBook.id}`, bookData);
                setBooks(prev => prev.map(b => b.id === editingBook.id ? updatedBook : b));
                await logActivity('Atualização de Livro', { bookId: editingBook.id, title: bookData.title });
            } else {
                const newBook = await api.post<Book>('/books', bookData);
                setBooks(prev => [...prev, newBook]);
                await logActivity('Criação de Livro', { bookId: newBook.id, title: bookData.title });
            }
            setIsModalOpen(false);
            setEditingBook(null);
        } catch (error) {
            console.error("Failed to save book:", error);
            alert("Falha ao salvar livro.");
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Acervo da Biblioteca</h2>
                    <p className="text-gray-500 dark:text-gray-400">Consulte, adicione e gerencie os livros disponíveis.</p>
                </div>
                {canManage && (
                    <Button onClick={handleOpenModal}>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        <span>Adicionar Livro</span>
                    </Button>
                )}
            </div>

            <BookTable
                books={books}
                onEdit={canManage ? handleEditBook : undefined}
                onDelete={canManage ? handleDeleteBook : undefined}
            />

            {isModalOpen && canManage && (
                <BookModal
                    book={editingBook}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveBook}
                />
            )}
        </div>
    );
};

export default BookManagement;