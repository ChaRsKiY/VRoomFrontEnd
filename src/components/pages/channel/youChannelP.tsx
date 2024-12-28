"use client"

import React, {useEffect, useState} from 'react'
import {useUser} from "@clerk/clerk-react";
import ShortChannelBlock from "@/components/pages/channel/aside/shortChannelBlock";
import Link from "next/link";
import api from "@/services/axiosApi";
import {VideoHistoryItem} from "@/types/VideoHistoryItem";
import Image from "next/image";
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {formatNumber} from "@/utils/format";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Clock, MoreVertical, Share2} from "lucide-react";
import {PiQueue} from "react-icons/pi";
import {FaRegBookmark} from "react-icons/fa";
import {IoTrashOutline} from "react-icons/io5";
import {GoReport} from "react-icons/go";

const YouChannelP = () => {
    const [shortHistory, setShortHistory] = useState<VideoHistoryItem[]>([]);
    const {isSignedIn, user} = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const fetchHistory = async () => {
                const response = await api.get(`/HistoryOfBrowsing/getlatestvideohistorybyuseridpaginated/1/4/${user.id}`);
                if(response.status=== 200){ 
                const hist = await response.data;
                setShortHistory(hist);
                }
            };

            fetchHistory();
        }
    }, [user]);

    if (!isSignedIn) {
        return (<div className="flex-grow flex flex-col justify-center items-center text-center p-10 pt-30">
            <i className="fas fa-play-circle text-7xl text-gray-400 mb-6"></i>
            <h1 className="text-1xl font-semibold">Войдите в аккаунт</h1>
            <p className="text-gray-500 mt-2">Здесь вы увидите сохраненные видео и те, которые вам понравились.</p>
            <Link href={"/auth/signin"}
                  className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Войти</Link>
        </div>);
    }

    return (
        <div className="pl-[20.5%] ml-2 max-lg:pl-[11%] max-sm:pl-0 pt-10">
            <ShortChannelBlock/>
            <div className="mt-8">
                <h2 className="text-xl font-bold">История</h2>
                <div className="flex justify-between items-center mt-4 ">
                    {shortHistory?.map((item) => (
                        <div className={'pr-1.5'} key={item.id}>
                            <div className={'flex flex-col mb-4 cursor-pointer w-max'}>
                                <Image onClick={() => router.push(item.vRoomVideoUrl)}
                                       src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                                       alt={item.videoTitle} className={'rounded-[8px] aspect-video p-0.5'}
                                       width={210} height={120}/>

                                <div className={'flex flex-col relative  '} style={{marginLeft: '10px'}}>
                                    <h1 className={'text-[20px] font-semibold'}>{item.videoTitle}</h1>
                                    <p className={'text-[14px] text-gray-600'}>{item.channelName}</p>
                                    <p className={'text-[14px] text-gray-600'}>{formatNumber(item.viewCount)} views</p>
                                    <div className={'absolute flex flex-row items-center top-0 right-0'}>
                                        <DropdownMenu>{/* Меню дій */}
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="mm" className="ml-auto">
                                                    <MoreVertical className="h-6 w-6"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <PiQueue className="mr-2 h-4 w-4"/> Add to queue
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Clock className="mr-2 h-4 w-4"/> Save to Watch later
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FaRegBookmark className="mr-2 h-4 w-4"/> Save to playlist
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Share2 className="mr-2 h-4 w-4"/> Share
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <IoTrashOutline className="mr-2 h-4 w-4"/> Delete from view
                                                    history
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>
                                                    <GoReport className="mr-2 h-4 w-4"/> Send feedback
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                            </div>

                        </div>
                    ))}
                    <div className={'flex flex-col mb-4 cursor-pointer'}>
                        <Link href={'/history'}
                              className="text-blue-600 w-48 block p-7">Посмотреть все
                        </Link>
                    </div>

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