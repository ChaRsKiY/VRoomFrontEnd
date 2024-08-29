import React from 'react'
import {IPresentedVideo} from "@/types/video.interface";
import VideoCard from "@/components/pages/home/main/video-card";
import ClientScrollBlock from "@/components/pages/home/main/client-scroll-block";

interface IUnlimitedScrollBlockProps {
    data: IPresentedVideo[]
}

const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
    return (
        <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {data.map((el, key) => (
                <div key={key} className="px-3 mb-8 space-y-2.5">
                    <VideoCard el={el} />
                </div>
            ))}

            <ClientScrollBlock />
        </div>
    )
}

export default UnlimitedScrollBlock