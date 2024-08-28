import React from 'react'
import Image from "next/image";
import {IPresentedVideo} from "@/types/video.interface";

const VideoCard: React.FC = ({el}: IPresentedVideo) => {
    return (
        <div className="px-3 mb-8 space-y-2.5">
            <Image src={el.cover} alt={el.title} width={1000} height={1000} className="rounded-xl aspect-[16/9]"/>
            <div className="flex space-x-2.5">
                <Image src={el.channel.avatar} alt={el.channel.name} width={35} height={35}
                       className="rounded-full w-9 h-9"/>
                <div>
                    <div className="font-bold mb-0.5">{el.title}</div>
                    <div className="text-neutral-500 text-[0.9rem]">{el.channel.name}</div>
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        {el.views} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {el.posted.toDateString()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCard