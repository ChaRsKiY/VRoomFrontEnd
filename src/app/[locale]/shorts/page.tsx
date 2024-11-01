import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import React from "react";
import initTranslations from "@/app/i18n";
import ShortWatch from "@/components/pages/shorts/shorts-watch";

interface IChannelEditProps {
    params: { locale: string; }
}

const ShortsPage = async ({params: {locale}}: IChannelEditProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories']);
    return (
        <>
            <div className="flex items-center justify-between px-4 py-2 mb-8 border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="flex">
                <AsideHome t={t}/>
            </div>

            <div className="flex items-center text-sm lg:flex ml-[45%] w-full pt-[4.22rem]">
                <ShortWatch id={4}/>
            </div>
        </>
    );
}
export default ShortsPage;