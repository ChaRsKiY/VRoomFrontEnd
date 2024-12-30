import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import PublishedSubtitleslist from "@/components/pages/channel/subtitle/published";
import Link from "next/link";

interface ISubtitlesProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: ISubtitlesProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories', 'channel']);


    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden pt-20">

                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Subtitles for videos on the channel</h1>

                    <div className="flex items-center space-x-9 text-sm">
                        <Link target={'_self'} href={"/channel/editing/subtitles"}
                              className="text-gray-700 border-b-2 border-gray-900">All</Link>
                        <Link target={'_self'} href={"/channel/editing/subtitles/foulcopy"}
                              className="text-gray-700 border-b-2 border-gray-900">Foul copy</Link>
                        <Link target={'_self'} href={"/channel/editing/subtitles/published"}
                              className="text-gray-700 border-b-2 border-gray-900"
                              style={{
                                  backgroundColor: 'black', color: 'white', fontWeight: 'bold',
                                  padding: '10px', borderRadius: "8px"
                              }}>Published</Link>
                    </div>

                    <hr className="my-4 border-gray-300"/>


                </div>
                <PublishedSubtitleslist/>

            </div>
        </>
    );
}
export default channelPage;