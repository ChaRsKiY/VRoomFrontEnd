'use client'

import React  from 'react'
import { useEffect, useState, useRef } from 'react';


interface ICreatePostProps {
   id:number;
}

const CreatePost: React.FC<ICreatePostProps> = ({ id }) => {
    
    const [inputValue, setInputValue] = useState('');
    const [lineColor, setLineColor] = useState('lightgray');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
       
        setInputValue(event.target.value);   
      };
    

    const handleFocus = () => {
        setLineColor('black');  
      };
    
      const handleBlur = () => {
        setLineColor('lightgray'); 
      };
      
      useEffect(() => {    
          setLineColor('lightgray');
      },[id]);

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'; // Сбрасываем высоту
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Устанавливаем высоту в зависимости от содержимого
        }
      }, [inputValue]);
    return (
        <div className="flex w-full mt-20">
           
            <div className="w-3/4 px-8">
            <div>Write the text:</div>
       <textarea
       ref={textareaRef}
       value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        style={{
          border: 'none',
          borderBottom: `2px solid ${lineColor}`,
          outline: 'none',
          width: '100%',
          resize: 'none',   
          overflow: 'hidden', 
          padding: '5px', 
          height:'30px',
          minHeight: '30px',
        }}
      />
            </div>
            <div>

            </div>
        </div>
    )
}

export default CreatePost