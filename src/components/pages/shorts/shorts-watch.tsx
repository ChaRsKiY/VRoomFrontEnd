"use client"

import React, { useState, useEffect } from 'react';
import { IVideo } from "@/types/videoinfo.interface"
import ShortsPlayer from "@/components/pages/shorts/shorts-player";
import FollowShortBlock from "@/components/pages/shorts/follow-short-block";
import DescriptionShortBlock from "@/components/pages/shorts/description-short-block";
import RightShortBlock from "@/components/pages/shorts/right-shorts-block";
import { IContentVideo } from "@/types/videoDTO.interface";
import ClientHome from "@/components/pages/channel/ClientHome";
import OpenShareDialogButton from "@/components/pages/shorts/share-button";
import api from '@/services/axiosApi';

interface IProps {

    id: number;

}

const ShortWatch: React.FC<IProps> = ({ id }) => {

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
        <>
            {video ? (
                <div className="items-center text-sm lg:flex">
                    <div className="relative">
                        <ShortsPlayer src={video.videoUrl} id={video.id} />
                        <div className="absolute bottom-4 left-0 right-0 pl-3 justify-items-start">
                            <div className="flex flex-col justify-between mb-2">
                                <FollowShortBlock short={video} />
                                <DescriptionShortBlock description={video.description} tags={'#tags'} />
                            </div>
                        </div>
                    </div>
                    <RightShortBlock short={video} />
                    {/*<OpenShareDialogButton/>*/}
                </div>

                /*<div className="w-3/4 px-8">
                    <VideoPlayer src={video.videoUrl} [id]={video.[id]}/>
                    <UnderVideoBlock video={video} />
                    <UnderLine />
                    <DescriptionBlock description={video.description} />
                    <UnderLine />
                    <CommentsBlock videoid={[id]} />
                </div>*/
            ) : (
                <></>
            )}
        </>

    )
}

export default ShortWatch;