import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import Link from "next/link";
import ContentVideo from "@/components/pages/channel/content/content-videosV2";

interface IContentProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: IContentProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories', 'channel']);
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-52 bg-white border-r border-gray-200 h-screen overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <main className="pl-[3%] max-lg:pl-[12%] w-full max-sm:pl-0 pt-20">
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Content on the channel</h1>
                    <div className="flex items-center space-x-4 text-sm">
                        <p className="text-gray-500 border-b-2 border-gray-800 hover:text-gray-800 pb-2">Video</p>

                        <Link target={'_self'} href={"/channel/editing/content/shorts"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Shorts</Link>

                        <Link target={'_self'} href={"/channel/editing/content/postsonchannel"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Posts</Link>

                    </div>

                    <ContentVideo isShort={false}/>

                </div>
            </main>
        </>
    );
}
export default channelPage;
