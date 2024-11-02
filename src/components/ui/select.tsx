import React, { useState, ReactNode } from 'react';

interface SelectProps {
  children: ReactNode; 
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
  onSelect: (value: string) => void; 
}

export const Select = ({ children }: { children: React.ReactNode }) => {
    return <div className="relative inline-block w-full">{children}</div>;
  };
  
  export const SelectTrigger = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
    return (
      <button
        onClick={onClick}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </button>
    );
  };

  export const SelectContent = ({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) => {
    return (
      isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {children}
        </div>
      )
    );
  };

  export const SelectValue = ({ value, placeholder }: { value: string | null, placeholder: string }) => {
    return <span>{value || placeholder}</span>;
  };

  export const SelectItem = ({ value, onClick, children }: { value: string, onClick: () => void, children: React.ReactNode }) => {
    return (
      <div
        onClick={onClick}
        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
      >
        {children}
      </div>
    );
  };