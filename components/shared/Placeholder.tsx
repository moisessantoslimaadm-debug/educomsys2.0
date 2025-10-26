import React from 'react';

interface PlaceholderProps {
    icon: React.ReactNode;
    title: string;
    message: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ icon, title, message }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[60vh] bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-300 mb-4">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">{message}</p>
        </div>
    );
};

export default Placeholder;
