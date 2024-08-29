import React from 'react'
import Image from "next/image";
import {IPresentedVideo} from "@/types/video.interface";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";

interface IVideoCardProps {
    el: IPresentedVideo
}

const VideoCard: React.FC<IVideoCardProps> = ({ el }: IVideoCardProps) => {
    return (
        <Link href={"/watch/" + el.href} className="space-y-2.5">
            <Image src={el.cover} alt={el.title} width={1000} height={1000} className="rounded-xl aspect-[16/9]"/>
            <div className="flex space-x-2.5">
                <Image src={el.channel.avatar} alt={el.channel.name} width={35} height={35}
                       className="rounded-full w-9 h-9"/>
                <div>
                    <div className="font-bold mb-0.5">{el.title}</div>
                    <div className="text-neutral-500 text-[0.9rem]">{el.channel.name}</div>
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        {formatNumber(el.views)} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {formatTimeAgo(el.posted)}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard