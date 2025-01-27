import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import ChannelEditBlock from "@/components/pages/channel/channelSetup/channelEditForm";
import HeaderHome from "@/components/pages/home/header/header";

interface IProfileTabProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: IProfileTabProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories', 'channel'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="w-60 bg-white border-r border-gray-200 h-screen">
                <AsideHome t={t}/>
            </div>
            <div className="flex-auto overflow-hidden pl-[2.75%] max-sm:pl-0 pt-20">
                <h1 className="text-2xl font-bold pl-3">Channel settings<br/></h1>

                <div className="flex-1 pt-0 pb-6 pl-6 pr-6">


                    <ChannelEditBlock/>

                </div>
            </div>
        </>
    );
}
export default channelPage;