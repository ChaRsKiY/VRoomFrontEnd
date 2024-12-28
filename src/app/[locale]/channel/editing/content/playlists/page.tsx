import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import Link from "next/link";
import ContentPlaylists from "@/components/pages/channel/content/content-playlist";

interface IContentProps {
    params: { locale: string; }
}

const channelPage = async ({ params: { locale } }: IContentProps) => {
    const { t } = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t} />
            </div>
            <div className="w-52 bg-white border-r border-gray-200 h-screen overflow-hidden">
                <AsideHome t={t} />
            </div>
            <div className="pl-[0%] w-full max-lg:pl-[12%] max-sm:pl-0 pt-20">
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Content on the channel</h1>
                    <div className="flex items-center space-x-4 text-sm">
                        <Link target={'_self'} href={"/channel/editing/content"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Video</Link>
                        <Link target={'_self'} href={"/channel/editing/content/shorts"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Shorts</Link>
                        <Link target={'_self'} href={"/channel/editing/content/broadcasts"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Broadcasts</Link>
                        <Link target={'_self'} href={"/channel/editing/content/recording"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Recording</Link>
                        <Link target={'_self'} href={"/channel/editing/content/postsonchannel"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Posts</Link>

                        <Link target={'_self'} href={"/channel/editing/content/podcasts"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Podcasts</Link>
                        <Link target={'_self'} href={"/channel/editing/content/advertising_campaigns"}
                            className="text-gray-500 hover:text-gray-800 pb-2">Advertising campaigns</Link>
                    </div>

                    <ContentPlaylists />

                </div>
            </div>
        </>
    );
}
export default channelPage;