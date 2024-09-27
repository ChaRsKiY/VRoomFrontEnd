'use client'

import { useEffect, useState } from 'react';
import React, { useRef } from 'react';
import {IAnswerCommentVideo} from '@/types/answercommentvideo.interface';
import { buttonSubmitStyles } from '@/components/styled/buttonstyles/buttonSubmitStyles';
import {buttonCancelStyles} from'@/components/styled/buttonstyles/buttonCancelStyles';

interface MyCommentProps {
    answer: IAnswerCommentVideo; 
     onClose: () => void;
}

const EditAnswer : React.FC<MyCommentProps> = ( {answer, onClose}) => {

  const [inputValue, setInputValue] = useState(answer.text);
  const [lineColor, setLineColor] = useState('lightgray');
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  

    const handleFocus = () => {
      setLineColor('black');  
    };
  
    const handleBlur = () => {
      setLineColor('lightgray'); 
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      if(inputValue==''||event.target.value=='')
        setDisabled(true);
      else
        setDisabled(false);
    };

    const handleSubmit = async () => {

      const answer2: IAnswerCommentVideo = {
        id:answer.id,
        userId: answer.userId,  
        commentVideo_Id: answer.commentVideo_Id,  
        channelBanner: answer.channelBanner, 
        text: inputValue,
        answerDate: answer.answerDate,  
        likeCount: answer.likeCount,
        dislikeCount: answer.dislikeCount,
        isEdited: true,
        userName: answer.userName
      };
      try {
        const response = await fetch('https://localhost:7154/api/AnswerVideo/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answer2), 
        });
  
        if (response.ok) {
          onClose();
          const data = await response.json();
          console.log('Комментарий успешно изменен:', data);
        } else {           
          console.error('Ошибка при отправке комментария:', response.statusText);
        }
      } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
      }
    };

  useEffect(() => {    
    setTimeout(() => {
        inputRef.current?.focus(); // Переводим фокус на input
      }, 0);     
  },[answer]);


  
  return (
    <div  >
     
    
    <div >
      <div >
      <input
      type="text"
      value={inputValue}
      onChange={handleChange}
       onFocus={handleFocus}
      onBlur={handleBlur}
      ref={inputRef}
      style={{
        border: 'none',
        borderBottom: `2px solid ${lineColor}`, 
        outline: 'none', 
        width: '100%',
        display:'flex',
        flexWrap:'wrap',
        paddingLeft:'10px',
        
      }}
    />


      </div>
      <div style={{display:'flex', width:'100%',justifyContent:'space-around'}}>
       
      <div >
      <button onClick={onClose}   style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>Cancel</button>
      <button onClick={handleSubmit} disabled={disabled} style={ !disabled ? {...buttonSubmitStyles.base} :buttonSubmitStyles.disab}>Edit Comment</button>
      </div>
      </div>
      </div>
 

    </div>
  );
};

// const buttonCancelStyles: { [key: string]: React.CSSProperties } = {
//   base: {
//     backgroundColor: 'white',   
//     border: 'none',           
//     color: 'black',            
//     padding: '2px 20px',
//     margin: '5px',         
//     borderRadius: '50px',      
//     cursor: 'pointer',          
//     fontSize: '16px', 
//     fontWeight:'bold' ,         
//     transition: 'background-color 0.3s ease',  
//   },
//   hover: {
//     backgroundColor: 'lightgray',  
//   },
// };
// const buttonSubmitStyles: { [key: string]: React.CSSProperties } = {
//   base: {
//     backgroundColor: 'RoyalBlue',  
//     border: 'none',             
//     color: 'white',           
//     padding: '2px 20px',
//     margin: '5px',        
//     borderRadius: '50px',                
//     fontSize: '16px', 
//     fontWeight:'bold'         
      
//   },
//   disab:{
//     backgroundColor: 'lightgray',
//     border: 'none',            
//     color: 'white',            
//     padding: '2px 20px',  
//     margin: '5px',    
//     borderRadius: '50px',              
//     fontSize: '16px', 
//     fontWeight:'bold' 
//   }
// };

export default EditAnswer;