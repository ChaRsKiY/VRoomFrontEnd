"use client"

import React, {useEffect, useRef, useState} from 'react'
import VideoSkeleton from "@/components/styled/video-skeleton";
import {useInView} from "framer-motion";
import {IPresentedVideo} from "@/types/video.interface";
import VideoCard from "@/components/pages/home/main/video-card";
import {data} from "@/testdata/videos";
import {IVideo} from "@/types/videoinfo.interface";

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
//                 <div key={el}>
//                     <VideoSkeleton/>
//                 </div>
//             ))}
//         </>
//     )
// }

// export default ClientScrollBlock

interface IProps {
    videolist: IVideo[]
}

const ClientScrollBlock: React.FC<IProps> = ({videolist}) => {
    const [videos, setVideos] = useState<IVideo[]>([])
    const [moreVideos, setMoreVideos] = useState<IVideo[]>([])

    const ref = useRef<HTMLDivElement | null>(null)
    const isInView: boolean = useInView(ref)

    // const getVideos = async ()=>{
    //     try {     
    //         const response = await fetch('https://localhost:7154/api/Video' , {
    //           method: 'GET',
    //         });
      
    //         if (response.ok) {
            
    //          const mydata: IVideo[] = await response.json();
    //          console.log('успешный list of video',mydata);
    //          setMoreVideos(mydata);
      
    //         } else {
    //           console.error('ownerPost:', response.statusText);
    //         }
          
    //       } catch (error) {
    //         console.error('Ошибка при подключении к серверу:', error);
    //       }
    // }

    useEffect(() => {
        if (isInView) {
            // getVideos();
            setVideos([...videos, ...videolist])
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
                <div key={el}>
                    <VideoSkeleton/>
                </div>
            ))}
           
        </>
    )
}

export default ClientScrollBlock