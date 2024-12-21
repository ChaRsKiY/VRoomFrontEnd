'use client'

import React, {useState, useEffect, Suspense} from 'react'
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import { IVideo } from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';
import TagNavigation from './tag-navigation';
import LocalLoader from "@/components/reusable/local-loader";

const MainInfo: React.FC = () => {

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
      <div style={{ marginTop: '80px', width: '98%' }}>
        <div>
          <TagNavigation tagName='All' />
          <Suspense fallback={<LocalLoader />}>
            <UnlimitedScrollBlock data={moreVideos} />
          </Suspense>
        </div>
      </div>
  )
}

export default MainInfo