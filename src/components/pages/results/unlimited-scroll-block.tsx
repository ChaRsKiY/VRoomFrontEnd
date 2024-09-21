import React from 'react'
import {IPresentedVideo} from "@/types/video.interface";
import VideoCard from "@/components/pages/results/video-card";
import ClientScrollBlock from "@/components/pages/results/client-scroll-block";

interface IUnlimitedScrollBlockProps {
    data: IPresentedVideo[]
}

const UnlimitedScrollBlock: React.FC<IUnlimitedScrollBlockProps> = ({ data }: IUnlimitedScrollBlockProps) => {
    return (
        <div className="pr-[2%] max-sm:pr-0 flex-1">
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