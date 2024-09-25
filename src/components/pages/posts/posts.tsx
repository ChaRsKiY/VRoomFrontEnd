import { useEffect, useState } from 'react';
import {SlDislike, SlLike} from "react-icons/sl";
import  { useUser }  from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import {formatTimeAgo} from"@/utils/format";
import { BiCommentDetail } from 'react-icons/bi';

interface IPost {
  id: number;
  text: string;
  channelSettingsId: number;
  date: Date;
  photo?: string;
  video?: string;
  likeCount: number;
  dislikeCount: number;
}

const PostList = ({ channelId }: { channelId: number }) => {
  const [posts, setPosts] = useState<IPost[]>([]); // Храним список постов
  const [loading, setLoading] = useState<boolean>(true); // Для отображения состояния загрузки
  const [error, setError] = useState<string | null>(null); // Для обработки ошибок
  const { user } = useUser();
  const [iAmUser, setUser] = useState<IUser | null>(null);

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

  // Отображаем состояние загрузки или ошибки
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  // Отображение постов
  return (
    <div className=" w-3/4 px-8" style={{justifyItems:'center'}}>
    
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
                    {post.likeCount!=0? (<span style={{paddingRight:'10px'}}>
                      post.likeCount</span>):
                      (<span style={{paddingRight:'10px'}}>No comments</span>)}
                    <BiCommentDetail size={24} color="gray" />
                    </div>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
