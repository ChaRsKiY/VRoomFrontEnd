import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";
import {formatDuration} from "@/utils/dateformat";


interface IVideoCardProps {
    el: IVideo;

}

const VideoCard: React.FC<IVideoCardProps> = async ({el}: IVideoCardProps) => {


    return (
        <div>
            <Link href={"/watch/" + el.id} className="space-y-2.5 flex">
                <div className={' relative'}>
                    <Image src={el.cover} alt={el.tittle} width={1000} height={1000}
                           className="rounded-xl aspect-[16/9]"/>
                    <div
                        className="bg-black px-1 text-[0.785rem] text-white rounded w-max absolute bottom-1.5 right-1.5">
                        {formatDuration(el.duration)}
                    </div>
                </div>
                <div className="flex space-x-2.5">
                    <div>
                        <div className="font-bold mb-0.5"
                             style={{maxHeight: '50px', overflow: 'hidden'}}>{el.tittle}</div>
                        <div className="text-neutral-500 text-[0.9rem]">{el.channelNikName}</div>
                        <div className="text-neutral-500 text-[0.9rem] flex items-center">
                            {formatNumber(el.viewCount)} views
                            <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                            {formatTimeAgo(new Date(el.uploadDate))}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default VideoCard