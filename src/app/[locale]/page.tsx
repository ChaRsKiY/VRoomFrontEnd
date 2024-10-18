// 'use client'

import React from 'react'
import initTranslations from "@/app/i18n";
import UnlimitedScrollBlock from "@/components/pages/home/main/unlimited-scroll-block";
import AsideHome from "@/components/pages/home/aside/aside";
import {data} from "@/testdata/videos";
import HeaderHome from "@/components/pages/home/header/header";
import {IVideo} from "@/types/videoinfo.interface";
import MainInfo from "@/components/pages/home/main/mainlist"

// interface IHomeProps {
//     params: {
//         locale: string;
//     }
// }

// const Home = async ({ params: { locale } }: IHomeProps) => {
//     const { t } = await initTranslations(locale, ['common', 'categories'])

//   return (
//       <>
//           <HeaderHome t={t}/>
//           <div className="flex pt-20 overflow-hidden">
//               <AsideHome t={t}/>
//           </div>
//           <main className="pl-[20%] max-lg:pl-[12%] max-sm:pl-0 pt-20">
//               <UnlimitedScrollBlock data={data}/>
//           </main>
//       </>
//   );
// }

// export default Home


// interface Props {
//     params: {
//         locale: string;
//     }
// }

// const Home: React.FC<Props> = async ({ params: { locale } }: Props) => {
//     const [moreVideos, setMoreVideos] = useState<IVideo[]>([]);
//     const [t, setT] = useState<any>(null);
  
//     const loadTranslations = async () => {
//       const { t } = await initTranslations(locale, ['common', 'categories']);
//       setT(t);
//     };
 
//     const getVideos = async () => {
//       try {
//         const response = await fetch('https://localhost:7154/api/Video', {
//           method: 'GET',
//         });
  
//         if (response.ok) {
//           loadTranslations();
//           const mydata: IVideo[] = await response.json();
//           console.log('успешный list of video', mydata);
//           setMoreVideos(mydata);
//         } else {
//           console.error('Ошибка получения видео:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Ошибка при подключении к серверу:', error);
//       }
//     };
  
//     useEffect(() => {
     
//       getVideos();
//     }, [locale]);
  
//     return (
//       <>
//         {t && <HeaderHome t={t} />}
//         <div className="flex pt-20 overflow-hidden">
//           {t && <AsideHome t={t} />}
//         </div>
//         <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
//           <UnlimitedScrollBlock data={moreVideos} />
//         </main>
//       </>
//     );
//   };
  
//   export default Home;

// interface Props {
//     params: {
//         locale: string;
//     }
// }

// const Home: React.FC<Props> = async ({ params: { locale } }: Props) => {
  
//   const { t } = await initTranslations(locale, ['common', 'categories']);
  

//   return (
//     <>
//       {t && <HeaderHome t={t} />}
//       <div className="flex pt-20 overflow-hidden">
//         {t && <AsideHome t={t} />}
//       </div>
//       <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
//         <MainInfo />
//       </main>
//     </>
//   );
// };

// export default Home;


interface Props {
  params: {
      locale: string;
  }
}

const Home: React.FC<Props> = async ({ params: { locale } }: Props) => {
 
    const { t } = await initTranslations(locale, ['common', 'categories']);
  

  return (
      <>
          <div className="flex pt-20 overflow-hidden">
              {t && <HeaderHome t={t}/>}
          </div>
              <div className="flex pt-20 overflow-hidden">
                  {t && <AsideHome t={t}/>}
              </div>
              <main className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                  {/* <UnlimitedScrollBlock  /> */}
                  <MainInfo/>
              </main>
          </>
          );
          };

          export default Home;