"use client";//

import React, {useState, useEffect} from 'react'
import Image from "next/image";
import {IVideo} from "@/types/videoinfo.interface";
import api from '@/services/axiosApi';
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {fetchShortsOrVideosByChannelId} from "@/components/pages/channel/content/fetch-filtered-videos-by-type";
import {formatDuration} from "@/utils/dateformat";

interface IVideoCardProps {
    channelId: number;
    isShort: boolean;
    sectionName: string;
}

const VideosSection: React.FC<IVideoCardProps> = ({channelId, isShort, sectionName}) => {
    const [videos, setVideos] = useState<IVideo[]>([]);

    useEffect(() => {
        console.log(isShort);
        const fetchVideos = async () => {
            setVideos(await fetchShortsOrVideosByChannelId(1, 4, channelId, isShort));
        };
        fetchVideos();
        console.log(videos);
    }, [channelId]);

    return (
        <><h2
            className={'text-[#000] font-Inter text-[0.875rem] font-not-italic font-500 leading-normal font-semibold'}>{`${sectionName}: (${videos.length > 0 ? videos.length : 0})`}</h2>
            <div className="flex items-center h-max">
                {videos.length > 0 ? videos.map((item) => (

                        <div key={item.id} className={' mr-1.5 mb-2 cursor-pointer w-max relative'}>
                            <Image src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                                   alt={item.tittle}
                                   className={`rounded-[8px] aspect-video p-0.5`}
                                   width={125} height={110}/>
                            <div
                                className="bg-black px-1 text-[0.675rem] text-white rounded w-max absolute bottom-1.5 right-1.5">
                                {formatDuration(item.duration)}
                            </div>
                        </div>
                    )) :
                    (<div>
                        <p className={'font-Inter text-[0.875rem] font-not-italic font-400 leading-normal'}>
                            this section displays all{isShort ? 'video' : 'shorts'}</p>
                    </div>)}

            </div>
        </>


    )
}

export default VideosSection

