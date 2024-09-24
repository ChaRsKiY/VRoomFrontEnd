import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import Link from "next/link";
import HeaderHome from "@/components/pages/home/header/header";

interface IMentionsTabProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}:IMentionsTabProps) => {
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
                <div className="mb-6"><br/>
                    <h1 className="text-2xl font-bold">Comments and mentions</h1>
                    <br/>
                    <div className="flex mt-2">
                        <Link target={'_self'} href={"/channel/editing/comments"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Comments</Link>
                        <a href="#" className="ml-4 mr-4 text-gray-800 border-b-2 border-gray-800 pb-2">Mentions</a>
                    </div>
                </div>
                <hr className="my-4 border-gray-300"/>
                <div className="flex-1">

                    <div className="flex flex-col items-center justify-center h-96">
                        <img src="https://placehold.co/120x120" alt="No comments illustration" className="mb-4"/>
                        <p className="text-gray-500">No mentions</p>
                    </div>
                </div>

            </div>
        </>
    );

}
export default channelPage;