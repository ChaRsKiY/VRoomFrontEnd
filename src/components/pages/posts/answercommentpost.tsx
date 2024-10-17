'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {SlDislike, SlLike} from "react-icons/sl";
import { useUser } from '@clerk/nextjs';
import { FiFlag } from 'react-icons/fi';
import { IAnswerCommentPost } from '@/types/answercommentpost.interface';
import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';
import { MdMoreVert } from 'react-icons/md'; 
import RadioButtonList from '@/components/pages/comments/report';
import EditAnswerPost from './editanswerpost';
import { FaPen } from 'react-icons/fa';
import {formatTimeAgo} from"@/utils/format";
// import { initializeConnection, subscribeToMessages, closeConnection, sendMessage } from '@/services/signalr.service';
import { signalRService } from '@/services/signalr.service';

interface CommentsProps {
  commentId: number;
  ans:IAnswerCommentPost[]
}

const AnswersComments: React.FC<CommentsProps> = ({ commentId , ans}) => {

    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
    const {user}=useUser();
    const [display, setDisplay] = useState('none');
    const [display2, setDisplay2] = useState('block');
    const [visibleInput, setVisibleInput] = useState<number | null>(null); 
    const [answers, setAnswers] = useState<IAnswerCommentPost[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null); 
    const [allAnswers, setAllAnswers] = useState(0);
    const [display3, setDisplay3] = useState('none'); 
    const [display1, setDisplay1] = useState('block'); 
      const [reportMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null); 
      const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(answers.length).fill(false));
      const [display4, setDisplay4] = useState('none');  

    const handleReplayClick = (index: number) => {
      setVisibleInput(visibleInput === index ? null : index); // Переключаем видимость конкретного поля
    };
  
   
  const  dislike= async (id: number, userid:string  )=>{
    if(user){ 
    try {
      
      const response = await fetch('https://localhost:7154/api/AnswerPost/dislike/'+id +'/'+ user.id +'/'+ userid, {
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
      const response = await fetch('https://localhost:7154/api/AnswerPost/like/'+id +'/'+ user.id +'/'+ userid, {
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

  useEffect(() => {    
    try {
       setAnswers(ans); 
       setAllAnswers(ans.length);
       setDisplay('none');
       setDisplay2('blok');
      
    } catch (error) {
      console.error('Ошибка при получении профиля пользователя:', error);
    }
 
},[commentId, ans]);

// useEffect(() => {

//   const ws = new WebSocket('wss://localhost:7154');
//   ws.onopen = () => {
//     console.log('WebSocket соединение установлено');
//     // Например, можно отправить начальный запрос или уведомление
//     ws.send(JSON.stringify({ type: 'subscribe', ans,commentId }));
//   };
//   ws.onmessage = (event) => {
//     const messageData = JSON.parse(event.data);
//     console.log('Сообщение от WebSocket сервера:', messageData);
 
//     if (messageData.type === 'new_answerpost') {    
//       const a:IAnswerCommentPost=messageData.payload;
//       if(a.commentPost_Id===commentId)
//    { 
//     setAnswers((prevAnswers) => {        
//         return [...prevAnswers, a];
//       });
  
//     setAllAnswers((prev) => prev + 1);
//     }
//   }

//     if (messageData.type === 'like_answerpost') {
//       const likedAnswer = messageData.payload;
//       console.log('*/*/*/*=',likedAnswer);
//       setAnswers((prevAnswers) =>
//         prevAnswers.map((answer) =>
//           answer.id === likedAnswer.id
//             ? { ...answer, likeCount: likedAnswer.likeCount } // Обновляем количество лайков
//             : answer
//         )
//       );
//     }
//     if (messageData.type === 'dislike_answerpost') {
//       const likedAnswer = messageData.payload;
//       console.log('*/*/*/*=',likedAnswer);
//       setAnswers((prevAnswers) =>
//         prevAnswers.map((answer) =>
//           answer.id === likedAnswer.id
//             ? { ...answer, dislikeCount: likedAnswer.dislikeCount } // Обновляем количество лайков
//             : answer
//         )
//       );
//     }
//     if (messageData.type === 'update_answerpost') {
//       const upAnswer = messageData.payload;
//       setAnswers((prevAnswers) =>
//         prevAnswers.map((answer) =>
//           answer.id === upAnswer.id
//             ? { ...answer, text: upAnswer.text, isEdited: upAnswer.isEdited  } // Обновляем количество лайков
//             : answer
//         )
//       );
//     }
//   };
//   ws.onclose = () => {
//     console.log('WebSocket соединение закрыто');
//   };
//   ws.onerror = (error) => {
//     console.error('Ошибка WebSocket:', error);
//   };
//   // Сохраняем WebSocket в состоянии
//   setSocket(ws);
//   // Закрываем WebSocket при размонтировании компонента
//   return () => {
//     ws.close();
//   };
// }, [ans , commentId]);

useEffect(() => {

  const handleMessage = (messageType: string, payload: any) => {
    console.log('Сообщение от SignalR сервера:', messageType);
 
    if (messageType === 'new_answerpost') {    
      const a:IAnswerCommentPost= payload;
      if(a.commentPost_Id===commentId)
   { 
    setAnswers((prevAnswers) => {        
        // return [...prevAnswers, a];
        const isAnswerExists = prevAnswers.some(
          (answer) => answer.id === a.id
        );
        if (!isAnswerExists) {
          setAllAnswers((prev) => prev + 1);
          return [...prevAnswers, a];
        }
        return prevAnswers;

      });

    }
  }

    if (messageType === 'like_answerpost') {
      const likedAnswer = payload;
      console.log('*/*/*/*=',likedAnswer);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === likedAnswer.id
            ? { ...answer, likeCount: likedAnswer.likeCount } // Обновляем количество лайков
            : answer
        )
      );
    }
    if (messageType === 'dislike_answerpost') {
      const likedAnswer = payload;
      console.log('*/*/*/*=',likedAnswer);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === likedAnswer.id
            ? { ...answer, dislikeCount: likedAnswer.dislikeCount } // Обновляем количество лайков
            : answer
        )
      );
    }
    if (messageType === 'update_answerpost') {
      const upAnswer = payload;
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === upAnswer.id
            ? { ...answer, text: upAnswer.text, isEdited: upAnswer.isEdited  } // Обновляем количество лайков
            : answer
        )
      );
    }
  };
//   signalRService.on('postanswerMessage', handleMessage);

//   return () => {
//        signalRService.off('postanswerMessage', handleMessage);
//  };
signalRService.onMessageReceived(handleMessage);

    // Очистка подписки при размонтировании компонента
    return () => {
        signalRService.offMessageReceived(handleMessage);
    };
}, [ans , commentId]);

const openReport = () => {
  setDisplay3('block');
  setDisplay1('none');
 };

 const closeReport = () => {
   setDisplay1('block');
   setDisplay3('none');
   setReportMenuOpenIndex(null);
  };

  const openEdit = () => {
    setDisplay4('block');
    setDisplay1('none');
   };
 
   const closeEdit = () => {
     setDisplay1('block');
     setDisplay4('none');
     setReportMenuOpenIndex(null);
    };

 useEffect(() => {    
   setExpandedStates(Array(answers.length).fill(false)); 

   },[answers]);

   const toggleReportMenu = (index: number, event: React.MouseEvent) => {
    setDisplay3('none');
    setDisplay4('none');
    setDisplay1('block');
    if (reportMenuOpenIndex === index) {
      setReportMenuOpenIndex(null); // Закрываем, если уже открыто
    } else {
      setReportMenuOpenIndex(index); // Открываем для конкретного элемента
    }
  };

  const toggleExpand = (index: number) => {
    setDisplay3('none');
    setDisplay1('block');
    setDisplay4('none');
    setExpandedStates((prevState) =>     
      prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
    );
    setReportMenuOpenIndex(null);
  };

  useEffect(() => {    
    setExpandedStates(Array(answers.length).fill(false)); 
    },[answers]);

  return (
    
   
      <div style={{width:'100%'}}>
    <div style={{paddingLeft:'50px'}}>
    {allAnswers > 0 ? (   <div onClick={()=>{
      if(display==='none'){setDisplay('block');setDisplay2('none');}else {setDisplay('none');setDisplay2('block');}}}
      style={{display: 'inline-block', width: 'auto'}}> 
      
      <div style={{display:'flex'}}>
       <HiOutlineChevronUp size={24} color="blue"  style={{display}}/> {/* Стрелка вверх */}
       <HiOutlineChevronDown size={24} color="blue" style={{display:display2}}/> {/* Стрелка вниз */}
      <button style={{marginBottom:'5px', color:'blue'}} >     
          {allAnswers}&nbsp;Answers 
      </button >  </div></div>):<></>} 
      <div style={{width:'100%',display:'flex'}}>
       
     <div style={{display , width:'100%'}}>
      {answers.length> 0 ? (
        answers.map((comment, index) => (
         
            <div style={{width:'100%', display:'flex'}}>
          
          <div key={comment.commentPost_Id} style={{display:'flex',width:'100%'}}>
            <div>
          
             <img
              src={avatars[comment.userId]  || comment.channelBanner}
              alt=""
              width="25px"
              height="25px"
              style={{ borderRadius: '50%', marginRight: '10px' ,minHeight:'25px'}}
            /></div>
            <div style={{width:'100%'}}>
            
            <div style={{paddingLeft:'0px' ,width:'100%'}}>
            <div style={{display:'flex',justifyContent:'space-between',width:'100%'}} >
              <div>
              <Link  href='#' style={{paddingRight:'20px',fontWeight:'bolder', fontSize:'14px' }}>@{comment.userName}</Link>
             <small>{formatTimeAgo(new Date(comment.answerDate)) }</small>
</div>
             <div   key={comment.id} className="relative"  style={{marginRight:'-65px'}}> 

     <button onClick={(event) => toggleReportMenu(index, event)}  
      className="flex pl-10 pt-2 space-x-2" style={{ position: 'relative', zIndex: 10 }}> 
            <MdMoreVert size={24} color="black"  />
     </button>

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
{comment.userId === user?.id   &&(
                   <>
              <div onClick={() => openEdit()} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300" 
                style={{display:'flex', justifyContent:'center'}}>
                <div>
                <FaPen size={15} color="blue" /></div>
                <div>
                <span style={{fontSize:'18px'}}>Edit answer</span></div>
              </div>
              </>)}
</div>

           

              <div
              className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
              style={{
                paddingTop: '10px',
                paddingBottom: '10px',
                position: 'absolute',
               marginTop:'-50px',
               marginLeft:'-550px',
               display:display4,
               width: '100%',
               minWidth:'550px',
               borderRadius:'16px',
               border:'2px solid gray',
               
              }}
            >            
                <EditAnswerPost answer={comment} onClose={closeEdit} />
         
            </div>

<div
className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10"
style={{
paddingTop: '10px',
paddingBottom: '10px',
position: 'absolute',
marginTop:'-150px',
marginLeft:'-300px',
display:display3,
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

             </div> 
           <div>
            <div>
             <textarea
                  style={{
                    border: 'none',
                    fontSize: '16px',
                    padding: '5px',
                    height: 'auto',
                    resize: 'none',
                    wordWrap: 'break-word',
                     width: '100%',
                     backgroundColor:'white',
                    
                  }}
                  disabled
                  value={comment.text}
                  readOnly
                  rows={1} // Минимальное количество строк
                />

            </div>
            </div>
            <div className="flex items-center space-x-8" >
                    <div className="flex items-center space-x-2.5">
                        <SlLike onClick={() => like(comment.id, comment.userId )} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.likeCount !== 0 && comment.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike onClick={() => dislike(comment.id, comment.userId)} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.dislikeCount !== 0 && comment.dislikeCount}</div>
                    </div>
              
                    {comment.isEdited    &&(
                   <>

                  <div style={{fontSize:'11px', color:'brown'}} > Edited </div>
                    </>)}
             </div>
             <br />

             </div>           
          </div>        
          </div>
         
        ))
      ) : (
        <div></div>
      )}
      </div>
    </div>
    </div>
    </div>
  );
}

export default AnswersComments;