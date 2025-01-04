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
import React from "react";
import UserCategoryBlock from "@/components/pages/channel/aside/user-category";
import OtherCategoryBlock from "@/components/pages/channel/aside/other-category";
import ClientHome from "@/components/pages/channel/ClientHome";

interface IAsideHomeProps {
    t: ITranslationFunction
}


const AsideHome: React.FC<IAsideHomeProps> = async ({t}: IAsideHomeProps) => {

    const mainPageAccountCategories = [
        {icon: <LuLayoutDashboard/>, name: t("channel.json:Home"), path: "/channel.json/editing"},
        {icon: <PiMonitorPlayLight/>, name: t("channel.json:Content"), path: "/channel.json/editing/content"},
        {icon: <MdOutlineAnalytics/>, name: t("channel.json:Analytics"), path: "/channel.json/editing/analytics"},
        {icon: <LiaCommentSolid/>, name: t("channel.json:Comments"), path: "/channel.json/editing/comments"},
        {icon: <MdOutlineSubtitles/>, name: t("channel.json:Subtitles"), path: "/channel.json/editing/subtitles"},
        {icon: <TbCircleLetterC/>, name: t("channel.json:Copyright"), path: "/channel.json/editing/copyright"},
        {icon: <MdOutlineMonetizationOn/>, name: t("channel.json:Monetization"), path: "/channel.json/editing/monetization"},
        {icon: <FaMagic/>, name: t("channel.json:Channel_setup"), path: "/channel.json/editing/channel_setup/profile"},
        {icon: <MdOutlineLibraryMusic/>, name: t("channel.json:Music_library"), path: "/channel.json/editing/music_library"},
    ]


    return (
        <div>
            <div className="fixed bottom-0 top-20  overflow-y-scroll pb-10 max-lg:hidden no-scrollbar">
                <div className=" ml-[-3%]">
                    <UserCategoryBlock/>
                    <CategoryBlock data={mainPageAccountCategories} title=""/>
                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>
                    <div className="py-[10%]"></div>
                    <OtherCategoryBlock/>
                    <div className="px-3 mt-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AsideHome