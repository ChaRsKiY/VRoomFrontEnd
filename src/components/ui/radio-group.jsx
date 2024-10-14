import React, { useState } from "react";

export const RadioGroup = ({ value, onValueChange, children, className }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { selectedValue: value, onValueChange });
      })}
    </div>
  );
};

export const RadioGroupItem = ({ value, id, selectedValue, onValueChange, children }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        value={value}
        checked={selectedValue === value}
        onChange={() => onValueChange(value)}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {children}
      </label>
    </div>
  );
}