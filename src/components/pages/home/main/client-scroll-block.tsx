"use client"

import React, { useState, useEffect, useRef } from 'react';
import { IVideo } from "@/types/videoinfo.interface";
import VideoCard from "@/components/pages/home/main/video-card";
import { useInView } from 'framer-motion';
import VideoSkeleton from "@/components/styled/video-skeleton";

interface IProps {
    videolist: IVideo[]
}

const ClientScrollBlock: React.FC<IProps> = ({ videolist }) => {
    const [videos, setVideos] = useState<IVideo[]>(videolist);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });

    const loadMoreVideos = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const response = await fetch('/api/videos?offset=' + videos.length);
            if (response.ok) {
                const newVideos: IVideo[] = await response.json();
                if (newVideos.length > 0) {
                    setVideos(prev => [...prev, ...newVideos]);
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (isInView) {
            loadMoreVideos();
        }
    }, [isInView]);

    useEffect(() => {
        scrollTo(0, 0);
    }, []);

    return (
        <>
            {videos.map((el, key) => (
                <div key={key} className="px-3 mb-8">
                    <VideoCard el={el} />
                </div>
            ))}

            {loading && [0, 1, 2, 3].map(el => (
                <div key={el}>
                    <VideoSkeleton />
                </div>
            ))}

            {hasMore && !loading && <div ref={ref} className="w-5 h-5" />}
        </>
    );
}

export default ClientScrollBlock;
