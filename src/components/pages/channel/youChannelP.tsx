"use client"

import React from 'react'
import {useUser} from "@clerk/clerk-react";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import ShortChannelBlock from "@/components/pages/channel/aside/shortChannelBlock";
import Link from "next/link";

const YouChannelP = () => {
    const { isSignedIn } = useUser();

    if (!isSignedIn){
        return (<div className="flex-grow flex flex-col justify-center items-center text-center p-10 pt-30">
            <i className="fas fa-play-circle text-7xl text-gray-400 mb-6"></i>
            <h1 className="text-2xl font-semibold">Войдите в аккаунт</h1>
            <p className="text-gray-500 mt-2">Здесь вы увидите сохраненные видео и те, которые вам понравились.</p>
            <Link href={"/auth/signin"} className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Войти</Link>
        </div>);
    }

    return (
        <div className="pl-[20.5%] ml-2 max-lg:pl-[11%] max-sm:pl-0 pt-20">
            <ShortChannelBlock/>
            <div className="mt-8">
                <h2 className="text-xl font-bold">История</h2>
                <div className="flex justify-between items-center mt-4">
                    <div className="bg-gray-200 w-72 h-40"></div>
                    <button className="text-blue-600">Посмотреть все</button>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold">Плейлисты</h2>
                <div className="flex justify-between items-center mt-4">
                    <div className="bg-gray-200 w-72 h-40 flex items-center justify-center">
                        <i className="fas fa-video text-4xl text-gray-400"></i>
                    </div>
                    <button className="text-blue-600">Посмотреть все</button>
                </div>
            </div>
        </div>
    )
}

export default YouChannelP