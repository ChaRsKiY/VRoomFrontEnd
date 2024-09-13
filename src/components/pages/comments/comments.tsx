'use client'
import React from 'react';
import { ICommentVideo } from '@/types/commentvideo.interface';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {SlDislike, SlLike} from "react-icons/sl";

 

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
    const [avatars, setAvatars] = useState<{ [key: string]: string }>({});
  const [likecount,setLikeCount] =useState(0);
  const [dislikecount,setDisLikeCount] =useState(0);

  const  like=(id: number,count: number)=>{
      
  }

  const  dislike=(id: number,count: number)=>{
    
        
  }
    

  return (
   
    <div style={{width:'100%'}}>
      {comments.length > 0 ? (
        comments.map((comment) => (
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
            <div style={{paddingLeft:'20px' }}>
              <Link  href='#' style={{paddingRight:'20px',fontWeight:'bold',fontSize:'14px' }}>@{comment.userName}</Link>
             <small>{getTimeAgo(comment.date)}</small>
             </div>
             <hr style={{width:'100%'}}></hr>
            <p style={{fontSize:'16px', padding:'5px' }}>{comment.comment}</p>
            </div>
            </div>
            <div className="flex items-center space-x-8" style={{paddingLeft:"50px"}}>
                    <div className="flex items-center space-x-2.5">
                        <SlLike onClick={() => like(comment.id,comment.likeCount )} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.likeCount !== 0 && comment.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <SlDislike onClick={() => dislike(comment.id,comment.likeCount )} size={15}/>
                        <div style={{fontSize:"14px"}}>{comment.dislikeCount !== 0 && comment.dislikeCount}</div>
                    </div>
                    <button style={{paddingLeft:"20px", fontWeight:"bold",fontSize:'14px'}}>answer</button>
             </div>
            <hr style={{padding:'5px',visibility:'hidden' }}></hr>
       
          </div>
        ))
      ) : (
        <p>no comments</p>
      )}
    </div>
  );
}

export default Comments;


