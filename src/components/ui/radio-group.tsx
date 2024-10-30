import React, { ReactElement, ReactNode } from "react";

// Типізація для RadioGroup
interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactElement<RadioGroupItemProps>[]; // Діти компонента мають бути масивом RadioGroupItem
  className?: string; // className є необов'язковим
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onValueChange, children, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Оскільки ми знаємо, що child — це RadioGroupItem, ми передаємо властивості
          return React.cloneElement(child, { selectedValue: value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  children: ReactNode; 
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, id, selectedValue, onValueChange, children }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        value={value}
        checked={selectedValue === value}
        onChange={() => onValueChange(value)}
        className="form-radio"
      />
      <label htmlFor={id} className="text-sm">{children}</label>
    </div>
  );
};