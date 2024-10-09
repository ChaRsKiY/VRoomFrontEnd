"use client"

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
    theme: 'light'
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};
