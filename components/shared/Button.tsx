
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
        secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500",
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
