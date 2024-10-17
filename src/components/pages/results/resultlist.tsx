'use client'

import React, {useEffect, useState} from 'react'
import UnlimitedScrollBlock from "@/components/pages/results/unlimited-scroll-block";
import {IVideo} from "@/types/videoinfo.interface";
import { searchVideos } from '@/services/algoliaservice';
import { useSearchParams } from 'next/navigation';
import FilterComponent from './filtersearch';



const ResultInfo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState({
        uploadDate: '',
        contentType: '',
        sortBy: ''
    });
 
  const search = searchParams.get('search');

  const getVideo = async (id: number): Promise<IVideo | null> => {
    try {
      const response = await fetch(`https://localhost:7154/api/Video/getvideoinfo/` + id, {
        method: 'GET',
      });
  
      if (response.ok) {
        const mydata: IVideo = await response.json();
        console.log('успешный video', mydata);
        return mydata; 
      } else {
        console.error('Ошибка получения видео:', response.statusText);
        return null; 
      }
    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
      return null; 
    }
  };

  const loadVideos = async (results: { id: number }[]) => {

    const videoPromises = results.map(result => getVideo(result.id)); 
    const videos = await Promise.all(videoPromises); 
    const successfulVideos = videos.filter(video => video !== null) as IVideo[];    
    setMoreVideos(prevVideos => {
        const existingVideoIds = prevVideos.map(video => video.id);
        const uniqueVideos = successfulVideos.filter(video => !existingVideoIds.includes(video.id));
        return [...prevVideos, ...uniqueVideos];
    });
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

  const handleSearch = async () => {
    if (search) {
        let results = await searchVideos(search);
        await loadVideos(results);
        setMoreVideos(prevVideos => applyFiltersAndSorting(prevVideos));
    }
};

useEffect(() => {
    handleSearch();
}, [filters]);

    const applyFilters = (newFilters: any) => {
        setFilters(newFilters);
    };

   

    return (
       <div  style={{marginTop:'100px', width:'100%'}}>
         <FilterComponent applyFilters={applyFilters} />
             <UnlimitedScrollBlock data={moreVideos} />
        </div>
       
    )
}

export default ResultInfo