'use client'

import React, {useEffect, useState} from 'react'
import UnlimitedScrollBlock from "@/components/pages/results/unlimited-scroll-block";
import {IVideo} from "@/types/videoinfo.interface";
import { searchVideos } from '@/services/algoliaservice';
import { useSearchParams } from 'next/navigation'



const ResultInfo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
    const searchParams = useSearchParams();
 
  const search = searchParams.get('search');

    const handleSearch = async () => {
        if(search){ 
       await searchVideos(search)
      .then((data) => {
          console.log(data);
          const searchResults: any[] = data;
          setMoreVideos(searchResults);
        });
    }

    };
    useEffect(()=>{
        handleSearch();
    },[])

    return (
       
             <UnlimitedScrollBlock data={moreVideos} />
       
    )
}

export default ResultInfo