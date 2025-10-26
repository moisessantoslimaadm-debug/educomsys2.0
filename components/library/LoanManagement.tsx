import React, { useState, useEffect } from 'react';
import api, { logActivity } from '../../services/api';
import { BookLoan, Book, Student, User } from '../../types';
import Spinner from '../shared/Spinner';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icons';
import LoanTable from './LoanTable';
import LoanModal from './LoanModal';

interface LoanManagementProps {
    canManage: boolean;
    user: User;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ canManage, user }) => {
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [loansData, booksData, studentsData] = await Promise.all([
                    api.get<BookLoan[]>('/bookLoans'),
                    api.get<Book[]>('/books'),
                    api.get<Student[]>('/students'),
                ]);
                setLoans(loansData);
                setBooks(booksData);
                setStudents(studentsData);
            } catch (error) {
                console.error("Failed to fetch loan data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleSaveLoan = async (loan: Omit<BookLoan, 'id' | 'status'>) => {
        try {
            // In a real API, this would be a single transactional endpoint
            const book = books.find(b => b.id === loan.bookId);
            if (!book || book.available < 1) {
                throw "Livro não disponível para empréstimo.";
            }

            // Decrement book availability
            await api.put(`/books/${loan.bookId}`, { available: book.available - 1 });
            
            // Create new loan record
            const newLoan = await api.post<BookLoan>('/bookLoans', { ...loan, status: 'Emprestado' });

            // Refresh state
            setLoans(prev => [...prev, newLoan]);
            setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, available: b.available - 1 } : b));
            
            await logActivity('Novo Empréstimo', { bookId: loan.bookId, studentId: loan.studentId });
            setIsModalOpen(false);
        } catch (e) {
            console.error("Erro na transação de empréstimo: ", e);
            alert(e);
        }
    };

    const handleReturnLoan = async (loan: BookLoan) => {
        if (loan.status === 'Devolvido') return;

         try {
            // Transaction simulation
            const book = books.find(b => b.id === loan.bookId);
            if (book) {
                 await api.put(`/books/${loan.bookId}`, { available: book.available + 1 });
            }
            
            const updatedLoan = await api.put<BookLoan>(`/bookLoans/${loan.id}`, { status: 'Devolvido', returnDate: new Date().toISOString() });

            setLoans(prev => prev.map(l => l.id === loan.id ? updatedLoan : l));
            if (book) {
                setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, available: b.available + 1 } : b));
            }

            await logActivity('Devolução de Livro', { loanId: loan.id, bookId: loan.bookId });
        } catch (e) {
            console.error("Erro na transação de devolução: ", e);
            alert("Erro ao processar devolução.");
        }
    };
    
    const userLoans = user.studentId ? loans.filter(loan => loan.studentId === user.studentId) : loans;

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Empréstimos de Livros</h2>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie os empréstimos e devoluções.</p>
                </div>
                {canManage && (
                    <Button onClick={handleOpenModal}>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        <span>Novo Empréstimo</span>
                    </Button>
                )}
            </div>

            <LoanTable
                loans={userLoans}
                books={books}
                students={students}
                onReturn={canManage ? handleReturnLoan : undefined}
            />

            {isModalOpen && canManage && (
                <LoanModal
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveLoan}
                    books={books.filter(b => b.available > 0)}
                    students={students}
                />
            )}
        </div>
    );
};

export default LoanManagement;