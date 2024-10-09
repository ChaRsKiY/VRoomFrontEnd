import React from 'react'
import CategoryBlock from "@/components/pages/home/aside/category";
import {IoMdHome} from "react-icons/io";
import {SiYoutubeshorts} from "react-icons/si";
import {
    MdExpandMore,
    MdFeedback,
    MdSubscriptions,
    MdWatchLater
} from "react-icons/md";
import {IoVideocam} from "react-icons/io5";
import {BiSolidLike} from "react-icons/bi";
import {FaHandsHelping, FaHistory} from "react-icons/fa";
import {RiPlayList2Fill} from "react-icons/ri";
import {FaFlag} from "react-icons/fa6";
import SmallCategoryBlock from "@/components/pages/home/aside/small-category";
import {ITranslationFunction} from "@/types/translation.interface";
import MiniFooter from "@/components/pages/home/aside/mini-footer";

interface IAsideHomeProps {
    t: ITranslationFunction
}

const AsideHome: React.FC<IAsideHomeProps> = ({ t }: IAsideHomeProps) => {
    const mainPageHomeCategories = [
        { icon: <IoMdHome />, name: t("categories:home"), path: "/" },
        { icon: <SiYoutubeshorts />, name: t("categories:shorts"), path: "/shorts" },
        { icon: <MdSubscriptions />, name: t("categories:subscriptions"), path: "/subscriptions" },
    ]

    const mainPageAccountCategories = [
        { icon: <IoVideocam />, name: t("categories:your_channel"), path: "/channel" },
        { icon: <RiPlayList2Fill />, name: t("categories:playlists"), path: "/playlists" },
        { icon: <MdWatchLater />, name: t("categories:watch_later"), path: "/playlist?list=WL" },
        { icon: <BiSolidLike />, name: t("categories:liked_videos"), path: "/playlist?list=LL" },
        { icon: <FaHistory />, name: t("categories:history"), path: "/history" },
    ]

    const mainPageFollowedCategories = [
        { iconPath: "https://yt3.ggpht.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj-mo", name: "PewDiePie", path: "/", iconClassNames: "rounded-full" },
        { iconPath: "https://yt3.ggpht.com/fxGKYucJAVme-Yz4fsdCroCFCrANWqw0ql4GYuvx8Uq4l_euNJHgE-w9MTkLQA805vWCi-kE0g=s176-c-k-c0x00ffffff-no-rj-mo", name: "MrBeast", path: "/playlists", iconClassNames: "rounded-full" },
        { iconPath: "https://yt3.googleusercontent.com/P4iKxY5nqAgfAOkwHGxxPPDEc14uoOCQveOPG5nyEE8evz_KCwQfrKRCcqXpEnDMcORmFGdoww=s160-c-k-c0x00ffffff-no-rj", name: "Yoj", path: "/playlist?list=WL", iconClassNames: "rounded-full" },
        { iconPath: "https://yt3.googleusercontent.com/ytc/AIdro_n8xc4U_fWTlscOwQZgzW1IvQmncTqYpTZpwg1IiFRyOE8=s176-c-k-c0x00ffffff-no-rj-mo", name: "EZ 25", path: "/playlist?list=LL", iconClassNames: "rounded-full" },
        { iconPath: "https://yt3.googleusercontent.com/ytc/AIdro_kkYKpC-P8upOa1u4_2QTVT_lyKdur2vwZKMdZ3lKfNVko=s176-c-k-c0x00ffffff-no-rj-mo", name: "OneTwo", path: "/history", iconClassNames: "rounded-full" },
    ]

    const mainPageCategories = [
        { iconPath: "/", name: t("categories:trending"), path: "/popular" },
        { iconPath: "/", name: t("categories:sport"), path: "/shorts" },
        { iconPath: "/", name: t("categories:games"), path: "/subscriptions" },
        { iconPath: "/", name: t("categories:music"), path: "/shorts" },
        { iconPath: "/", name: t("categories:news"), path: "/subscriptions" },
    ]

    const mainPageOtherCategories = [
        { icon: <FaHandsHelping />, name: t("categories:help"), path: "/help" },
        { icon: <MdFeedback />, name: t("categories:feedback"), path: "/feedback" },
        { icon: <FaFlag />, name: t("categories:report_history"), path: "/reporthistory" },
    ]

    return (
        <div>
            <div className="fixed bottom-0 top-20 w-[20%] overflow-y-scroll pb-10 max-lg:hidden no-scrollbar">
                <div className="px-[7%]">
                    <CategoryBlock data={mainPageHomeCategories}/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageAccountCategories} title="Account"/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageFollowedCategories} title="Followed"/>
                    <div className="flex flex-col space-y-1 mt-1 hover:cursor-pointer">
                        <div
                            className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                            <div className="text-2xl"><MdExpandMore/></div>
                            <div>More</div>
                        </div>
                    </div>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageCategories} title="Categories"/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageOtherCategories} title="Other"/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <MiniFooter />
                </div>
            </div>

            <div
                className="bg-white dark:bg-neutral-950 hidden max-lg:block fixed bottom-0 top-20 w-[12%] overflow-scroll px-3 max-sm:right-0 max-sm:top-[auto] max-sm:left-0 max-sm:w-full">
                <SmallCategoryBlock data={mainPageHomeCategories} />
            </div>
        </div>
    )
}

export default AsideHome