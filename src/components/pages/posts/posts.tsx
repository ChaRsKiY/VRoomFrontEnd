'use client'
import { useEffect, useState, useRef } from 'react';
import {SlDislike, SlLike} from "react-icons/sl";
import  { useUser }  from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import {formatTimeAgo} from"@/utils/format";
import { BiCommentDetail } from 'react-icons/bi';
import { ICommentPost } from '@/types/commentpost.interface';
import {IPost} from "@/types/post.interface";
import Link from "next/link";
import { BiTrash } from 'react-icons/bi';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface IPropsPost {
 channelId:  number,
 
 }

const PostList : React.FC<IPropsPost>= ({ channelId }) => {
  const [posts, setPosts] = useState<IPost[]>([]); // Храним список постов
  const [loading, setLoading] = useState<boolean>(true); // Для отображения состояния загрузки
  const [error, setError] = useState<string | null>(null); // Для обработки ошибок
  const { user } = useUser();
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [display, setDisplay] = useState('block');
  const [display1, setDisplay1] = useState('none');
  const [commentsByPost, setCommentsByPost] = useState<{ [key: number]: ICommentPost[] }>({});
  const [allComments, setAllComments] = useState<{ [key: number]: number }>({});
  const textAreasRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [expandedStates, setExpandedStates] = useState<boolean[]>(Array(posts.length).fill(false));
  const [isTextOverflowing, setIsTextOverflowing] = useState<boolean[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null); 
  const [deleteMenuOpenIndex, setReportMenuOpenIndex] = useState<number | null>(null);


  const getComments = async (postId: number) => {
    try {
      const response = await fetch('https://localhost:7154/api/CommentPost/getbypostid/' + postId, {
        method: 'GET',
      });

      if (response.ok) {
        const data: ICommentPost[] = await response.json();
        
        // Записываем все комментарии для поста
        setCommentsByPost((prevComments) => ({
          ...prevComments,
          [postId]: data, // Записываем комментарии для конкретного postId
        }));
        console.log(`ВСЕГО Комментарии для поста ${postId} =`,allComments[postId]);
        console.log(`Комментарии для поста ${postId} успешно получены:`, data);
      } else if (response.status === 404) {
        // Если комментариев нет, сохраняем пустой массив для поста
        setCommentsByPost((prevComments) => ({
          ...prevComments,
          [postId]: [],
        }));
        console.log(`Комментариев для поста ${postId} не найдено (404).`);
      } else {
        console.error('Ошибка при получении списка комментариев:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };


  const getUser = async () => {
    try {
        
            const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfobychannelid/' + channelId, {
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

const sortByDate = (posts: IPost[]) => {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const  dislike= async (id: number, userid:string  )=>{
  if(user){ 
  try {
    
    const response = await fetch('https://localhost:7154/api/Post/dislike/'+id +'/'+ user.id +'/'+ userid, {
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
    const response = await fetch('https://localhost:7154/api/Post/like/'+id +'/'+ user.id +'/'+ userid, {
      method: 'PUT',
    });

    if (response.ok) {
     console.log('успешный лайк',response);
    } else {
      console.error('Ошибка при like:', response.statusText);
    }
  
  } catch (error) {
    console.error('Ошибка при подключении к серверу:', error);
  }}
}; 

const deletePost = async (id: number ) => {
  if(user){ 
  try {     
    const response = await fetch('https://localhost:7154/api/Post/'+id , {
      method: 'DELETE',
    });

    if (response.ok) {
      closeReport();
     console.log('успешнo deleted',response);
    } else {
      console.error('Ошибка при delete:', response.statusText);
    }
  
  } catch (error) {
    console.error('Ошибка при подключении к серверу:', error);
  }}
};

 const closeReport = () => {
   setReportMenuOpenIndex(null);
  };

  const toggleDeleteMenu = (index: number, event: React.MouseEvent) => {
    if (deleteMenuOpenIndex === index) {
      setReportMenuOpenIndex(null); // Закрываем, если уже открыто
    } else {
      setReportMenuOpenIndex(index); // Открываем для конкретного элемента
    }
  };

useEffect(() => {

  const ws = new WebSocket('wss://localhost:7154');
  ws.onopen = () => {
    console.log('WebSocket соединение установлено');
    // Например, можно отправить начальный запрос или уведомление
    ws.send(JSON.stringify({ type: 'subscribe', posts,channelId }));
  };
  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    console.log('Сообщение от WebSocket сервера:', messageData);
 
    if (messageData.type === 'new_post') {    
      const a:IPost=messageData.payload;
      if(a.channelSettingsId===channelId)
      { 
    setPosts((prevPosts) => {        
        return [ a,  ...prevPosts,];
      });
  
     }
    }
    if (messageData.type === 'new_likepost') {
      const likedAnswer = messageData.payload;
      console.log('*/*/*/*=',likedAnswer);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === likedAnswer.id
            ? { ...post, likeCount: likedAnswer.likeCount } // Обновляем количество лайков
            : post
        )
      );
    }
    if (messageData.type === 'new_dislikepost') {
      const likedAnswer = messageData.payload;
      console.log('*/*/*/*=',likedAnswer);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === likedAnswer.id
            ? { ...post, dislikeCount: likedAnswer.dislikeCount } // Обновляем количество лайков
            : post
        )
      );
    }

    if (messageData.type === 'post_deleted') {
      const likedAnswer = messageData.payload;
      console.log('*/*/*/*=',likedAnswer);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== likedAnswer.id) // Удаляем пост с нужным id
      );
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
}, [posts , channelId]);

  // Получаем посты по channelId
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://localhost:7154/api/Post/getbychannelid/`+ channelId);
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const data: IPost[] = await response.json();
        setPosts(sortByDate(data));
      } catch (err) {
        alert('ERROR!!!')
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    getUser();

  }, [channelId]);

  useEffect(() => {
    const postIds = Object.keys(posts).map(Number); // Получаем все ключи postId в виде чисел

    postIds.forEach((postId) => {
      getComments(posts[postId].id); // Вызываем getComments для каждого поста
    });
  }, [posts]);

  useEffect(() => {
    const postIds = Object.keys(commentsByPost).map(Number); // Получаем все ключи postId в виде чисел

    postIds.forEach((postId) => {
      setAllComments((prevAllComments) => ({
        ...prevAllComments,
        [postId]: commentsByPost[postId].length, // Сохраняем количество комментариев
      })); // Вызываем getComments для каждого поста
    });
    console.log(allComments);
  }, [commentsByPost]);
      
  const toggleExpand = (index: number) => {
    
    setExpandedStates((prevState) =>     
      prevState.map((state, i) => (i === index ? !state : state)) // Переключаем состояние только для конкретного комментария
    );
  };

  useEffect(() => {
    // Проверяем, все ли текстовые области помещают текст
    const overflowStatuses = textAreasRefs.current.map((textarea) => {
      if (textarea) {
        return textarea.scrollHeight > textarea.clientHeight; // Возвращает true, если есть скролл
      }
      return false;
    });
    setIsTextOverflowing(overflowStatuses); // Обновляем состояние
    setExpandedStates(Array(posts.length).fill(false)); 
  }, [posts]);

  // Отображаем состояние загрузки или ошибки
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Отображение постов
  return (
    <div>
      <div style={{display}}>
    <div className=" w-3/4" >
    
      {posts.length === 0 ? (
        <p>No posts</p>
      ) : (
        <ul>
          {posts.map((post,index) => (
            <li key={post.id} style={{borderRadius:'10px',border:'1px solid lightgray',padding:'20px',marginTop:'20px',
              paddingRight:'30px',paddingLeft:'30px',textAlign:'center'}}>
                <div className='flex ' style={{width:'100%',justifyContent:'space-between'}}>
                  <div className='flex '>
                  <img 
          src={iAmUser?.channelBanner} 
          alt="User Avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
        />    
       <a style={{fontSize:'14px',fontWeight:'bold', color:'gray'}} href='#'>{iAmUser?.channelName}&nbsp;&nbsp;</a> 
       </div>

       <small style={{fontWeight:'bold',color:'gray'}}>{formatTimeAgo(new Date(post.date)) }</small>
                
                </div>

<div key={index} style={{ marginBottom: '20px',paddingLeft:'50px' }}>
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
                  value={post.text}
                  readOnly
                  rows={1}                        
                />
                </div>
                   <p  style={{ display: expandedStates[index] ? 'block' : 'none'}}>
                   {post.text.split('\n').map((line, ind) => (
              <span key={ind}>
                  {line}
              <br />
              </span>
                   ))}</p>
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
            
             <br />
              {post.photo && 
              <img src={post.photo} alt="Post image" width="100%" style={{paddingLeft:'50px'}}/>}
              {post.video && (
                <>
                <div className='flex'>
                  <video src={post.video} controls width="350px" style={{paddingLeft:'50px'}}>
                    Ваш браузер не поддерживает видео.
                  </video>
                  <div  style={{paddingRight:'10px'}}>
                      <a href={post.video} target="_blank" rel="noopener noreferrer"
                       className="ml-4 text-blue-600 underline ">
                       {post.video}
                      </a>
                    </div>
                   
                  </div>
                </>
              )}
              <div className="flex items-center space-x-8 pt-5" style={{paddingLeft:"55px", width:'100%',justifyContent:'space-between'}}>
                   <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-2.5 pr-10">
                       
                    <SlLike size={20}  onClick={iAmUser ? () => like(post.id, iAmUser?.clerk_Id) : undefined} />
                        <div style={{fontSize:"14px"}}>{post.likeCount !== 0 && post.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike size={20} onClick={iAmUser ? () => dislike(post.id, iAmUser?.clerk_Id) : undefined}/>
                        <div style={{fontSize:"14px"}}>{post.dislikeCount !== 0 && post.dislikeCount}</div>
                    </div>
                    </div>

                    <TooltipProvider>
                    <Tooltip >
                     <TooltipTrigger className="max-sm:hidden">
                    <Link href={"/post/comments/" +post.id} className="block pl-0 pr-4 py-2 rounded-full">                  
                    <div className='flex ' >
                    {allComments[post.id]!=0? (
                      <span style={{paddingRight:'10px'}}>
                      {allComments[post.id]}</span>) :
                      (<span style={{paddingRight:'10px'}}>No comments</span>)}
                    <BiCommentDetail size={24} color="gray" />
                    </div>
                    </Link>
                </TooltipTrigger>
                    <TooltipContent>
                        <p>add comment</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

                    {iAmUser?.clerk_Id === user?.id ? (
                    <div>
                    <div onClick={(event) => toggleDeleteMenu(index, event)} >
                    <BiTrash size={24} color="brown" />
                    </div>
                    { deleteMenuOpenIndex === index? (
                    <div
      className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 w-[180px]"
      style={{
        paddingTop: '4px',
        paddingBottom: '4px',
        position: 'absolute',
        border:'2px solid brown'
      }}
    >
      <div className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-red-300" 
        style={{display:'flex', justifyContent:'center'}}
        onClick={() => deletePost(post.id)}>
        <span style={{fontSize:'18px'}}>Delete</span></div>
     

      <div className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-300" 
        style={{display:'flex', justifyContent:'center'}}
        onClick={closeReport}>
        <span style={{fontSize:'18px'}}>Cancel</span></div>
        </div>):(<></>)}

    </div>):(<></>)}

                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>

    </div>
  );
};

export default PostList;
