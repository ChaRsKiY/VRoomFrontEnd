"use client"

import React, {useEffect, useRef, useState} from 'react'
import VideoSkeleton from "@/components/styled/video-skeleton";
import {useInView} from "framer-motion";
import {IPresentedVideo} from "@/types/video.interface";
import VideoCard from "@/components/pages/home/main/video-card";

const ClientScrollBlock: React.FC = () => {
    const [videos, setVideos] = useState<IPresentedVideo[]>([])

    const ref = useRef(null)
    const isInView = useInView(ref)

    const data: IPresentedVideo[] = [
        {
            id: 1,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 2,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/RwVNbhX_fzg/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA4f9qfEetuCsHgJZediQpbjD3qEw",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 3,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/KdGfhSpT6pc/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCfBm7wbYYcuPv8_2C_pFOyDLvBRA",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 4,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        },
        {
            id: 5,
            title: "Baldurs Gate 3 Evil Playthrough is BRUTAL",
            views: 129000,
            posted: new Date(),
            cover: "https://i.ytimg.com/vi/ndAQfTzlVjc/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFQoSDAP&rs=AOn4CLD3yIfsCPW6yLCfAhC1XDI-ZydQ4g",
            channel: {
                avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
                name: "Mr Beast"
            }
        }
    ]

    useEffect(() => {
        if (isInView) {
            setVideos([...videos, ...data])
        }
    }, [isInView])

    console.log(isInView)

    return (
        <>
            {videos.map((el, key) => (
                <div key={key}>
                    <VideoCard el={el} />
                </div>
            ))}

            {[0, 1, 2, 3].map(el => (
                <div key={el}>
                    <VideoSkeleton />
                </div>
            ))}

            <div ref={ref} className="w-5 h-5" />
        </>
    )
}

export default ClientScrollBlock