
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
import {PiMonitorPlayLight} from "react-icons/pi";
import {LuLayoutDashboard} from "react-icons/lu";
import {TbCircleLetterC} from "react-icons/tb";
import {LiaCommentSolid} from "react-icons/lia";
import {CiSettings} from "react-icons/ci";
import Image from "next/image";
import ClientHome from "@/components/pages/channel/ClientHome";
import SettingsBlock from "@/components/pages/channel/youChannelP";
import { useUser } from '@clerk/clerk-react'
import axios from "axios";
import {IPresentedChannel} from "@/types/channel.interface";
import React from "react";
import UserCategoryBlock from "@/components/pages/channel/aside/user-category";

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
        {icon: <FaMagic/>, name: t("channel:Channel_setup"), path: "/channel/editing/channel_setup/profile"},
        {icon: <MdOutlineLibraryMusic/>, name: t("channel:Music_library"), path: "/channel/editing/music_library"},
    ]

    const mainPageOtherCategorie = [
        {icon: <CiSettings/>, name: t("channel:settings"), path: "/channel/editing/settings"},
        {icon: <MdOutlineFeedback/>, name: t("categories:feedback"), path: "/feedback"},
    ]

    return (
        <div>
            <div className="fixed bottom-0 top-20 w-[20%] overflow-y-scroll pb-10 max-lg:hidden no-scrollbar">
                <div className="pr-[4%] ml-[-3%]">
                    <UserCategoryBlock/>


                    <CategoryBlock data={mainPageAccountCategories} title=""/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>



                    <div className="py-[10%]"></div>
                    <CategoryBlock data={mainPageOtherCategorie} title=""/>

                    <div className="px-3 mt-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>


                </div>
            </div>


        </div>
    )
}

export default AsideHome