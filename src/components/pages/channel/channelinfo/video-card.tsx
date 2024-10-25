import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";


interface IVideoCardProps {
    el: IVideo;
   
}

const VideoCard: React.FC<IVideoCardProps> = async ({ el }: IVideoCardProps) => {
  

    return (
        <div>

        <Link href={"/watch/" + el.id} className="space-y-2.5">
            <Image src={el.cover} alt={el.tittle} width={1000} height={1000} className="rounded-xl aspect-[16/9]"/>
            <div style={{maxHeight:'50px',overflow:'hidden'}}>
                    {el.description}
                </div>
            <div className="flex space-x-2.5">
                
                <div>
                    
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