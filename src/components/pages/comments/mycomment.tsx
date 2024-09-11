
'use client'
import { useEffect, useState } from 'react';
import  { useUser }  from '@clerk/nextjs';
import Link from "next/link";
import { FaSmile } from 'react-icons/fa';
import React, { useRef } from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface'

interface MyCommentProps {
  videoId: number; // Типизация для пропса clerkId
}

const MyComment : React.FC<MyCommentProps> = ( {videoId}) => {

  const [avatarUrl, setAvatarUrl] = useState('');
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [display, setDisplay] = useState('');
  const [display2, setDisplay2] = useState('');
  const [displayMain, setDisplayMain] = useState('block');
  const [write, setWrite] = useState('');
  const {user} = useUser(); 
  const [inputValue, setInputValue] = useState('');
  const [lineColor, setLineColor] = useState('lightgray');
  const [isHovered, setIsHovered] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [videoid, setVideoId] = useState(0);
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

    //const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      // setInputValue(event.target.value);
      // if(inputValue==''||event.target.value=='')
      //   setDisabled(true);
      // else
      //   setDisabled(false);
    // };
  
    const handleSubmit = async () => {

      const comment: ICommentVideo = {
        userId: userId,  
        videoId: videoid,   
        comment: inputValue,
        date: new Date(),  
        likeCount: 0,
        dislikeCount: 0,
        isPinned: false,
        isEdited: false,
      };
      try {
        const response = await fetch('https://localhost:7154/api/CommentVideo/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comment), 
        });
  
        if (response.ok) {
          setWrite('comment sent successfully, write new here');
          setInputValue('');
          setDisplay('none');
          setDisplay2('block'); 
          const data = await response.json();
          console.log('Комментарий успешно отправлен:', data);
         

        } else {
          setWrite('error sending');
          console.error('Ошибка при отправке комментария:', response.statusText);
        }
      } catch (error) {
        setWrite('error sending');
        console.error('Ошибка при подключении к серверу:', error);
      }
    };


    const handleCancel = () => {
      setInputValue('');
      setDisplay('none');
      setDisplay2('block');  
      setWrite('write your comments here');
    };
  
  const toWrite=()=>{
     setDisplay('block');
     setDisplay2('none'); 
     if (inputRef.current) {
      inputRef.current.focus(); 
    }
    };

  useEffect(() => {    
      try {
        if(user) { 
            setVideoId(videoId);
            setDisplay('none');
            setDisplay2('block');
            setWrite('write your comments here');
            setUserId(user?.id);
             setAvatarUrl(user?.imageUrl) ; 
             if(user?.firstName )
             setFullName(user?.firstName + user?.lastName);
            }  
          else{ 
            setDisplayMain('none');}

      } catch (error) {
        console.error('Ошибка при получении профиля пользователя:', error);
      }
   
  },[videoId]);


  
  return (
    <div  style={{display: displayMain }}>
      <div style={{display }}>
        You are writing comment in account:
      </div>
    <div style={{ display: 'flex', alignItems: 'center',width:'100%' }}>    
     
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="User Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
        />
      ) : (
        <p>Аватарка не найдена</p>
      )}
       <span style={{display }}>{fullName}&nbsp;&nbsp;</span> 
       <div onClick={toWrite} style={{display: display2, width:'100%', border: 'none',
          borderBottom: `2px solid ${lineColor}`}}>
        <span > {write}</span>
        </div>          
    </div>
    <div style={{display }}>
      <div>
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
        flexWrap:'wrap'
      }}
    />
  
      </div>
      <div style={{display:'flex', width:'100%',justifyContent:'space-between'}}>
        <div style={{display:'flex'}}>
        <div style={{margin:'5px'}}>
           <FaSmile size={30} color="lightgray" />
       </div>
       <div style={{ marginLeft:'20px'}}>
          <div style={{ fontSize:'11px'}}>By sending a comment, you agree to</div>
         <Link href="http://localhost:3000/ru/termsofservice" passHref target="_blank" rel="noopener noreferrer" style={{color:'blue', fontSize:'11px'}} >     
            VRoom's Terms of Service.</Link>
        </div>
        </div>
      <div >
      <button onClick={handleCancel}   style={isHovered ? { ...buttonCancelStyles.base, ...buttonCancelStyles.hover } : buttonCancelStyles.base}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>Cancel</button>
      <button onClick={handleSubmit} disabled={disabled} style={ !disabled ? {...buttonSubmitStyles.base} :buttonSubmitStyles.disab}>Send Comment</button>
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
    backgroundColor: 'blue',  
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

export default MyComment;


{/* <textarea
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={1}
        style={{
          border: 'none',
          borderBottom: `2px solid ${lineColor}`,
          outline: 'none',
          width: '750px',
          resize: 'none',  // Запрещаем изменять размер
          overflow: 'hidden', // Скрываем скролл
        }}
      /> */}

     {/* <textarea
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={1} // Ограничиваем до одной строки
        style={{
          border: 'none',
          borderBottom: `2px solid ${lineColor}`,
          outline: 'none',
          width: '100%',
         // Высота одной строки, чтобы текст корректно отображался
          resize: 'none',   // Запрещаем изменять размер
          overflow: 'hidden', // Скрываем скролл
          padding: '5px' // Немного пространства для ввода
        }}
      />*/}


    