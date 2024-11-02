// components/ui/card.tsx

import React, { ReactNode } from "react";

// Тип для children, який приймає будь-який React елемент
interface CardProps {
  children: ReactNode;
  className?: string;
}

// Головний контейнер Card
export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// Header картки, де зазвичай знаходиться заголовок
export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
  );
};

// Title компоненту
export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
};

// Контент, основна частина картки
export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

// Footer картки, для кнопок чи інших додаткових елементів
export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 border-t ${className}`}>
      {children}
    </div>
  );
};
