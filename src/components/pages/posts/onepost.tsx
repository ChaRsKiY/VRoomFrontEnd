'use client'
import { useEffect, useState } from 'react';
import {SlDislike, SlLike} from "react-icons/sl";
import  { useUser }  from '@clerk/nextjs';
import { IUser } from '@/types/user.interface';
import {formatTimeAgo} from"@/utils/format";
import {IPost} from "@/types/post.interface";
import Link from "next/link";
import { BiArrowBack } from 'react-icons/bi';

interface IPropsPost {
 postid:  number,

}

const Post : React.FC<IPropsPost> =({ postid }) => {

  const [iAmUser, setUser] = useState<IUser | null>(null);
  const [post, setPost] = useState<IPost | null>(null);
  const {user} = useUser();

  const getUser = async () => {
    try {
      
            const response = await fetch('https://localhost:7154/api/ChannelSettings/getinfobychannelid/' + post?.channelSettingsId, {
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
const getPost = async () => {
  try {
    
          const response = await fetch('https://localhost:7154/api/Post/' + postid, {
              method: 'GET',
          });

          if (response.ok) {
              const data: IPost = await response.json();
              setPost(data);
          } else {
              console.error('Ошибка при получении пользователя:', response.statusText);
           }
      } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
  }
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

useEffect(() => {
  getPost();
}, [postid]);

useEffect(() => {
  getUser();
}, [post]);



  // Отображение постa
  return (
    <div  >
      <div style={{width:'100%',display:'flex',justifyContent:'end',marginTop:'-50px',marginBottom:'20px'}}>
        <Link href={"/post/createpost/"+post?.channelSettingsId} style={{padding:'10px'}}>
             <BiArrowBack size={24} color="black" />
         </Link>
      </div>
          
                <div className='flex ' style={{width:'100%',justifyContent:'space-between',}}>
                  <div className='flex '>
                  <img 
          src={iAmUser?.channelProfilePhoto} 
          alt="User Avatar" 
          style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '15px' }}
        />    
       <a style={{fontSize:'14px',fontWeight:'bold', color:'gray'}} href='#'>{iAmUser?.channelNikName}&nbsp;&nbsp;</a> 
       </div>

      { post?(  <small style={{fontWeight:'bold',color:'gray',paddingRight:'50px'}}>{formatTimeAgo(new Date(post.date)) }</small>):(<></>)}
                

                </div>
              <p style={{textAlign:'center',paddingTop:'20px'}}>{post?.text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))}</p>
             <br />
            
              {post?.photo && 
              <img src={post.photo} alt="Post image" width="100%" style={{paddingLeft:'50px',paddingRight:'50px'}}/>}
              {post?.video && (
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
           
                  <div className="flex space-x-2.5" style={{width:'100%',justifyContent:'end',marginTop:'20px',paddingRight:'50px'}}>

                    <div className="flex items-center space-x-2.5 pr-10">                       
                    <SlLike size={20}  onClick={iAmUser ? post? () => like(post?.id, iAmUser?.clerk_Id) : undefined:undefined} />
                        <div style={{fontSize:"14px"}}>{post?.likeCount !== 0 && post?.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike size={20} onClick={iAmUser ? post? () => dislike(post?.id, iAmUser?.clerk_Id) : undefined: undefined}/>
                        <div style={{fontSize:"14px"}}>{post?.dislikeCount !== 0 && post?.dislikeCount}</div>
                    </div>

                  </div>

    </div>

  );
};

export default Post;