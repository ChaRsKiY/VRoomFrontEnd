'use client'
import { useEffect, useState } from 'react';
import  { useUser }  from '@clerk/nextjs';
import Link from "next/link";
import { FaSmile } from 'react-icons/fa';
import React, { useRef } from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface'
import { IUser } from '@/types/user.interface';

interface MyCommentProps {
    comment: ICommentVideo; 
    // index:number;
  onClose: () => void;
}

const EditComment : React.FC<MyCommentProps> = ( {comment, onClose}) => {

  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [display, setDisplay] = useState('');
  const [display2, setDisplay2] = useState('');
  const [displayMain, setDisplayMain] = useState('block');
  const [write, setWrite] = useState('Write a comment...');
  const [inputValue, setInputValue] = useState(comment.comment);
  const [lineColor, setLineColor] = useState('lightgray');
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const getUser = async (user: any, setUser: (prev: IUser) => void) => {
    try {
        if(user){
            const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfochannel/' + user?.id, {
                method: 'GET',
            });

            if (response.ok) {
                const data: IUser = await response.json();
                setUser(data);
            } else {
                console.error('Ошибка при получении пользователя:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
    }
};

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

    // const handleChange2 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
       
    //     setInputValue(event.target.value);  
    //     if(inputValue==''||event.target.value=='')
    //         setDisabled(true);
    //       else
    //         setDisabled(false); 
    //   };
  
    const handleSubmit = async () => {

      const comment2: ICommentVideo = {
        id:comment.id,
        userId: comment.userId,  
        videoId: comment.videoId,  
        channelBanner:comment.channelBanner, 
        comment: inputValue,
        date: comment.date,  
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
        isPinned: comment.isPinned,
        isEdited: true,
        userName:comment.userName
      };
      try {
        const response = await fetch('https://localhost:7154/api/CommentVideo/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment2), 
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


    // const handleCancel = () => {
    //   setInputValue('');
      
    //   setWrite('Write a comment...');
    // };
  

  useEffect(() => {    
    setTimeout(() => {
        inputRef.current?.focus(); // Переводим фокус на input
      }, 0);     
  },[comment]);


  
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

const buttonCancelStyles: { [key: string]: React.CSSProperties } = {
  base: {
    backgroundColor: 'white',   
    border: 'none',           
    color: 'black',            
    padding: '2px 20px',
    margin: '5px',         
    borderRadius: '50px',      
    cursor: 'pointer',          
    fontSize: '16px', 
    fontWeight:'bold' ,         
    transition: 'background-color 0.3s ease',  
  },
  hover: {
    backgroundColor: 'lightgray',  
  },
};
const buttonSubmitStyles: { [key: string]: React.CSSProperties } = {
  base: {
    backgroundColor: 'RoyalBlue',  
    border: 'none',             
    color: 'white',           
    padding: '2px 20px',
    margin: '5px',        
    borderRadius: '50px',                
    fontSize: '16px', 
    fontWeight:'bold'         
      
  },
  disab:{
    backgroundColor: 'lightgray',
    border: 'none',            
    color: 'white',            
    padding: '2px 20px',  
    margin: '5px',    
    borderRadius: '50px',              
    fontSize: '16px', 
    fontWeight:'bold' 
  }
};

export default EditComment;

