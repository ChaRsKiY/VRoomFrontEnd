"use client"

import React from 'react'
import {useUser} from "@clerk/clerk-react";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import ShortChannelBlock from "@/components/pages/channel/aside/shortChannelBlock";
import Link from "next/link";

const YouChannelP = () => {
    const { isSignedIn, user, isLoaded } = useUser();
    const { t }: { t: ITranslationFunction } = useTranslation();

    if (!isSignedIn){
        return (<div className="flex-grow flex flex-col justify-center items-center text-center p-10">
            <i className="fas fa-play-circle text-7xl text-gray-400 mb-6"></i>
            <h1 className="text-2xl font-semibold">Войдите в аккаунт</h1>
            <p className="text-gray-500 mt-2">Здесь вы увидите сохраненные видео и те, которые вам понравились.</p>
            <Link href={"/auth/signin"} className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Войти</Link>
        </div>);
    }

    return (
        <div className="pl-[22.5%] ml-2 max-lg:pl-[12%] max-sm:pl-0">
            <ShortChannelBlock/>
            <div>
                <br/><h1 style={{'float': 'left'}}><strong>History</strong></h1><br/><br/><br/>
                <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0"></div>
            </div>
            <div>
                <br/><h1 style={{'float': 'left'}}><strong>Play Lists</strong></h1><br/><br/><br/>
                <div className="grid pr-[2%] grid-cols-3 flex-1 max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0"> </div>
            </div>
        </div>
    )
}

export default YouChannelP