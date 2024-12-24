import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import Link from "next/link";
import ContentVideos from "@/components/pages/channel/content/content-videos";
import Image from "next/image";

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
            <div className="w-52 bg-white border-r border-gray-200 h-screen overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div className="pl-[0%] max-lg:pl-[12%] max-sm:pl-0 pt-20">
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold mb-6">Content on the channel</h1>
                    <div className="flex items-center space-x-4 text-sm">
                        <Link target={'_self'} href={"/channel/editing/content"}
                              className="text-gray-700 hover:text-gray-800 pb-2">Video</Link>

                        <Link target={'_self'} href={"/channel/editing/content/shorts"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Shorts</Link>
                        <Link target={'_self'} href={"/channel/editing/content/broadcasts"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Broadcasts</Link>
                        <p className="text-gray-500 border-b-2 border-gray-800 hover:text-gray-800 pb-2">Recording</p>
                        <Link target={'_self'} href={"/channel/editing/content/playlists"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Playlists</Link>
                        <Link target={'_self'} href={"/channel/editing/content/postsonchannel"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Posts</Link>
                        <Link target={'_self'} href={"/channel/editing/content/advertising_campaigns"}
                              className="text-gray-500 hover:text-gray-800 pb-2">Advertising campaigns</Link>
                    </div>

                    <div className="flex items-center space-x-4 mb-6 my-3">
                        <button className="flex items-center text-gray-700 border border-gray-300 px-3 py-1 rounded-md">
                            <i className="fas fa-filter mr-2"></i> Filter
                        </button>
                    </div>

                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr className="text-left">
                            <th className="py-3 px-3"><input type="checkbox" className="w-5 h5"/></th>
                            <th className="py-3 px-3 text-left">Video</th>
                            <th className="py-3 px-3 text-left">Visibility</th>
                            <th className="py-3 px-3 text-left">Date</th>
                            <th className="py-3 px-3 text-left">Views</th>
                            <th className="py-3 px-3 text-left">Comments</th>
                            <th className="py-3 px-3 text-left">Likes (vs dislikes)</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                        <tr className="border-b text-left border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-3"><input type="checkbox" className="w-5 h-5"/></td>
                            <td className="py-3 px-3  flex items-center">
                                <Image width={115} height={100} src="https://placehold.co/125x70.svg"
                                       alt="Video Thumbnail 5" className="mr-4"/>
                                <span>#shorts</span>
                            </td>
                            <td className="py-3 px-3 ">Public</td>
                            <td className="py-3 px-3 ">20 Oct 2023 Published</td>
                            <td className="py-3 px-3 ">747</td>
                            <td className="py-3 px-3 ">0</td>
                            <td className="py-3 px-3 ">85.7% (6 likes)</td>
                        </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
}
export default channelPage;