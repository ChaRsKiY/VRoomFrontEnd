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
            {/*<div className="flex items-center justify-between border-b ">*/}
            <HeaderHome t={t}/>
            {/*</div> ml-[45%]*/}
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>

            <div
                className="flex pl-[20%] overflow-hidden max-lg:pl-[12%] items-center text-sm lg:flex w-full pt-[4rem]">
                <ShortWatch id={4}/>
            </div>
        </>
    );
}
export default ShortsPage;