"use client"

import React from 'react';
import {IVideo} from "@/types/videoinfo.interface"
import api from '@/services/axiosApi';
import ShortFollowInfo from "@/components/pages/shorts/short-follow-info";
import ShortCommentsBlock from "@/components/pages/shorts/comments/short-comments-block";
import ShortPlayerv3 from "@/components/pages/shorts/shorts-player";
import ShortsPlayerX from "@/components/pages/shorts/shorts-player-x";

interface IProps {
    video: IVideo;
    isActive: boolean;
}

const ShortCard: React.FC<IProps> = ({video, isActive}) => {


    return (
        <>
            {video ? (
                // <div className="items-center text-sm lg:flex">
                <div className="flex flex-row">
                    <ShortFollowInfo video={video}/>
                    <div className={'shrink-0 ml-3.5'}>
                        <ShortsPlayerX src={video.videoUrl} id={video.id} viewCount={video.viewCount}
                                       isActive={isActive}/>
                    </div>
                    <div className={'shrink-0 ml-3.5 min-w-[24.5rem] w-max'}>
                        <ShortCommentsBlock videoid={video.id}/>
                    </div>
                </div>
                // </div>

            ) : (
                <></>
            )}
        </>

    )
}

export default ShortCard;