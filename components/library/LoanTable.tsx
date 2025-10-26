
import React from 'react';
import { BookLoan, Book, Student } from '../../types';
import Button from '../shared/Button';

interface LoanTableProps {
    loans: BookLoan[];
    books: Book[];
    students: Student[];
    onReturn?: (loan: BookLoan) => void;
}

const LoanTable: React.FC<LoanTableProps> = ({ loans, books, students, onReturn }) => {

    const getBookTitle = (id: string) => books.find(b => b.id === id)?.title || 'N/A';
    const getStudentName = (id: string) => students.find(s => s.id === id)?.name || 'N/A';

    const getStatusChip = (status: 'Emprestado' | 'Devolvido') => {
        const base = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'Emprestado': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
            case 'Devolvido': return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
        }
    };
    
    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Livro</th>
                            <th scope="col" className="px-6 py-3">Aluno</th>
                            <th scope="col" className="px-6 py-3">Data Empréstimo</th>
                            <th scope="col" className="px-6 py-3">Data Devolução</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            {onReturn && <th scope="col" className="px-6 py-3 text-center">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium">{getBookTitle(loan.bookId)}</td>
                                <td className="px-6 py-4">{getStudentName(loan.studentId)}</td>
                                <td className="px-6 py-4">{new Date(loan.loanDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{new Date(loan.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className={getStatusChip(loan.status)}>{loan.status}</span></td>
                                {onReturn && (
                                    <td className="px-6 py-4 text-center">
                                        {loan.status === 'Emprestado' && (
                                            <Button variant="secondary" onClick={() => onReturn(loan)}>Devolver</Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                         {loans.length === 0 && (
                            <tr><td colSpan={onReturn ? 6 : 5} className="text-center py-6">Nenhum empréstimo registrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LoanTable;
