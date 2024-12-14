"use client"

import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import Image from "next/image";
import Link from "next/link";
import HeaderHome from "@/components/pages/home/header/header";
//import SectionsSettings from "@/components/pages/channel/channelSetup/sections";

import SectionsSettings from "@/components/pages/channel/channelSetup/sectionsV2";

interface IHomeTabProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: IHomeTabProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories']);
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden pl-[2.75%] max-sm:pl-0 pt-20">
                <h1 className="text-2xl font-bold pl-3">Channel settings</h1>
                <div className="flex-1  pt-0 pb-6 pl-6 pr-6">

                    {/*<div className="mb-6"><br/>

                        <div className="flex mt-2">
                            <Link target={'_self'} href={"/channel/editing/channel_setup/profile"}
                                  className="mr-4 text-gray-800 pb-2">Profile</Link>
                            <a href="#" className="text-gray-500 border-b-2 border-gray-800 hover:text-gray-800 pb-2">Tab
                                "main"</a>
                        </div>
                    </div>*/}

                    {/*<div className="bg-white shadow rounded-lg mb-6">*/}
                    {/*<section className="bg-white rounded-lg shadow-md">*/}

                    <SectionsSettings t={t}/>
                    {/*<Sections/>*/}

                    {/*</div>*/}


                </div>
            </div>
        </>
    );
}
export default channelPage;