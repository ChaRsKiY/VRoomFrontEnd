import React, { useState, useEffect } from 'react';
import VideoPlayer from "@/components/pages/watch/player";
import UnderVideoBlock from "@/components/pages/watch/under-video-block";
import UnderLine from "@/components/pages/watch/underline";
import DescriptionBlock from "@/components/pages/watch/description-block";
import CommentsBlock from "@/components/pages/watch/comments-block";
import { IVideo } from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';

interface IProps {

  id: number;

}

const Watch: React.FC<IProps> = ({ id }) => {

  const [video, setVideo] = useState<IVideo | null>(null);

  const getVideo = async () => {
    try {
      const response = await api.get(`/Video/getvideoinfo/` + id);

      if (response.status === 200) {
        const mydata: IVideo = await response.data;
        console.log('успешный video', mydata);
        setVideo(mydata);
      } else {
        console.error('Ошибка получения видео:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };


  useEffect(() => {
    getVideo();
  }, [id]);
  return (
    <div className="flex w-full " style={{ marginLeft: '80px' }}>
      {video ? (
        <div className="w-3/4 px-8">
          <VideoPlayer src={video.videoUrl} id={video.id} />
          <UnderVideoBlock video={video} />
          <UnderLine />
          <DescriptionBlock description={video.description} />
          <UnderLine />
          <CommentsBlock videoid={id} />
        </div>
      ) : (
        <></>
      )}
      <div></div>
    </div>

  )
}

export default Watch