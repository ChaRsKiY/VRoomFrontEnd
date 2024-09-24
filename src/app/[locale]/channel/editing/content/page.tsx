import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";

interface IContentProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}:IContentProps) => {
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
                    <h1 className="text-2xl font-semibold mb-6">Content on the channel</h1>

                    <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-700 border-b-2 border-gray-900">Video</button>
                        <button className="text-gray-700">Shorts</button>
                        <button className="text-gray-700">Broadcasts</button>
                        <button className="text-gray-700">Recording</button>
                        <button className="text-gray-700">Playlists</button>
                        <button className="text-gray-700">Podcasts</button>
                        <button className="text-gray-700">Advertising campaigns</button>
                    </div>

                    <hr className="my-4 border-gray-300"/>

                    <div className="flex items-center space-x-4 mb-6">
                        <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                            <i className="fas fa-filter mr-2"></i> Filter
                        </button>
                        <button className="flex items-center text-gray-700 px-3 py-1">
                            Video
                        </button>
                    </div>


                    <div className="flex flex-col items-center justify-center h-96">
                        <img src="https://placehold.co/120x120" alt="No content illustration" className="mb-4"/>
                        <p className="text-gray-500">There's nothing here yet.</p>
                        <button className="bg-black text-white px-6 py-2 rounded-md mt-4">Add video</button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default channelPage;