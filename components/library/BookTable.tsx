
import React from 'react';
import { Book } from '../../types';
import { PencilIcon, TrashIcon } from '../icons/Icons';

interface BookTableProps {
    books: Book[];
    onEdit?: (book: Book) => void;
    onDelete?: (bookId: string) => void;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Capa</th>
                            <th scope="col" className="px-6 py-3">Título</th>
                            <th scope="col" className="px-6 py-3">Autor</th>
                            <th scope="col" className="px-6 py-3">Disponíveis / Total</th>
                            {onEdit && <th scope="col" className="px-6 py-3 text-center">Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? books.map((book) => (
                            <tr key={book.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                                <td className="px-6 py-4">
                                    <img src={book.coverUrl} alt={`Capa de ${book.title}`} className="h-16 w-12 object-cover rounded"/>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {book.title}
                                </th>
                                <td className="px-6 py-4">{book.author}</td>
                                <td className="px-6 py-4">{book.available} / {book.quantity}</td>
                                {onEdit && (
                                    <td className="px-6 py-4 flex items-center justify-center space-x-2">
                                        <button onClick={() => onEdit(book)} className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        {onDelete && (
                                            <button onClick={() => onDelete(book.id!)} className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 rounded-full transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={onEdit ? 5 : 4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Nenhum livro encontrado no acervo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookTable;
