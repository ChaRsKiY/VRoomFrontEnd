import HeaderHome from "@/components/pages/home/header/header";
import AsideHome from "@/components/pages/home/aside/aside";
import React from "react";
import initTranslations from "@/app/i18n";
import ShortWatch from "@/components/pages/shorts/shorts-watch";

interface IChannelEditProps {
    params: { locale: string; }
}

const ShortPage = async ({params: {locale}}: IChannelEditProps) => {
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
                {/*<div className="relative">
                    <ShortsPlayer src={"https://www.youtube.com/shorts/bZZqKVGNrso"} id={0}/>
                    <div className="absolute bottom-4 left-0 right-0 pl-3 justify-items-start">
                        <div className="flex flex-col justify-between">

                            <FollowShortBlock/>
                            <DescriptionShortBlock/>
                        </div>
                    </div>
                </div>
                <RightShortBlock/>*/}

            </div>

        </>
    );
}
export default ShortPage;