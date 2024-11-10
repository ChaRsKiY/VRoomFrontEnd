import React from 'react'
import Image from "next/image";
import { IPresentedVideo } from "@/types/video.interface";
import Link from "next/link";
import { formatNumber, formatTimeAgo } from "@/utils/format";
import { IVideo } from "@/types/videoinfo.interface";


interface IVideoCardProps {
    el: IVideo
}

const VideoCard: React.FC<IVideoCardProps> = ({ el }: IVideoCardProps) => {


    return (
        <Link href={"/watch/" + el.id} className="flex w-full max-sm:flex-col max-sm:px-[5%]">
            <Image src={el.cover} alt={el.tittle} width={600} height={600} className="w-2/3 mr-4 rounded-xl aspect-[16/9] max-sm:w-full" 
            style={{minWidth:'50%', maxWidth:'50%'}}/>
            <div className="flex space-x-2.5  max-sm:w-full max-sm:mt-2" >
                <div >
                    <div className="font-bold mb-0.5">{el.tittle}</div>
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        {formatNumber(el.viewCount)} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2" />
                        {formatTimeAgo(new Date(el.uploadDate))}
                    </div>
                    <div className="flex items-center space-x-2 my-1">
                        <Image src={el.channelBanner} alt={el.channelName} width={30} height={30}
                            className="rounded-full w-9 h-9" />
                        <div className="text-neutral-500 text-[0.9rem]">{el.channelName}</div>
                    </div>

                    <div className="text-neutral-500 text-[0.9rem]">{el.description}</div>
                </div>
            </div>
        </Link>
    )
}

export default VideoCard