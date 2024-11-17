'use client'

import React, { useEffect, useState } from 'react'
import { IVideo } from "@/types/videoinfo.interface";
import VideoCard from "@/components/pages/home/main/video-card";
import api from '@/services/axiosApi';


const Playlist: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);

  const getVideos = async () => {
    try {
      const response = await api.get('/Video');

      if (response.status === 200) {
        const mydata: IVideo[] = await response.data;
        console.log('успешный list of video', mydata);
        setMoreVideos(mydata);
      } else {
        console.error('Ошибка получения видео:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);


    return (
        <div style={{ marginTop: '100px',  }}>
            {moreVideos.map((el, key) => (
                <div key={key} >
                    <VideoCard el={el} />
                </div>
            ))}
            {moreVideos.length == 0 ? (<div   >
                    You do not have the playlist yet...
                </div>) : <></>}
        </div>

    )
}

export default Playlist