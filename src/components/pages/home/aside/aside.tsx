import React, {useState, ReactNode} from 'react'
import CategoryBlock from "@/components/pages/home/aside/category";
import {IoMdHome} from "react-icons/io";
import {SiYoutubeshorts} from "react-icons/si";
import {
    MdBugReport,
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
import CategorySubscription from './category-subscription';
import CategoryVideos from './categoryvideos';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import AddContentReportDialog from "@/components/pages/home/aside/add-content-report-dialog";


interface IAsideHomeProps {
    t: ITranslationFunction
}

const AsideHome: React.FC<IAsideHomeProps> = ({t}: IAsideHomeProps) => {

    const mainPageHomeCategories = [
        {icon: <IoMdHome/>, name: t("categories:home"), path: "/"},
        {icon: <SiYoutubeshorts/>, name: t("categories:shorts"), path: "/shorts"},
        {icon: <MdSubscriptions/>, name: t("categories:subscriptions"), path: "/subscriptions"},
    ]

    const mainPageAccountCategories = [
        {icon: <IoVideocam/>, name: t("categories:your_channel"), path: "/channel"},
        {icon: <RiPlayList2Fill/>, name: t("categories:playlists"), path: "/playlists"},
        {icon: <MdWatchLater/>, name: t("categories:watch_later"), path: "/playlist?list=WL"},
        {icon: <BiSolidLike/>, name: t("categories:liked_videos"), path: "/mylikedvideo"},
        {icon: <FaHistory/>, name: t("categories:history"), path: "/history"},
    ]


    const mainPageCategories = [
        {iconPath: "/", name: t("categories:trending"), path: "/popular"},
        {iconPath: "/", name: t("categories:sport"), path: "/shorts"},
        {iconPath: "/", name: t("categories:games"), path: "/subscriptions"},
        {iconPath: "/", name: t("categories:music"), path: "/shorts"},
        {iconPath: "/", name: t("categories:news"), path: "/subscriptions"},
    ]

    const mainPageOtherCategories = [
        {icon: <FaHandsHelping/>, name: t("categories:help"), path: "/help"},
        {icon: <MdFeedback/>, name: t("categories:feedback"), path: "/feedback"},
        {icon: <FaFlag/>, name: t("categories:report_history"), path: "/reporthistory"},
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

                    <CategorySubscription/>

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>
                    <CategoryVideos/>

                    {/* <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageCategories} title="Categories"/> */}

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <CategoryBlock data={mainPageOtherCategories} title="Other"/>

                    <AddContentReportDialog />

                    <div className="px-3 my-3">
                        <div className="h-[1px] bg-neutral-300 rounded-full"/>
                    </div>

                    <MiniFooter/>
                </div>
            </div>

            <div
                className="bg-white dark:bg-neutral-950 hidden max-lg:block fixed bottom-0 top-20 w-[12%] overflow-scroll px-3 max-sm:right-0 max-sm:top-[auto] max-sm:left-0 max-sm:w-full">
                <SmallCategoryBlock data={mainPageHomeCategories}/>
            </div>
        </div>
    )
}

export default AsideHome