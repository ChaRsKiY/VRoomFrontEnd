"use client"

import React, {useEffect} from 'react'
import initTranslations from "@/app/i18n";
import AsideHome from "@/components/pages/home/aside/aside";
import HeaderHome from "@/components/pages/home/header/header";
import {LuHistory} from "react-icons/lu";
import {FaRegCircleUser} from "react-icons/fa6";
import {useUser} from "@clerk/clerk-react";
import Link from "next/link";
import WatchHistoryPage from "@/components/pages/history/history";
import {IoTrashOutline} from "react-icons/io5";
import {IoIosPause} from "react-icons/io";
import {Input} from "@/components/ui/input";
import api from "@/services/axiosApi";


interface Props {
    params: {
        locale: string;
    }
}

const HistoryP: React.FC<Props> = async ({params: {locale}}: Props) => {
    const {isSignedIn, user} = useUser();


    const {t} = await initTranslations(locale, ['common', 'categories']);

    return (
        <>
            <div className="flex pt-20 overflow-hidden">
                {t && <HeaderHome t={t}/>}
            </div>
            <div className="flex pt-20 overflow-hidden">
                {t && <AsideHome t={t}/>}
            </div>
            <main className="pl-[20%] w-full pt-20 flex max-lg:pl-[12%] max-sm:pl-0">


                {!isSignedIn ? (<div className="flex-1 flex flex-col items-center justify-center pt-24">
                    <div className="text-6xl text-gray-400 mb-4">
                        <LuHistory size={45}/>
                    </div>
                    <h1 className="text-xl font-semibold mb-2">История поиска и просмотра недоступна</h1>
                    <p className="text-gray-600 mb-4 text-sm">Чтобы посмотреть историю просмотра, войдите в аккаунт.
                        <a href="#" className="text-blue-500">Подробнее...</a>
                    </p>

                    <Link href={"/auth/signin"}
                          className="flex items-center px-4 py-2 gap-2 text-sm text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50">
                        <FaRegCircleUser size={24}/>
                        Войти
                    </Link>
                </div>) : (<div className={'flex w-full'}>
                    <div><WatchHistoryPage userId={user.id} locale={locale}/></div>

                </div>)}


            </main>
        </>
    );
};

export default HistoryP;