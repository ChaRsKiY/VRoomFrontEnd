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

  const handleSearch = async () => {
    if (search) {
        let results = await searchVideos(search);

        // Фильтрация по дате загрузки
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

        // Фильтрация по типу контента
        if (filters.contentType=== 'shorts') {
            results = results.filter((video: any) => video.isShort === true);
        }
        else if (filters.contentType=== 'video') {
            results = results.filter((video: any) => video.isShort === false);
        }

        // Сортировка
        if (filters.sortBy === 'date') {
            results = results.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        } else if (filters.sortBy === 'views') {
            results = results.sort((a: any, b: any) => b.viewCount - a.viewCount);
        }
        else if (filters.sortBy === 'rating') {
        results = results.sort((a: any, b: any) => b.likeCount - a.likeCount);
        }

        setMoreVideos(results);
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