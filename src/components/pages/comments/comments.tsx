'use client'
import React from 'react';
import { ICommentVideo } from '@/types/commentvideo.interface';
import { useEffect, useState } from 'react';

interface CommentsProps {
  comments: ICommentVideo[];
}

const getTimeAgo = (date: string | Date) => {
    const commentDate = new Date(date + "Z");
    const now = new Date();
    
    const diffMs = now.getTime() - commentDate.getTime(); // Разница в миллисекундах
    const diffMinutes = Math.floor(diffMs / 60000); // Преобразуем миллисекунды в минуты
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffMinutes < 1) return 'Только что';
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${diffDays} д назад`;
  }

const Comments: React.FC<CommentsProps> = ({ comments }) => {
    console.log(comments);

    // const [com,setComments]=useState<ICommentVideo[]>([]);

    // useEffect(() => {
    //     setComments(comments);
    //   }, [comments]);
  return (
   
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.videoId}>
            <p>{comment.comment}</p>
            <small>{getTimeAgo(comment.date)}</small>
            <hr></hr>
          </div>
        ))
      ) : (
        <p>Нет комментариев.</p>
      )}
    </div>
  );
}

export default Comments;


// 'use client';
// import { useEffect, useState } from 'react';
// import { clerkClient } from '@clerk/clerk-sdk-node';
// import axios from 'axios'

// interface MyCommentProps {
//   clerkId: string; // Типизация для пропса clerkId
// }

// const MyComment: React.FC<MyCommentProps> = ({ clerkId }) => {
//   const [avatarUrl, setAvatarUrl] = useState<string>('');

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         console.log("ответ=************************");
//         // const response = await fetch(`/getUser?clerkId=${clerkId}`, {
//         //     method: 'GET', // Явно указываем метод GET
//         //   });
//       const response = await axios.get(`../users/?clerkId=${clerkId}`);

//          console.log("ответ="+response.data);
// // var url="";
//     //       const user = await clerkClient.users.getUser(clerkId as string);
//     // console.log(user);
//     // console.log(user.id);
//     // console.log("avatarUrl:"+user.imageUrl);
//     // url=user.imageUrl;
//        //  const data = await response.json();
//          setAvatarUrl(response.data.avatarUrl); // Устанавливаем URL аватарки
//         // setAvatarUrl("https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ya2t1NFMyYVpmY1pZV3Z1cE1WVEJJbGJLbEEiLCJyaWQiOiJ1c2VyXzJsV1ZjSFE0SGNYQTlKZnJNTzFsMzBqRHhBaSIsImluaXRpYWxzIjoiT0EifQ"
//         // ); // Устанавливаем URL аватарки
//       } catch (error) {
//         console.error('Ошибка при получении профиля пользователя:', error);
//       }
//     };

//     fetchUserProfile();
//   }, [clerkId]);
//    return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       {avatarUrl ? (
//         <img 
//           src={avatarUrl} 
//           alt="User Avatar" 
//           style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
//         />
//       ) : (
//         <p>Аватарка не найдена</p>
//       )}
//       <input type="text" placeholder="Введите текст"  />
//       <hr></hr>
//     </div>
//   );
// };

// export default MyComment;


// import { clerkClient } from '@clerk/nextjs/server';
// import{IUser} from '@/types/user.interface'

// export async function getServerSideProps() {
//   const clerkIds = ['user_1', 'user_2', 'user_3']; // Список clerk_Id пользователей
  
//   // Запрашиваем данные пользователей по их Clerk ID
//   const users = await Promise.all(
//     clerkIds.map(async (clerkId) => {
//       const user = await clerkClient.users.getUser(clerkId);
//       return {
//         id: user.id,
//         avatar: user.imageUrl,
//         fullName: `${user.firstName} ${user.lastName}`,
//       };
//     })
//   );

//   return {
//     props: {
//       users,
//     },
//   };
// }

// const AvatarsPage = ({ users }) => {
//   return (
//     <div>
//       <h1>Список аватарок пользователей</h1>
//       <ul>
//         {users.map((user: IUser) => (
//           <li key={user.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//             <img
//               src={user.avatar}
//               alt={`Avatar of ${user.fullName}`}
//               style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
//             />
//             <span>{user.fullName}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AvatarsPage;


// 'use client';
// import { useEffect, useState } from 'react';
// import { clerkClient } from '@clerk/clerk-sdk-node';
// import {useRouter} from "next/navigation";
// import axios from 'axios'

// interface MyCommentProps {
//   clerkId: string; // Типизация для пропса clerkId
// }

// const MyComment: React.FC<MyCommentProps> = ({ clerkId }) => {
//   const [avatarUrl, setAvatarUrl] = useState<string>('');
//   const { push } = useRouter()

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         console.log("ответ=************************");
//         // const response = await fetch(`/api/users?clerkId=${clerkId}`, {
//         //     method: 'GET', // Явно указываем метод GET
//         //   });
//       const response = await axios.get(`/api/users?clerkId=${clerkId}`);

//          console.log("ответ="+response.data);
// // var url="";
//     //       const user = await clerkClient.users.getUser(clerkId as string);
//     // console.log(user);
//     // console.log(user.id);
//     // console.log("avatarUrl:"+user.imageUrl);
//     // url=user.imageUrl;
//        //  const data = await response.json();
//          setAvatarUrl(response.data.avatarUrl); // Устанавливаем URL аватарки
//         // setAvatarUrl("https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ya2t1NFMyYVpmY1pZV3Z1cE1WVEJJbGJLbEEiLCJyaWQiOiJ1c2VyXzJsV1ZjSFE0SGNYQTlKZnJNTzFsMzBqRHhBaSIsImluaXRpYWxzIjoiT0EifQ"
//         // ); // Устанавливаем URL аватарки
//       } catch (error) {
//         console.error('Ошибка при получении профиля пользователя:', error);
//       }
//     };

//     fetchUserProfile();
//   }, [clerkId]);
//    return (
//     <div style={{ display: 'flex', alignItems: 'center' }}>
//       {avatarUrl ? (
//         <img 
//           src={avatarUrl} 
//           alt="User Avatar" 
//           style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
//         />
//       ) : (
//         <p>Аватарка не найдена</p>
//       )}
//       <input type="text" placeholder="Введите текст"  />
//       <hr></hr>
//     </div>
//   );
// };

// export default MyComment;