import React from "react";

export const RadioGroup = ({ value, onValueChange, children, className }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedValue: value, onValueChange });
        }
        return child;
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
        className="form-radio"
      />
      <label htmlFor={id} className="text-sm">{children}</label>
    </div>
  );
};