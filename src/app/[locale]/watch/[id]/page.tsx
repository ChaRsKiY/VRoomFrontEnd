'use client'

import React, {useState, useEffect} from 'react'
import VideoPlayer from "@/components/pages/watch/player";
import UnderVideoBlock from "@/components/pages/watch/under-video-block";
import UnderLine from "@/components/pages/watch/underline";
import DescriptionBlock from "@/components/pages/watch/description-block";
import CommentsBlock from "@/components/pages/watch/comments-block";
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";
import {data} from '@/testdata/videos';
import {IVideo} from "@/types/videoinfo.interface"
import AsideHome from "@/components/pages/home/aside/aside";
import Watch from "@/components/pages/watch/watch"

// const WatchPage: React.FC = async ({ params }: any) => {
//     const { [id] } = params;

//     const { t } = await initTranslations(params.locale, ['common', 'categories'])

//     const testVideo = {
//         [id]: 1,
//         title: "Cyberpunk 2077 - Official Trailer 2022",
//         views: 223000,
//         description: "Hello this is my new video about cars",
//         channel: {
//             avatar: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo",
//             name: "Mr Beast"
//         }
//     } as any

//     return (
//         <div className="flex w-full mt-20">
//             <HeaderHome t={t}/>
//             <div className="w-3/4 px-8">
//                 <VideoPlayer src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'} />
//                 <UnderVideoBlock video={testVideo} />
//                 <UnderLine />
//                 <DescriptionBlock description={testVideo.description} />
//                 <UnderLine />
//                 <CommentsBlock />
//             </div>
//             <div>

//             </div>
//         </div>
//     )
// }

// export default WatchPage


const WatchPage: React.FC = async ({params}: any) => {
    const {id, locale} = params;
    const {t} = await initTranslations(locale, ['common', 'categories']);


    return (
        <div className="flex w-full mt-20">
            {t && <HeaderHome t={t}/>}

            <Watch id={id}/>
        </div>
    );
};

export default WatchPage;