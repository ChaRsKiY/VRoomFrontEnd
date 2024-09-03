import React from 'react'
import CategoryBlock from "@/components/pages/channel/aside/category";
import {
    MdOutlineAnalytics,
    MdOutlineFeedback,
    MdOutlineLibraryMusic,
    MdOutlineMonetizationOn,
    MdOutlineSubtitles
} from "react-icons/md";
import {FaMagic} from "react-icons/fa";
import {ITranslationFunction} from "@/types/translation.interface";
import MiniFooter from "@/components/pages/channel/aside/mini-footer";
import {PiMonitorPlayLight} from "react-icons/pi";
import {LuLayoutDashboard} from "react-icons/lu";
import {TbCircleLetterC} from "react-icons/tb";
import {LiaCommentSolid} from "react-icons/lia";
import {CiSettings} from "react-icons/ci";
import Image from "next/image";

interface IAsideHomeProps {
    t: ITranslationFunction
}

const AsideHome: React.FC<IAsideHomeProps> = async ({t}: IAsideHomeProps) => {
    const mainPageAccountCategories = [
        {icon: <LuLayoutDashboard/>, name: t("channel:Home"), path: "/channel/editing"},
        {icon: <PiMonitorPlayLight/>, name: t("channel:Content"), path: "/channel/editing/content"},
        {icon: <MdOutlineAnalytics/>, name: t("channel:Analytics"), path: "/channel/editing/analytics"},
        {icon: <LiaCommentSolid/>, name: t("channel:Comments"), path: "/channel/editing/comments"},
        {icon: <MdOutlineSubtitles/>, name: t("channel:Subtitles"), path: "/channel/editing/subtitles"},
        {icon: <TbCircleLetterC/>, name: t("channel:Copyright"), path: "/channel/editing/copyright"},
        {icon: <MdOutlineMonetizationOn/>, name: t("channel:Monetization"), path: "/channel/editing/monetization"},
        {icon: <FaMagic/>, name: t("channel:Channel_setup"), path: "/channel/editing/channel_setup"},
        {icon: <MdOutlineLibraryMusic/>, name: t("channel:Music_library"), path: "/channel/editing/music_library"},
    ]

    const mainPageOtherCategories = [
        {icon: <CiSettings/>, name: t("channel:settings"), path: "/channel/editing/settings"},
        {icon: <MdOutlineFeedback/>, name: t("categories:feedback"), path: "/feedback"},
    ]

    return (
        <div>
            <div className="fixed bottom-0 top-20 w-[20%] overflow-y-scroll pb-10 max-lg:hidden no-scrollbar">
                <div className="px-[7%]">

                    <div className="flex flex-col space-y-1 pl-[23%] py-[10%]">
                        <div>
                            <Image style={{borderRadius: '50%'}} width={120} height={120}
                                   src="https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo"
                                   alt="Avatar"/>
                            <h4 style={{textAlign: 'left'}}><strong>Your channel</strong></h4>
                            <h3>Mr.Beast</h3>
                        </div>
                    </div>

                    <CategoryBlock data={mainPageAccountCategories} title=""/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <div className="py-[10%]"></div>
                    <CategoryBlock data={mainPageOtherCategories} title=""/>

                    <div className="px-3 my-3">
                        {/*<div className="h-[1px] bg-neutral-300 rounded-full"/>*/}
                    </div>

                    {/*<MiniFooter/>*/}
                </div>
            </div>


        </div>
    )
}

export default AsideHome