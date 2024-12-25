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
        <div style={{marginTop:'-10px'}}>
        <button
            onClick={handleChange}
            className={`relative w-3 h-3 bg-gray-300 rounded-full transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
            style={{maxHeight:"10px",
                backgroundColor: checked ? 'rgba(0, 128, 0, 1)' : '#D1D5DB'
            }}
        >
            <span
                className={`block w-3 h-3 bg-white rounded-full shadow transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
        </div>
    );
}