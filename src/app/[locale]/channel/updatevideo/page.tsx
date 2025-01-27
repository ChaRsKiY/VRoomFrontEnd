"use client";
import React from 'react';
import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import initTranslations from "@/app/i18n";
import VideoUpdateInterface from "@/components/pages/channel/updatevideo/updatevideo"

interface IHomeProps {
  params: {
    locale: string;
  };
}

const UpdateVideoPage: React.FC = async ({params}: any) => {

  const {t} = await initTranslations(params.locale, ['common', 'categories'])


  return (
      <div className="flex w-full mt-20">
          <HeaderHome t={t}/>
          <div className="flex pt-20 overflow-hidden">
              <AsideHome t={t}/>
          </div>
          <div className="pl-[20%] w-full max-w-[1300px] flex justify-center max-lg:pl-[12%] max-sm:pl-0">
              <VideoUpdateInterface />
          </div>
          <div>

          </div>
      </div>
  )
}

export default UpdateVideoPage
