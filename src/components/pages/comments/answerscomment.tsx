'use client'
import React from 'react';
import { ICommentVideo } from '@/types/commentvideo.interface';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {SlDislike, SlLike} from "react-icons/sl";
import { useUser } from '@clerk/nextjs';
import { FiCornerDownRight } from 'react-icons/fi';
import { FiFlag } from 'react-icons/fi';
import MyAnswerComment from '@/components/pages/comments/myanswercomment'
import { comment } from 'postcss';
import  { useRef } from 'react';
import { IUser } from '@/types/user.interface';
import { IAnswerCommentVideo } from '@/types/answercommentvideo.interface';

interface CommentsProps {
  commentId: number;
}

const getTimeAgo = (date: string | Date) => {
    const commentDate = new Date(date + "Z");
    const now = new Date();    
    const diffMs = now.getTime() - commentDate.getTime(); // Разница в миллисекундах
    const diffMinutes = Math.floor(diffMs / 60000); // Преобразуем миллисекунды в минуты
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);  
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }


const AnswersComments: React.FC<CommentsProps> = ({ commentId }) => {

    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
    const {user}=useUser();
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({}); 
    const [lineColor, setLineColor] = useState('lightgray');
    const [isExpanded, setIsExpanded] = useState(false); // Состояние для управления раскрытием поля
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    // const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(comments.length).fill(false));
    const [rows,setRows] =useState(1);
    const [iAmUser, setUser] = useState<IUser | null>(null);
    const [visibleInput, setVisibleInput] = useState<number | null>(null); 
    const [answers, setAnswers] = useState<IAnswerCommentVideo[]>([]);
  
  

    const getUser = async () => {
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

    const getAnswerss = async () => {
      try {
        const response = await fetch('https://localhost:7154/api/AnswerVideo/getbycommentid/' + commentId, {
          method: 'GET',
        });
  
        if (response.ok) {
          const data: IAnswerCommentVideo[] = await response.json();
          setAnswers(data);
  
  
          console.log('Комментарии успешно получены:', data);
        } else {
          console.error('Ошибка при отправке комментария:', response.statusText);
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

const handleInputChange = (index: number, value: string) => {
    setInputValues({  [index]: value }); // Обновляем значение конкретного поля
  };
  
  const handleCancel = () => {
    setVisibleInput(null); // Скрываем текущее текстовое поле
  };
    const handleReplayClick = (index: number) => {
      setVisibleInput(visibleInput === index ? null : index); // Переключаем видимость конкретного поля
    };
  
   
  const  dislike= async (id: number, userid:string  )=>{
    if(user){ 
    try {
      
      const response = await fetch('https://localhost:7154/api/AnswerVideo/dislike/'+id +'/'+ user.id +'/'+ userid, {
        method: 'PUT',
      });

      if (response.ok) {
       console.log('успешный лайк');
      } else {
        console.error('Ошибка при like:', response.statusText);
      }
    
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }}
        
  }
  const like = async (id: number, userid:string ) => {
    if(user){ 
    try {     
      const response = await fetch('https://localhost:7154/api/AnswerVideo/like/'+id +'/'+ user.id +'/'+ userid, {
        method: 'PUT',
      });

      if (response.ok) {
       console.log('успешный лайк');
      } else {
        console.error('Ошибка при like:', response.statusText);
      }
    
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }}
  }; 

  

  return (
   
    <div style={{width:'100%'}}>
      {answers.length > 0 ? (
        answers.map((comment, index) => (
            <div style={{width:'100%'}}>
          <div key={comment.commentVideo_Id} style={{display:'flex'}}>
            <div>
             <img
              src={avatars[comment.userId]  || comment.channelBanner}
              alt=""
              width="40px"
              height="40px"
              style={{ borderRadius: '50%', marginRight: '10px' }}
            /></div>
            <div style={{width:'100%'}}>
            <div style={{paddingLeft:'0px' }}>
              <Link  href='#' style={{paddingRight:'20px',fontWeight:'bolder' }}>@{comment.userName}</Link>
             <small>{getTimeAgo(comment.answerDate)}</small>
             </div>
            
             <textarea
                  style={{
                    border: 'none',
                    fontSize: '16px',
                    padding: '5px',
                    height: 'auto',
                    resize: 'none',
                    wordWrap: 'break-word',
                     width: '100%',
                     backgroundColor:'white'
                  }}
                  disabled
                  value={comment.text}
                  readOnly
                  rows={1} // Минимальное количество строк
                />
        
{/* 
              { !expandedStates[index] && (
                  <button onClick={() => toggleExpand(index)} style={{ marginTop: '5px' }}>
                    Показать больше
                  </button>
                )}

                {expandedStates[index] && (
                  <button onClick={() => toggleExpand(index)} style={{ marginTop: '5px' }}>
                    Свернуть
                  </button>
                )} */}
            </div>
            </div>
            <div className="flex items-center space-x-8" style={{paddingLeft:"50px"}}>
                    <div className="flex items-center space-x-2.5">
                        <SlLike onClick={() => like(comment.id, comment.userId )} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.likeCount !== 0 && comment.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike onClick={() => dislike(comment.id, comment.userId)} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.dislikeCount !== 0 && comment.dislikeCount}</div>
                    </div>
                  
                    <div className="flex items-center space-x-2"  onClick={() => handleReplayClick(index)}>
                    <FiCornerDownRight size={18} />
                    <span style={{fontSize:"14px"}}>Replay</span>               
                 </div>
              
                 <div className="flex items-center space-x-2">
                  <FiFlag size={16} /> {/* Иконка флажка */}
                   <span style={{fontSize:"14px"}}>Report</span>
                  </div>
             </div>

             {/* <AnswerComment commentId={comment.id}   /> */}

             
             {visibleInput === index && (
             <>
               <MyAnswerComment commentId={comment.id}   onCancel={handleCancel} /> 
           </>
          )}
        
           <br />
       
          </div>
        ))
      ) : (
        <p>no comments</p>
      )}
    </div>
  );
}

export default AnswersComments;