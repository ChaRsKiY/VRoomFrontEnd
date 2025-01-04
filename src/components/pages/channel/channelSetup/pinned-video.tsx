"use client";

import React, {useState, useEffect} from 'react'
import Image from "next/image";
import {IVideo} from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";

interface IVideoCardProps {
    channelId: number;
}

const VideosSection: React.FC<IVideoCardProps> = ({channelId}) => {
    const [videos, setVideos] = useState<IVideo[]>([]);

    useEffect(() => {
        console.log(channelId);
        const fetchHistory = async () => {
            const response = await api.get(`/PinnedVideo/getispinnedvideobychannelid/${channelId}`, {
                params: {channelid: channelId,},
            });

            const hist = await response.data;
            setVideos(hist);
        };

        fetchHistory();
    }, [channelId]);


    return (

        <div className="flex items-center ">
            {videos.length > 0 ? videos?.map((item) => (

                    <div key={item.id} className={' mr-1.5  mb-4 cursor-pointer w-max'}>
                        <Image
                            src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                            alt={item.tittle} className={'rounded-[8px] aspect-video p-0.5'}
                            width={117} height={102}/>
                    </div>
                )) :
                (<div>
                    <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                        В этом разделе отображаются все видео</p>
                </div>)}

        </div>


    )
}

export default VideosSection