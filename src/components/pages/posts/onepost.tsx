import { useEffect, useState } from 'react';
import {SlDislike, SlLike} from "react-icons/sl";
import  { useUser }  from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import {formatTimeAgo} from"@/utils/format";
import { BiCommentDetail } from 'react-icons/bi';
import { ICommentPost } from '@/types/commentpost.interface';
import {IPost} from "@/types/post.interface";

interface IPropsPost {
 comments:  ICommentPost[],

}

const PostList = ({ channelId }: { channelId: number }) => {
  const [posts, setPosts] = useState<IPost[]>([]); // Храним список постов
  const [loading, setLoading] = useState<boolean>(true); // Для отображения состояния загрузки
  const [error, setError] = useState<string | null>(null); // Для обработки ошибок
  const { user } = useUser();
  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [display, setDisplay] = useState('block');
  const [display1, setDisplay1] = useState('none');
  const [commentsByPost, setCommentsByPost] = useState<{ [key: number]: ICommentPost[] }>({});
  const [allComments, setAllComments] = useState<{ [key: number]: number }>({});


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
        if(user){
            const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfobychannelid/' + channelId, {
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

const sortByDate = (posts: IPost[]) => {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

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
          {posts.map((post) => (
            <li key={post.id} style={{borderRadius:'10px',border:'2px solid gray',padding:'10px',marginTop:'10px',
              paddingRight:'30px',paddingLeft:'30px',textAlign:'center'}}>
                <div className='flex ' style={{width:'100%',justifyContent:'space-between'}}>
                  <div className='flex '>
                  <img 
          src={iAmUser?.channelBanner} 
          alt="User Avatar" 
          style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
        />    
       <a style={{fontSize:'14px',fontWeight:'bold', color:'gray'}} href='#'>{iAmUser?.channelName}&nbsp;&nbsp;</a> 
       </div>
       {/* <small style={{fontWeight:'bold'}}>{new Date(post.date).toLocaleDateString()}</small> */}
       <small style={{fontWeight:'bold',color:'gray'}}>{formatTimeAgo(new Date(post.date)) }</small>
                
                </div>
              <p>{post.text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}</p>
             <br />
              {post.photo && 
              <img src={post.photo} alt="Post image" width="100%" />}
              {post.video && (
                <>
                {/* <div className='flex'> */}
                  <video src={post.video} controls width="100%">
                    Ваш браузер не поддерживает видео.
                  </video>
                  <div  style={{paddingRight:'10px'}}>
                      <a href={post.video} target="_blank" rel="noopener noreferrer"
                       className="ml-4 text-blue-600 underline ">
                       {post.video}
                      </a>
                    </div>
                  {/* </div> */}
                </>
              )}
              <div className="flex items-center space-x-8 pt-5" style={{paddingLeft:"55px", width:'100%',justifyContent:'space-between'}}>
                   <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-2.5 pr-10">
                        <SlLike size={20}  />
                        <div style={{fontSize:"14px"}}>{post.likeCount !== 0 && post.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike    size={20}/>
                        <div style={{fontSize:"14px"}}>{post.dislikeCount !== 0 && post.dislikeCount}</div>
                    </div>
                    </div>
                    <div className='flex ' >
                    {allComments[post.id]!=0? (<span style={{paddingRight:'10px'}}>
                      {allComments[post.id]}</span>) :
                      (<span style={{paddingRight:'10px'}}>No comments</span>)}
                    <BiCommentDetail size={24} color="gray" />
                    </div>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>

<div style={{display:display1}}>

</div>

    </div>
  );
};

export default PostList;