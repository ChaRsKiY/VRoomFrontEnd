import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import YouChannelP from "@/components/pages/channel/youChannelP";

const channelPage = async ({params: {locale}}) => {
    const {t} = await initTranslations(locale, ['common', 'categories']);

    return (

        <>
            <div className="flex">
                <AsideHome t={t}/>
            </div>
            <YouChannelP/>

        </>
    );
}
export default channelPage;