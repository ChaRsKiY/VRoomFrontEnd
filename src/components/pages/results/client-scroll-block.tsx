"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useInView } from "framer-motion";
import { IVideo } from "@/types/videoinfo.interface";
import ResultsVideoSkeleton from "@/components/styled/results-video-skeleton";
import VideoCard from "@/components/pages/results/video-card";


interface IProps {
    v: IVideo[]
}
const ClientScrollBlock: React.FC<IProps> = ({ v }) => {
    const [videos, setVideos] = useState<IVideo[]>([])

    const ref = useRef<HTMLDivElement | null>(null)
    const isInView: boolean = useInView(ref)


    useEffect(() => {
        if (isInView) {
            setVideos([...videos, ...v])
        }
    }, [isInView])

    useEffect(() => {
        scrollTo(0, 0)
    }, []);

    return (
        <>
            {videos.map((el, key) => (
                <div key={key} className="px-3 mb-8">
                    <VideoCard el={el} />
                </div>
            ))}

            <div ref={ref} className="w-5 h-5" />

            {[0, 1, 2, 3].map(el => (
                <div key={el} className="px-3 mb-8 space-y-2.5 w-full">
                    <ResultsVideoSkeleton />
                </div>
            ))}
        </>
    )
}

export default ClientScrollBlock

