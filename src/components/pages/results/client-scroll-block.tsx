"use client"

import React, {useEffect, useRef, useState} from 'react'
import {useInView} from "framer-motion";
import {IPresentedVideo} from "@/types/video.interface";
import {IVideo} from "@/types/videoinfo.interface";
import {data} from "@/testdata/videos";
import ResultsVideoSkeleton from "@/components/styled/results-video-skeleton";
import VideoCard from "@/components/pages/results/video-card";

// const ClientScrollBlock: React.FC = () => {
//     const [videos, setVideos] = useState<IPresentedVideo[]>([])

//     const ref = useRef<HTMLDivElement | null>(null)
//     const isInView: boolean = useInView(ref)


//     useEffect(() => {
//         if (isInView) {
//             setVideos([...videos, ...data])
//         }
//     }, [isInView])

//     useEffect(() => {
//         scrollTo(0, 0)
//     }, []);

//     return (
//         <>
//             {videos.map((el, key) => (
//                 <div key={key} className="px-3 mb-8">
//                     <VideoCard el={el}/>
//                 </div>
//             ))}

//             <div ref={ref} className="w-5 h-5"/>

//             {[0, 1, 2, 3].map(el => (
//                 <div key={el} className="px-3 mb-8 space-y-2.5 w-full">
//                     <ResultsVideoSkeleton/>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default ClientScrollBlock

const ClientScrollBlock: React.FC = () => {
    const [videos, setVideos] = useState<IVideo[]>([])
    const [moreVideos, setMoreVideos] = useState<IVideo[]>([])

    const ref = useRef<HTMLDivElement | null>(null)
    const isInView: boolean = useInView(ref)

    const getVideos = async ()=>{
        try {     
            const response = await fetch('https://localhost:7154/api/Video' , {
              method: 'GET',
            });
      
            if (response.ok) {
            
             const mydata: IVideo[] = await response.json();
             console.log('успешный list of video',mydata);
             setMoreVideos(mydata);
      
            } else {
              console.error('ownerPost:', response.statusText);
            }
          
          } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
          }
    }

    getVideos();

    useEffect(() => {
        if (isInView) {
            setVideos([...videos, ...moreVideos])
        }
    }, [isInView])

    useEffect(() => {
        scrollTo(0, 0)
    }, []);

    return (
        <>
            {videos.map((el, key) => (
                <div key={key} className="px-3 mb-8">
                    <VideoCard el={el}/>
                </div>
            ))}

            <div ref={ref} className="w-5 h-5"/>

            {[0, 1, 2, 3].map(el => (
                <div key={el} className="px-3 mb-8 space-y-2.5 w-full">
                    <ResultsVideoSkeleton/>
                </div>
            ))}
        </>
    )
}

export default ClientScrollBlock