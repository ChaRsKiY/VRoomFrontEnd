
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { GoSortDesc } from 'react-icons/go';
// import MyComment from '../comments/mycomment';
// import Comments from '@/components/pages/comments/comments';
// import { ICommentVideo } from '@/types/commentvideo.interface';
// import { useUser } from '@clerk/nextjs';
// import { IUser } from '@/types/user.interface';

// const CommentsBlock: React.FC = () => {
//   const videoId = 4;
//   const { user } = useUser();
//   const [comments, setComments] = useState<ICommentVideo[]>([]);
//   const [allComments, setAllComments] = useState(0);
//   const [iAmUser, setUser] = useState<IUser | null>(null);
//   const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
//   const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('likes'); // Состояние для метода сортировки

//   // Получение текущего пользователя
//   const getUser = async () => {
//     try {
//       if(user){ 
//       const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfochannel/' + user?.id, {
//         method: 'GET',
//       });

//       if (response.ok) {
//         const data: IUser = await response.json();
//         setUser(data);
//       } else {
//         console.error('Ошибка при получении пользователя:', response.statusText);
//       }
//     }
//     } catch (error) {
//       console.error('Ошибка при подключении к серверу:', error);
//     }
//   };

//   // Получение комментариев
//   const getComments = async () => {
//     try {
//       const response = await fetch('https://localhost:7154/api/CommentVideo/getbyvideoid/' + videoId, {
//         method: 'GET',
//       });

//       if (response.ok) {
//         const data: ICommentVideo[] = await response.json();
//         setAllComments(data.length);

//         // Сортируем комментарии после их получения в зависимости от текущего метода сортировки
//         if (sortMethod === 'date') {
//           setComments(sortByDate(data));
//         } else if (sortMethod === 'likes') {
//           setComments(sortByLikes(data));
//         }

//         console.log('Комментарии успешно получены:', data);
//       } else {
//         console.error('Ошибка при отправке комментария:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Ошибка при подключении к серверу:', error);
//     }
//   };

//   // Сортировка по дате
//   const sortByDate = (comments: ICommentVideo[]) => {
//     return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   };

//   // Сортировка по количеству лайков
//   const sortByLikes = (comments: ICommentVideo[]) => {
//     return [...comments].sort((a, b) => b.likeCount - a.likeCount);
//   };

//   // Выполняем сортировку на основе выбранного метода
//   const handleSortMethodChange = (method: 'date' | 'likes') => {
//     setSortMethod(method);
//     if (method === 'date') {
//       setComments(sortByDate(comments));
//     } else if (method === 'likes') {
//       setComments(sortByLikes(comments));
//     }
//   };

//   // Используем интервал для постоянного обновления комментариев
//   useEffect(() => {
//     getUser();
//     const intervalId = setInterval(() => {     
//       if(!user){
//         setUser(null);
//       }
//       getComments(); // Получаем комментарии каждые X секунд
//     }, 1000); // Обновление каждые 5 секунд (можете изменить интервал)

//     return () => clearInterval(intervalId); // Очищаем интервал при размонтировании
//   }, [videoId, user, sortMethod]); // Следим за изменением видео, пользователя и метода сортировки

//   return (
//     <div onClick={() => { if (isSortMenuOpen) {setSortMenuOpen(false);  } }}>
//       <div className="flex items-center space-x-8">
//         <div className="font-[500]">{allComments} Comments</div>
//         <div
//           className="flex space-x-1 relative"
//           onClick={() => setSortMenuOpen(!isSortMenuOpen)}
         
//         >
//           <GoSortDesc size={22} />
//           <div className="text-[0.9rem] font-[500]">Sort</div>
         
//           {/* Всплывающая подсказка */}
//           {!isSortMenuOpen &&  (
//   <div className="absolute left-[-30px]  top-7 ml-2 p-1 rounded-md shadow-lg bg-gray-500 text-white hidden hover-tooltip w-[120px] " 
//   style={{textAlign:'center'}} >
//     select sorting
//   </div>
//   )}
//   <style jsx>{`
//     .hover-tooltip {
//       display: none;
//     }
//     .relative:hover .hover-tooltip {
//       display: block;
//     }
//   `}</style>
  
//           {isSortMenuOpen && (
//   <div className="absolute bg-white border border-gray-300 rounded-md  shadow-lg left-0 top-full mt-2 z-10 w-[180px] "
//   style={{ paddingTop:'6px', paddingBottom:'6px'}}>
//     <div style={{textAlign:'center'}}
//       onClick={() => handleSortMethodChange('likes')} 
//       className={`cursor-pointer p-2 ${sortMethod === 'likes' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
//       By raiting
//     </div>
//     <div style={{textAlign:'center'}}
//       onClick={() => handleSortMethodChange('date')} 
//       className={`cursor-pointer p-2 ${sortMethod === 'date' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
//       New once first
//     </div>
//   </div>
// )}
//         </div>
//       </div>
//       <br />
//       <div style={{ marginTop: '30' }}>
//         {iAmUser ? <MyComment videoId={videoId} amuser={iAmUser} /> : <p></p>}
//         <br />
//         <Comments comments={comments} />
//       </div>
//     </div>
//   );
// };

// export default CommentsBlock;



'use client';

import React, { useEffect, useState } from 'react';
import { GoSortDesc } from 'react-icons/go';
import MyComment from '../comments/mycomment';
import Comments from '@/components/pages/comments/comments';
import { ICommentVideo } from '@/types/commentvideo.interface';
import { useUser } from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';

const CommentsBlock: React.FC = () => {
  const videoId = 4;
  const { user } = useUser();
  const [comments, setComments] = useState<ICommentVideo[]>([]);
  const [allComments, setAllComments] = useState(0);
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [isSortMenuOpen, setSortMenuOpen] = useState(false); // Состояние для управления видимостью меню сортировки
  const [sortMethod, setSortMethod] = useState<'date' | 'likes'>('date'); // Состояние для метода сортировки
  const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket состояние

  // Получение текущего пользователя
  const getUser = async () => {
    try {
      if (user) {
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

  // Получение комментариев с сервера через обычный HTTP запрос
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
        console.error('Ошибка при получении комментариев:', response.statusText);
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

  // Инициализация WebSocket и обновление комментариев через WebSocket
  useEffect(() => {
    // const ws = new WebSocket('ws://localhost:5000'); // URL WebSocket сервера
    const ws = new WebSocket('wss://localhost:7154');

    ws.onopen = () => {
      console.log('WebSocket соединение установлено');
      // Например, можно отправить начальный запрос или уведомление
      ws.send(JSON.stringify({ type: 'subscribe', videoId }));
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log('Сообщение от WebSocket сервера:', messageData);

      if (messageData.type === 'new_comment') {
        // Обновляем комментарии, если пришло новое сообщение
        // setComments((prevComments) => [...prevComments,messageData.comment]);
        // console.log(comments);
        // setAllComments((prev) => prev + 1);
        getComments();

      }
    };

    ws.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    ws.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

    // Сохраняем WebSocket в состоянии
    setSocket(ws);

    // Закрываем WebSocket при размонтировании компонента
    return () => {
      ws.close();
    };
  }, [videoId]);

  // Получаем комментарии при загрузке компонента
  useEffect(() => {
    getUser();
    getComments();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [videoId, user, sortMethod]);

  return (
    <div onClick={() => { if (isSortMenuOpen) { setSortMenuOpen(false); } }}>
      <div className="flex items-center space-x-8">
        <div className="font-[500]">{allComments} Comments</div>
        <div
          className="flex space-x-1 relative"
          onClick={() => setSortMenuOpen(!isSortMenuOpen)}
        >
          <GoSortDesc size={22} />
          <div className="text-[0.9rem] font-[500]">Sort</div>
          {!isSortMenuOpen && (
            <div className="absolute left-[-30px] top-7 ml-2 p-1 rounded-md shadow-lg bg-gray-500 text-white hidden hover-tooltip w-[120px]" style={{ textAlign: 'center' }}>
              select sorting
            </div>
          )}
          <style jsx>{`
            .hover-tooltip {
              display: none;
            }
            .relative:hover .hover-tooltip {
              display: block;
            }
          `}</style>

          {isSortMenuOpen && (
            <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full mt-2 z-10 w-[180px]" style={{ paddingTop: '6px', paddingBottom: '6px' }}>
              <div style={{ textAlign: 'center' }}
                onClick={() => handleSortMethodChange('likes')}
                className={`cursor-pointer p-2 ${sortMethod === 'likes' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
                By rating
              </div>
              <div style={{ textAlign: 'center' }}
                onClick={() => handleSortMethodChange('date')}
                className={`cursor-pointer p-2 ${sortMethod === 'date' ? 'bg-gray-400' : 'hover:bg-gray-200'}`}>
                New first
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

