'use client'

import React, { useEffect, useState} from 'react'
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import {data} from "@/testdata/videos";
import UnlimitedScrollBlock from "@/components/pages/results/unlimited-scroll-block";
import HeaderHome from "@/components/pages/home/header/header";
import {IVideo} from "@/types/videoinfo.interface";
import ResultInfo from "@/components/pages/results/resultlist"

interface Props {
    params: {
        locale: string;
    }
}

// const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
//     const { t } = await initTranslations(locale, ['common', 'categories'])

//     return (
//         <>
//             <HeaderHome t={t}/>
//             <div className="flex pt-20 overflow-hidden">
//                 <AsideHome t={t}/>
//             </div>
//             <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
//                 <UnlimitedScrollBlock data={data} />
//             </main>
//         </>
//     )
// }

// export default ResultsPage



// const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
//     const { t } = await initTranslations(locale, ['common', 'categories'])
//     const [moreVideos, setMoreVideos] = useState<IVideo[]>([])

//     const getVideos = async ()=>{
//         try {     
//             const response = await fetch('https://localhost:7154/api/Video' , {
//               method: 'GET',
//             });
      
//             if (response.ok) {
            
//              const mydata: IVideo[] = await response.json();
//              console.log('успешный list of video',mydata);
//              setMoreVideos(mydata);
      
//             } else {
//               console.error('ownerPost:', response.statusText);
//             }
          
//           } catch (error) {
//             console.error('Ошибка при подключении к серверу:', error);
//           }
//     }

//     getVideos();

//     return (
//         <>
//             <HeaderHome t={t}/>
//             <div className="flex pt-20 overflow-hidden">
//                 <AsideHome t={t}/>
//             </div>
//             <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
//                 <UnlimitedScrollBlock data={moreVideos} />
//             </main>
//         </>
//     )
// }

// export default ResultsPage



const ResultsPage: React.FC<Props> = async ({ params: { locale } }: Props) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])  

    return (
        <>
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                <ResultInfo />
            </main>
        </>
    )
}

export default ResultsPage