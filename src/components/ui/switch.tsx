"use client";
import React, { useState, useEffect } from 'react';

interface SwitchProps {
    defaultChecked?: boolean;
    onCheckedChange: (checked: boolean) => void; // Явне оголошення типу
}

export function Switch({ defaultChecked, onCheckedChange }: SwitchProps) {
    const [checked, setChecked] = useState(defaultChecked);


    const handleChange = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        onCheckedChange(newChecked); // Передача значення зміни
    };

    useEffect(() => {
        setChecked(defaultChecked);
    }, [defaultChecked]);

    return (
        <button
            onClick={handleChange}
            className={`relative w-12 h-6 bg-gray-300 rounded-full transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
            style={{
                backgroundColor: checked ? 'rgba(0, 128, 0, 0.5)' : '#D1D5DB'
            }}
        >
            <span
                className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );
}