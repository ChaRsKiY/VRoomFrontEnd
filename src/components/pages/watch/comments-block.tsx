'use client'

import React from 'react'
import {GoSortDesc} from "react-icons/go";
import {SlDislike, SlLike} from "react-icons/sl";
import  MyComment from "../comments/mycomment";
import Comments from "@/components/pages/comments/comments";
import { useEffect, useState } from 'react';
import {ICommentVideo} from '@/types/commentvideo.interface'

const CommentsBlock: React.FC = () => {

   // const clerkId = 'user_2lWVcHQ4HcXA9JfrMO1l30jDxAi'; 
   const videoId = 5;

   const [comments,setComments]=useState<ICommentVideo[]>([]);
   
   const getComments = async () => {

    try {
      const response = await fetch('https://localhost:7154/api/CommentVideo/getbyvideoid/'+videoId, {
        method: 'GET'
      });

      if (response.ok) {
        const data: ICommentVideo[] = await response.json(); // Предполагаем, что API возвращает массив ICommentVideo
        setComments(data);  // Сохраняем комментарии в состояние
        console.log('Комментарии успешно получены:', data);
      } else {
       
        console.error('Ошибка при отправке комментария:', response.statusText);
      }
    } catch (error) {
      
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
        getComments();
      }, 1000); 
      return () => clearInterval(intervalId);
    }, [videoId]);


    return (
        <div>
            <div className="flex items-center space-x-8">
                <div className="font-[500]">1099 Comments</div>
                <div className="flex space-x-1">
                    <GoSortDesc size={22}/>
                    <div className="text-[0.9rem] font-[300]">Sort</div>
                </div>
            </div>
           <br/>
            <div style={{marginTop:'30'}}>  
                            
                <MyComment videoId={videoId} />

                <br/>
                <Comments comments={comments}/>
            </div>
        </div>
    )
}

export default CommentsBlock