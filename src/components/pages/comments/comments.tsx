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
import AnswersComments from './answerscomment';
import { IAnswerCommentVideo } from '@/types/answercommentvideo.interface';
import { MdMoreVert } from 'react-icons/md'; 
import RadioButtonList from '@/components/pages/comments/report';

interface CommentsProps {
  comments: ICommentVideo[];
  answers: {[key: number]: IAnswerCommentVideo[]};
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


const Comments: React.FC<CommentsProps> = ({ comments, answers }) => {

    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
    const {user}=useUser();
    const [inputValues, setInputValues] = useState<{ [key: number]: string }>({}); 
    const [lineColor, setLineColor] = useState('lightgray');
    const [isExpanded, setIsExpanded] = useState(false); // Состояние для управления раскрытием поля
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(comments.length).fill(false));
    const [rows,setRows] =useState(1);
    const [iAmUser, setUser] = useState<IUser | null>(null);
    const [visibleInput, setVisibleInput] = useState<number | null>(null); 
    const [isTextOverflowing, setIsTextOverflowing] = useState<boolean[]>([]);
    const textAreasRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
    const [display2, setDisplay2] = useState('none'); 
    const [display1, setDisplay1] = useState('block'); 
    const [reportMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null); // Индекс активного меню

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

// const videoId=1;
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
      
      const response = await fetch('https://localhost:7154/api/CommentVideo/dislike/'+id +'/'+ user.id +'/'+ userid, {
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
      const response = await fetch('https://localhost:7154/api/CommentVideo/like/'+id +'/'+ user.id +'/'+ userid, {
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
  
  const toggleExpand = (index: number) => {
    setDisplay2('none');
    setDisplay1('block');
    setExpandedStates((prevState) =>     
      prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
    );
    setReportMenuOpenIndex(null);
  };

 
  const openReport = () => {
   setDisplay2('block');
   setDisplay1('none');
  };

  const closeReport = () => {
    setDisplay1('block');
    setDisplay2('none');
    setReportMenuOpenIndex(null);
   };

  useEffect(() => {    
    setExpandedStates(Array(comments.length).fill(false)); 
    },[comments]);

    useEffect(() => {
      // Проверяем, все ли текстовые области помещают текст
      const overflowStatuses = textAreasRefs.current.map((textarea) => {
        if (textarea) {
          return textarea.scrollHeight > textarea.clientHeight; // Возвращает true, если есть скролл
        }
        return false;
      });
      setIsTextOverflowing(overflowStatuses); // Обновляем состояние
    }, [comments]);


    const toggleReportMenu = (index: number, event: React.MouseEvent) => {
      // const { clientX, clientY } = event; // Получаем координаты клика
      // setMenuPosition({ top: clientY, left: clientX }); // Устанавливаем позицию меню
      setDisplay2('none');
      setDisplay1('block');
      if (reportMenuOpenIndex === index) {
        setReportMenuOpenIndex(null); // Закрываем, если уже открыто
      } else {
        setReportMenuOpenIndex(index); // Открываем для конкретного элемента
      }
    };

  return (
   
    <div style={{width:'100%'}} >
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div style={{display:'flex'}}>
            <div style={{width:'100%'}}>
          <div key={comment.videoId} style={{display:'flex'}}>
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
             <small>{getTimeAgo(comment.date)}</small>
             </div>
             <div key={index} style={{ marginBottom: '20px' }}>
             <textarea
                 ref={(el) => {
                  textAreasRefs.current[index] = el; // Присваиваем реф каждому textarea
                }}
                  style={{
                    border: 'none',
                    fontSize: '16px',
                    padding: '5px', 
                    paddingBottom:'0px',       
                    resize: 'none',
                    display: expandedStates[index] ? 'none' : 'block',
                    overflow: expandedStates[index] ? 'auto' : 'hidden', // Скроллинг при раскрытии
                    wordWrap: 'break-word',
                     width: '100%',
                     backgroundColor:'white',
                     maxHeight:'50px',
                     marginBottom:'-20px'
                  }}
                  disabled
                  value={comment.comment}
                  readOnly
                  rows={1}                        
                />
                </div>
                   <p  style={{ display: expandedStates[index] ? 'block' : 'none'}}>
                    { comment.comment}
                   </p>
                   <div style={{fontWeight:'bold',paddingLeft:'15px', color:'gray'}}>
                   {isTextOverflowing[index] &&  
               !expandedStates[index] && (
                  <button onClick={() => toggleExpand(index)} >
                    Read more
                  </button>
                )}

                { isTextOverflowing[index] && expandedStates[index] && (
                  <button onClick={() => toggleExpand(index)} >
                    Collapse
                  </button>
                )}
                 </div>
            </div>
            </div>
            <div className="flex items-center space-x-8" style={{paddingLeft:"55px"}}>
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
              
                 {/* <div className="flex items-center space-x-2">
                  <FiFlag size={16} />
                   <span style={{fontSize:"14px"}}>Report</span>
                  </div> */}
                   {comment.userId === user?.id && (
                   <>
                  <button style={{fontSize:'11px'}} >
                    Edit</button>
                  </>
                )}
             </div>
             
             {visibleInput === index && (
             <>
              <br />
               <MyAnswerComment commentId={comment.id}   onCancel={handleCancel} /> 
             </>
            )}
        
                  <AnswersComments  commentId={comment.id}  ans={answers[comment.id] || []}/>
           <br />
       
          </div>
          <div key={comment.id} className="relative">
          <button onClick={(event) => toggleReportMenu(index, event)} className="flex pl-10 pt-2 space-x-2">
            <MdMoreVert size={24} color="black" />
          </button>

         
          {/* Меню появляется только для выбранного элемента */}
          {reportMenuOpenIndex === index && (
            <div>
            <div
              className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[180px]"
              style={{
                paddingTop: '4px',
                paddingBottom: '4px',
                position: 'absolute',
               display:display1,

              }}
            >
              <div onClick={() => openReport()} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300" 
                style={{display:'flex', justifyContent:'center'}}>
                <div>
                <FiFlag size={16} /></div>
                <div>
                <span style={{fontSize:'20px'}}>Report</span></div>
              </div>
            </div>
          
            <div
              className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                position: 'absolute',
               marginTop:'-150px',
               marginLeft:'-300px',
               display:display2,
               maxWidth: '400px',
               minWidth:'300px',
               borderRadius:'20px'
              }}
            >            
                <RadioButtonList userName={comment.userName} onClose={closeReport}/>
         
            </div>
            </div>
          )}
          
        </div>
          </div>
         
        ))
      ) : (
        <p>no comments</p>
      )}
    </div>

    

  
  );
}

export default Comments;


