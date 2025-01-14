import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import YouChannelP from "@/components/pages/channel/youChannelP";
import HeaderHome from "@/components/pages/home/header/header";

interface IChannelProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: IChannelProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories', 'channel']);

    return (

        <>
            {/*<header className="flex items-center justify-between px-4 py-2 border-b">*/}
            <HeaderHome t={t}/>
            {/*</header>*/}

            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div className="pl-[5%] max-lg:pl-[5%] max-sm:pl-0 pt-20">
                <YouChannelP/>
            </div>
        </>
    );
}
export default channelPage;