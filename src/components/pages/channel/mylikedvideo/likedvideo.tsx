'use client'

import React, {useState,useEffect} from 'react'
import VideoList from "@/components/pages/channel/mylikedvideo/videolist";
import {IVideo} from "@/types/videoinfo.interface";
import { useUser } from '@clerk/nextjs';


const LikedVideo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
    const {user} = useUser();
 
    const getVideos = async () => {
      try {
        if(user){ 
        const response = await fetch('https://localhost:7154/api/Video/getlikedvideo/'+ user.id, {
          method: 'GET',
        });
  
        if (response.ok) {
          const mydata: IVideo[] = await response.json();
          console.log('успешный list of likedvideo', mydata);
          setMoreVideos(mydata);
        } else {
          console.error('Ошибка получения видео:', response.statusText);
        }
        }
      } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
      }
    };
       
    useEffect(() => {
     
        getVideos();
      }, []);
  
 

    return (
        <div className="pr-[2%] max-sm:pr-0 flex-1 " style={{marginTop:'10px'}}>
             <VideoList data={moreVideos} />
             </div>
    )
}

export default LikedVideo