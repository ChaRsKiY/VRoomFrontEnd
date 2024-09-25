import React from "react";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/channel/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";

interface IAnalyticProps {
    params: { locale: string; }
}

const channelPage = async ({params: {locale}}: IAnalyticProps) => {
    const {t} = await initTranslations(locale, ['common', 'categories'])
    return (

        <>
            <div className="flex items-center justify-between px-4 py-2  border-b">
                <HeaderHome t={t}/>
            </div>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div className="pl-[22.5%] max-lg:pl-[12%] max-sm:pl-0 pt-20">

                <div>
                    <h1 style={{'float': 'left'}} className="text-[1.4rem]"><strong>Channel analytics</strong>
                </h1><br/><br/><br/>
                    <div className="grid pr-[-3%] grid-cols-2 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">

                    </div>
                </div>

            </div>
        </>
    );
}
export default channelPage;