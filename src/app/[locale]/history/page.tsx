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
                    <div><WatchHistoryPage userId={user.id}/></div>

                    {/*<div className=" p-4 pr-20 pt-20 flex flex-col space-y-4 text-sm text-gray-800">
                        <label htmlFor="search"
                               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="search"
                                   className="block w-full py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Искать в истории просмотра" required/>
                            <button type="submit"
                                    className="text-white absolute end-1.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                            </button>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <IoTrashOutline size={24}/>
                            <p>Очистить историю просмотра</p>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <IoIosPause size={24}/>
                            <p>Не сохранять историю просмотра</p>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <IoTrashOutline size={24}/>
                            <p>Очистить историю поиска</p>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <IoIosPause size={24}/>
                            <p>Не сохранять историю поиска</p>
                        </div>

                    </div>*/}
                </div>)}

                {/* <div className="w-1/4 p-4">
                    <ul className="space-y-4 text-sm text-gray-800">
                        <li className="flex items-center space-x-2">
                            <IoTrashOutline size={24}/>
                            <span>Очистить историю просмотра</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <IoIosPause size={24}/>
                            <span>Не сохранять историю просмотра</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <IoTrashOutline size={24}/>
                            <span>Очистить историю поиска</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <IoIosPause size={24}/>
                            <span>Не сохранять историю поиска</span>
                        </li>
                    </ul>
                </div>*/}

            </main>
        </>
    );
};

export default HistoryP;