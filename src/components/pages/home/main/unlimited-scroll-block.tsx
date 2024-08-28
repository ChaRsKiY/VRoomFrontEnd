import React from 'react'
import {IPresentedVideo} from "@/types/video.interface";
import Image from "next/image";
import VideoCard from "@/components/pages/home/main/video-card";
import VideoSkeleton from "@/components/styled/video-skeleton";
import ClientScrollBlock from "@/components/pages/home/main/client-scroll-block";

const UnlimitedScrollBlock = ({ data }: { data: IPresentedVideo[] }) => {
    return (
        <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            {data.map((el) => (
                <VideoCard el={el} />
            ))}

            <ClientScrollBlock />
        </div>
    )
}

export default UnlimitedScrollBlock