// 'use client'

// import React from 'react'
// import {GoSortDesc} from "react-icons/go";
// import  MyComment from "../comments/mycomment";
// import Comments from "@/components/pages/comments/comments";
// import { useEffect, useState } from 'react';
// import {ICommentVideo} from '@/types/commentvideo.interface';
// import { useUser } from '@clerk/nextjs';
// import { IUser } from '@/types/user.interface';

// const CommentsBlock: React.FC = () => {

  
//    const videoId = 1;
//    const {user}  = useUser();
//   //  const [display, setDisplay] = useState('');
//    const [comments,setComments]=useState<ICommentVideo[]>([]);
//    const [allComments,setAllComments]=useState(0);
//    const [iAmUser,setUser]=useState<IUser>();
//   const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
//   const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('likes'); 

//    const getUser = async () => {

//     try {
//       const response = await fetch('https://localhost:7154/api/User/getbyclerkid/'+user?.id, {
//         method: 'GET'
//       });

//       if (response.ok) {

//         const data:IUser = await response.json();        
//         setUser(data);
//       } else {
       
//         console.error('Ошибка при получении пользователя:', response.statusText);
//       }
//     } catch (error) {
      
//       console.error('Ошибка при подключении к серверу:', error);
//     }
//   };
   
//    const getComments = async () => {

//     try {
//       const response = await fetch('https://localhost:7154/api/CommentVideo/getbyvideoid/'+videoId, {
//         method: 'GET'
//       });

//       if (response.ok) {
//         const data: ICommentVideo[] = await response.json(); 
//         // setComments(data);
//         if (sortMethod === 'date') {
//           setComments(sortByDate(data));
//         } else if (sortMethod === 'likes') {
//           setComments(sortByLikes(data));
//         }
//         setAllComments(data.length);  
//         console.log('Комментарии успешно получены:', data);
//       } else {
       
//         console.error('Ошибка при отправке комментария:', response.statusText);
//       }
//     } catch (error) {
      
//       console.error('Ошибка при подключении к серверу:', error);
//     }
//   };

//   const sortByDate = (comments: ICommentVideo[]) => {
//     return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   };

//   const sortByLikes = (comments: ICommentVideo[]) => {
//     return [...comments].sort((a, b) => b.likeCount - a.likeCount);
//   };

//   const handleSortMethodChange = (method: 'date' | 'likes') => {
//     setSortMethod(method);
//     if (method === 'date') {
//       setComments(sortByDate(comments));
//     } else if (method === 'likes') {
//       setComments(sortByLikes(comments));
//     }
//   };
 

//   useEffect(() => {
//     getUser();
//     const intervalId = setInterval(() => {
//         getComments();
       
//       }, 1000); 
//       return () => clearInterval(intervalId);
//     }, [videoId, user, sortMethod]);

//     // useEffect(() => {
//     //   performSort(); // Сортируем каждый раз при изменении метода сортировки
//     // }, [sortMethod]);


//     return (
//         <div >
//             <div className="flex items-center space-x-8">
//                 <div className="font-[500]">{allComments} Comments</div>
//                 <div className="flex space-x-1 relative"  onClick={() => setSortMenuOpen(!isSortMenuOpen)} 
//           title="Выберите метод сортировки" >
//                     <GoSortDesc size={22}/>
//                     <div className="text-[0.9rem] font-[300]">Sort</div>
//                     {isSortMenuOpen && (
//             <div className="absolute bg-white border border-gray-300 rounded-md p-2 shadow-lg left-0 top-full mt-2 z-10">
//                <div onClick={() => handleSortMethodChange('date')} className="cursor-pointer hover:bg-gray-200 p-1">
//                 Сначала новые
//               </div>
//               <div onClick={() => handleSortMethodChange('likes')} className="cursor-pointer hover:bg-gray-100 p-1">
//                 По рейтингу
//               </div>
//             </div>
//           )}
//                 </div>
//             </div>
//            <br/>
//             <div style={{marginTop:'30'}}>  
//             {iAmUser ? (
//             <MyComment videoId={videoId}  amuser={iAmUser} />       
//             ):(<p></p>)}
//                 <br/>
//                 <Comments comments={comments} />
//             </div>
//         </div>
//     )
// }

// export default CommentsBlock



'use client';

import React, { useEffect, useState } from 'react';
import { GoSortDesc } from 'react-icons/go';
import MyComment from '../comments/mycomment';
import Comments from '@/components/pages/comments/comments';
import { ICommentVideo } from '@/types/commentvideo.interface';
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';

const CommentsBlock: React.FC = () => {
  const videoId = 1;
  const { user } = useUser();
  const [comments, setComments] = useState<ICommentVideo[]>([]);
  const [allComments, setAllComments] = useState(0);
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
  const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('likes'); // Состояние для метода сортировки

  // Получение текущего пользователя
  const getUser = async () => {
    try {
      const response = await fetch('https://localhost:7154/api/User/getbyclerkid/' + user?.id, {
        method: 'GET',
      });

      if (response.ok) {
        const data: IUser = await response.json();
        setUser(data);
      } else {
        console.error('Ошибка при получении пользователя:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  // Получение комментариев
  const getComments = async () => {
    try {
      const response = await fetch('https://localhost:7154/api/CommentVideo/getbyvideoid/' + videoId, {
        method: 'GET',
      });

      if (response.ok) {
        const data: ICommentVideo[] = await response.json();
        setAllComments(data.length);

        // Сортируем комментарии после их получения в зависимости от текущего метода сортировки
        if (sortMethod === 'date') {
          setComments(sortByDate(data));
        } else if (sortMethod === 'likes') {
          setComments(sortByLikes(data));
        }

        console.log('Комментарии успешно получены:', data);
      } else {
        console.error('Ошибка при отправке комментария:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  // Сортировка по дате
  const sortByDate = (comments: ICommentVideo[]) => {
    return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Сортировка по количеству лайков
  const sortByLikes = (comments: ICommentVideo[]) => {
    return [...comments].sort((a, b) => b.likeCount - a.likeCount);
  };

  // Выполняем сортировку на основе выбранного метода
  const handleSortMethodChange = (method: 'date' | 'likes') => {
    setSortMethod(method);
    if (method === 'date') {
      setComments(sortByDate(comments));
    } else if (method === 'likes') {
      setComments(sortByLikes(comments));
    }
  };

  // Используем интервал для постоянного обновления комментариев
  useEffect(() => {
    getUser();
    const intervalId = setInterval(() => {
      getComments(); // Получаем комментарии каждые X секунд
    }, 1000); // Обновление каждые 5 секунд (можете изменить интервал)

    return () => clearInterval(intervalId); // Очищаем интервал при размонтировании
  }, [videoId, user, sortMethod]); // Следим за изменением видео, пользователя и метода сортировки

  return (
    <div onClick={() => { if (isSortMenuOpen) {setSortMenuOpen(false);  } }}>
      <div className="flex items-center space-x-8">
        <div className="font-[500]">{allComments} Comments</div>
        <div
          className="flex space-x-1 relative"
          onClick={() => setSortMenuOpen(!isSortMenuOpen)}
          title="Выберите метод сортировки"
        >
          <GoSortDesc size={22} />
          <div className="text-[0.9rem] font-[300]">Sort</div>
          {isSortMenuOpen && (
  <div className="absolute bg-white border border-gray-300 rounded-md p-2 shadow-lg left-0 top-full mt-2 z-10 w-[150px]">
    <div 
      onClick={() => handleSortMethodChange('likes')} 
      className={`cursor-pointer p-1 ${sortMethod === 'likes' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}>
      По рейтингу
    </div>
    <div 
      onClick={() => handleSortMethodChange('date')} 
      className={`cursor-pointer p-1 ${sortMethod === 'date' ? 'bg-gray-300' : 'hover:bg-gray-100'}`}>
      Сначала новые
    </div>
  </div>
)}
        </div>
      </div>
      <br />
      <div style={{ marginTop: '30' }}>
        {iAmUser ? <MyComment videoId={videoId} amuser={iAmUser} /> : <p></p>}
        <br />
        <Comments comments={comments} />
      </div>
    </div>
  );
};

export default CommentsBlock;
