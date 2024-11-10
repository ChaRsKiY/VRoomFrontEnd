"use client"

import React, {useState, useEffect} from 'react';
import {IVideo} from "@/types/videoinfo.interface"
import api from '@/services/axiosApi';
import ShortFollowInfo from "@/components/pages/shorts/short-follow-info";
import ShortCommentsBlock from "@/components/pages/shorts/comments/short-comments-block";
import ShortPlayer from "@/components/pages/shorts/shorts-player";

interface IProps {

    id: number;

}

const ShortWatch: React.FC<IProps> = ({id}) => {

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
                    <div className="flex flex-row">
                        <ShortFollowInfo video={video}/>
                        <div className={'shrink-0 ml-3.5'}>
                            <ShortPlayer src={video.videoUrl} id={video.id} viewCount={video.viewCount}/>
                        </div>
                        <div className={'shrink-0 ml-3.5 w-max'}>
                            <ShortCommentsBlock videoid={video.id}/>
                        </div>
                        {/*<div className="absolute bottom-4 left-0 right-0 pl-3 justify-items-start">
                            <div className="flex flex-col justify-between mb-2">
                                <FollowShortBlock short={video}/>
                                <DescriptionShortBlock description={video.description} tags={'#tags'}/>
                            </div>
                        </div>*/}
                    </div>
                    {/*<RightShortBlock short={video}/>*/}

                </div>

            ) : (
                <></>
            )}
        </>

    )
}

export default ShortWatch;