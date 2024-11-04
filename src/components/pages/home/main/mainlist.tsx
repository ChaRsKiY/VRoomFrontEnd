'use client'

import React, { useState, useEffect } from 'react'
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import { IVideo } from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';

const MainInfo: React.FC = () => {

  const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);

  const getVideos = async () => {
    try {
      const response = await api.get('https://localhost:7154/api/Video');

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
    <div className="pr-[2%] max-sm:pr-0 flex-1 " style={{ marginTop: '100px' }}>
      <UnlimitedScrollBlock data={moreVideos} />
    </div>
  )
}

export default MainInfo