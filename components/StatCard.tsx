
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'purple';
    onClick?: () => void;
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => {
    const interactionClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all transform hover:-translate-y-1' : '';

    return (
        <div 
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4 ${interactionClasses}`}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyPress={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    onClick();
                }
            }}
        >
            <div className={`p-4 rounded-full ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;