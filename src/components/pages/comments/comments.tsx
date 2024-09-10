

import React from 'react'
import {GoSortDesc} from "react-icons/go";
import {SlDislike, SlLike} from "react-icons/sl";

export default function Comments ()  {
    return (
       
            
            <div>
                <div>
                <p >
                    Text of the comments somebody wroutes
                </p>
                <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2.5">
                        <SlLike size={14}/>
                        <div className="font-[8]">20</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike size={14}/>
                        <div className="font-[8]">5</div>
                    </div>
                </div>
                <hr></hr>
                </div>
                <div>
                <p>
                    old comments somebody wroutes
                </p>
                <hr></hr>
                <br></br>
                </div>
            </div>
        
    )
};

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