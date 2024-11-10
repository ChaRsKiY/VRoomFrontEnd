'use client'

import React, { useEffect, useState } from 'react'
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import { IVideo } from "@/types/videoinfo.interface";
import { searchVideos } from '@/services/algoliaservice';
import { useSearchParams } from 'next/navigation';
import api from '@/services/axiosApi';


const MainByCategoryInfo: React.FC = () => {

    const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
    const searchParams = useSearchParams();

    const search = searchParams.get('search');

    const getVideo = async (id: number): Promise<IVideo | null> => {
        try {
            const response = await api.get(`/Video/getvideoinfo/` + id);

            if (response.status === 200) {
                const mydata: IVideo = await response.data;
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
        setMoreVideos([]);
        const videoPromises = results.map(result => getVideo(result.id));
        const videos = await Promise.all(videoPromises);
        const successfulVideos = videos.filter(video => video !== null) as IVideo[];
        setMoreVideos(prevVideos => {
            const existingVideoIds = prevVideos.map(video => video.id);
            const uniqueVideos = successfulVideos.filter(video => !existingVideoIds.includes(video.id));
            return [...prevVideos, ...uniqueVideos];
        });
    };


    const handleSearch = async () => {
        if (search) {
            let results = await searchVideos(search);
            await loadVideos(results);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [search]);


    return (
        <div style={{ marginTop: '80px', width: '98%' }}>
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '24px', paddingLeft: '100px' }}>{search}</div>
                <UnlimitedScrollBlock data={moreVideos} />
            </div>
        </div>

    )
}

export default MainByCategoryInfo