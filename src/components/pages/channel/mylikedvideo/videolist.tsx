'use client'

import React, {useState,useEffect} from 'react'
import VideoCard from "@/components/pages/results/video-card";
import {IVideo} from "@/types/videoinfo.interface";

interface IBlockProps {
    data: IVideo[];
}

const VideoList: React.FC<IBlockProps> = ({ data }: IBlockProps) => {
    return (
        <div  >
            <div style={{textAlign:'center',marginBottom:'20px',fontWeight:'bold', fontSize:'20px'}}>Your liked videos:</div>
        <div className="pr-[2%] max-sm:pr-0 flex-1">
            {data.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5">
                    <VideoCard el={el} />
                </div>
            ))}
            {data.length==0? ( <div className="px-3 mb-8 space-y-2.5"  >
                No liked videos found...
            </div> ):<></>}

        </div>
        </div>
    )
}

export default VideoList