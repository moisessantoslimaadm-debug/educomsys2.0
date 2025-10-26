import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                return storedTheme;
            }
            if (storedTheme === 'system') {
                 return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
        }
        return 'light';
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return React.createElement(ThemeContext.Provider, { value: value }, children);
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};