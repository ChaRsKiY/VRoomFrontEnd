import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {IVideo} from "@/types/videoinfo.interface";


interface IVideoCardProps {
    el: IVideo;
   
}

const VideoCardLast: React.FC<IVideoCardProps> = async ({ el }: IVideoCardProps) => {
  

    return (
        <div >

        <Link href={"/watch/" + el.id} >
        <div className='flex' style={{padding:'20px'}}>
            <div style={{paddingLeft:'40%'}}>
            <Image src={el.cover} alt={el.tittle} width={1000} height={1000} className="rounded-xl aspect-[16/9]"
            style={{minWidth:'300px'}}/>
            </div>
        
            <div >
            <div  style={{width:'400px',paddingLeft:'20px',fontSize:"18px"}}>
                    {el.tittle}
                </div>
                <div  style={{width:'400px',paddingLeft:'20px'}}>
                    
                    <div className="text-neutral-500 text-[0.9rem] flex items-center">
                        {formatNumber(el.viewCount)} views
                        <div className="rounded-full h-1.5 w-1.5 bg-neutral-600 mx-2"/>
                        {formatTimeAgo(new Date(el.uploadDate))}
                    </div>
                 </div>
                 <div style={{width:'400px',paddingLeft:'20px'}} className="text-neutral-500 text-[0.9rem] flex items-center">
                    {el.description}
                </div>
            </div>
            </div>
        </Link>
        </div>
    )
}

export default VideoCardLast