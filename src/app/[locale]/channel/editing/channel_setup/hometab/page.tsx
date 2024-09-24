import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import Image from "next/image";
import Link from "next/link";
import HeaderHome from "@/components/pages/home/header/header";

interface IHomeTabProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}:IHomeTabProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">{/*flex pt-20 overflow-hidden*/}
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden pl-[2.5%] max-sm:pl-0">
                {/*pl-[22.5%] max-lg:pl-[12%]*/}
                <div className="flex-1 pt-0 pb-6 pr-6">

                    <div className="mb-6"><br/>
                        <h1 className="text-2xl font-bold">Channel settings</h1>
                        <br/>
                        <div className="flex mt-2">
                            <Link target={'_self'} href={"/channel/editing/channel_setup/profile"}
                                  className="mr-4 text-gray-800 pb-2">Profile</Link>
                            <a href="#" className="text-gray-500 border-b-2 border-gray-800 hover:text-gray-800 pb-2">Tab
                                "main"</a>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg mb-6">
                        <section className="bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Home Tab</h2>
                            <p className="text-gray-600 mb-6">The Home tab allows you to recommend content for
                                to your audience</p>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Layout</h3>
                                <button className="text-blue-600 font-medium hover:underline">Add section</button>
                            </div>
                            <div className="space-y-4">

                                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">For you</h4>
                                        <p className="text-sm text-gray-600">In this section, viewers will see
                                            recommendations
                                            based on their
                                            interests.</p>
                                        <a href="#" className="text-sm text-blue-600 hover:underline">More Settings</a>
                                    </div>
                                    <button className="text-gray-500"><i className="fas fa-bars"></i></button>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">Video (0)</h4>
                                        <p className="text-sm text-gray-600">This section will appear if you download
                                            video</p>
                                    </div>
                                    <button className="text-gray-500"><i className="fas fa-bars"></i></button>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">Short videos (0)</h4>
                                        <p className="text-sm text-gray-600">This section will appear after you
                                            upload short
                                            video</p>
                                    </div>
                                    <button className="text-gray-500"><i className="fas fa-bars"></i></button>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">Completed broadcasts (0)</h4>
                                        <p className="text-sm text-gray-600">This section will appear if you create
                                            direct recording
                                            broadcasts</p>
                                    </div>
                                    <button className="text-gray-500"><i className="fas fa-bars"></i></button>
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">Created playlists (0)</h4>
                                        <p className="text-sm text-gray-600">This section will appear if you create
                                            public
                                            playlist</p>
                                    </div>
                                    <button className="text-gray-500"><i className="fas fa-bars"></i></button>
                                </div>
                            </div>
                        </section>
                    </div>


                </div>
            </div>
        </>
    );
}
export default channelPage;