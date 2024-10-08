import React, { FC } from "react";
import initTranslations from "@/app/i18n";
import { data } from "@/testdata/videos";
import AsideHome from "@/components/pages/home/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import LikedVideos from "@/components/pages/home/main/liked-video-block";
import { RiShuffleFill, RiSlideshow3Line } from "react-icons/ri";

interface IHomeProps {
  params: {
    locale: string;
  };
}

const Home: FC<IHomeProps> = async ({ params: { locale } }) => {
    const { t } = await initTranslations(locale, ['common', 'categories']);
    const firstVideo = data[0];
    return (
        <>
          <HeaderHome t={t} /> 
          <div className="flex pt-20 overflow-hidden h-screen"> 

            <AsideHome t={t} /> 
    
            <div className="sticky top-[80px] ml-[20%] w-1/3 bg-gray-400 text-white p-5 rounded-lg h-[calc(100vh-80px)] flex flex-col justify-start z-10"> 
              <img
                src={firstVideo.cover}
                alt={firstVideo.title}
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{t('liked video')}</h2>
              <p className="mb-4">{firstVideo.title}</p>
              <div className="flex space-x-4">
                <button className="bg-blue-500 text-white px-16 py-2 rounded-lg">
                  <RiSlideshow3Line /> {t('Play')}
                </button>
                <button className="bg-gray-700 text-white px-6 py-2 rounded-lg">
                  <RiShuffleFill /> {t('Shuffle')}
                </button>
              </div>
            </div>

            <main className="flex-grow overflow-y-scroll h-[calc(100vh-80px)] pl-10"> 
              <div className="flex-grow p-5">
                <LikedVideos t={t} /> 
              </div>
            </main>
          </div>
        </>
      );
    };
    
  
  export default Home;