'use client'

import React, {useState,useEffect} from 'react'
import VideoList from "@/components/pages/channel/mylikedvideo/videolist";
import {IVideo} from "@/types/videoinfo.interface";
import { useUser } from '@clerk/nextjs';
import FilterComponent from './filtersearch';


const LikedVideo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
    const {user} = useUser();
    const [filters, setFilters] = useState({
      uploadDate: '',
      contentType: '',
      sortBy: ''
  });
  const [nameFilt, setNameFillt]=useState('last liked video first');
 
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
          setMoreVideos(prevVideos => applyFiltersAndSorting(prevVideos));
        } else {
          console.error('Ошибка получения видео:', response.statusText);
        }
        }
      } catch (error) {
        console.error('Ошибка при подключении к серверу:', error);
      }
    };

    const applyFiltersAndSorting = (results: any[]) => {
      
      if (filters.uploadDate === 'today') {
          results = results.filter((video: any) => {
              const uploadDate = new Date(video.uploadDate);
              return uploadDate.toDateString() === new Date().toDateString();
          });
      } else if (filters.uploadDate === 'month') {
          results = results.filter((video: any) => {
              const uploadDate = new Date(video.uploadDate);
              return uploadDate.getMonth() === new Date().getMonth();
          });
      }
  
      if (filters.contentType === 'shorts') {
          results = results.filter((video: any) => video.isShort === true);
      } else if (filters.contentType === 'video') {
          results = results.filter((video: any) => video.isShort === false);
      }
  
      if (filters.sortBy === 'date') {
        results = results.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    } else if (filters.sortBy === 'views') {
        results = results.sort((a: any, b: any) => b.viewCount - a.viewCount);
    } else if (filters.sortBy === 'rating') {
        results = results.sort((a: any, b: any) => b.likeCount - a.likeCount);
    }
      
      return results;
  };

       
    useEffect(() => {
      setNameFillt('');
      if(filters.contentType==''&& filters.sortBy==''&& filters.uploadDate=='')
        setNameFillt('last liked video first');
      else 
      {
        if(filters.contentType !='')
          setNameFillt(filters.contentType);
        if(filters.uploadDate !='')
          setNameFillt(nameFilt+', '+ filters.uploadDate);
        if(filters.sortBy !='')
          setNameFillt(nameFilt+', '+ filters.sortBy);
      }
        getVideos();
      }, [filters]);
  
      const applyFilters = (newFilters: any) => {
        setFilters(newFilters);

    };

    return (
        <div className="pr-[2%] max-sm:pr-0 flex-1 " style={{marginTop:'10px'}}>
           <FilterComponent applyFilters={applyFilters} name={nameFilt} />
             <VideoList data={moreVideos}  />
             </div>
    )
}

export default LikedVideo