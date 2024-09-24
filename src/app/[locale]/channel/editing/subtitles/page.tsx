import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";

interface ISubtitlesProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}:ISubtitlesProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden">

                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">КSubtitles for videos on the channel</h1>

                    <div className="flex items-center space-x-9 text-sm">
                        <button className="text-gray-700 border-b-2 border-gray-900">All</button>
                        <button className="text-gray-700">Foul copy</button>
                        <button className="text-gray-700">Published</button>
                    </div>

                    <hr className="my-4 border-gray-300"/>


                </div>
            </div>
        </>
    );
}
export default channelPage;