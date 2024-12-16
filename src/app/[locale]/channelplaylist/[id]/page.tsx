import React from 'react'
 import CreatePost from "@/components/pages/posts/createpost";
import HeaderHome from "@/components/pages/home/header/header";
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import ChannelPlaylistComponent from "@/components/pages/channel/channelinfo/channelplaylist"

const ChannelPage: React.FC = async ({ params }: any) => {
    
    const { id } = params;
    const { t } = await initTranslations(params.locale, ['common', 'categories'])


    return (
        <div className="flex w-full mt-20">
            <HeaderHome t={t}/>
            <div className="flex pt-20 overflow-hidden">
                <AsideHome t={t}/>
            </div>
            <div className="pl-[20%] w-full  flex justify-center max-lg:pl-[12%] max-sm:pl-0">
                
                <ChannelPlaylistComponent channelid={id} />
            </div>
            <div>

            </div>
        </div>
    )
}

export default ChannelPage