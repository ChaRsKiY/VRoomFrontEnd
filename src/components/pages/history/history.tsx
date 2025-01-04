import React, {useEffect, useState} from 'react';
import api from "@/services/axiosApi";
import {HistoryOfBrowsingGroupDate} from "@/types/historyofbrowsing-groupdate.interface";
import Image from "next/image";
import {formatNumber} from "@/utils/format";
import {base64ToUint8Array, byteArrayToBase64} from "@/utils/base64Functions";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Clock, MoreVertical, Share2} from "lucide-react";
import {FaRegBookmark} from "react-icons/fa";
import {IoTrashOutline} from "react-icons/io5";
import {GoReport} from "react-icons/go";
import {PiQueue} from "react-icons/pi";
import {IoIosPause} from "react-icons/io";
import {formatDuration} from "@/utils/dateformat";

const WatchHistoryPage = ({userId}: { userId: string }) => {
    const [history, setHistory] = useState<HistoryOfBrowsingGroupDate[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            const response = await api.get(`/HistoryOfBrowsing/getallhistorybyclerkidgroupedbydate/` + userId);
            if (response.status === 200) {
                const hist = await response.data;
                setHistory(hist);
            }
        };

        fetchHistory();
    }, [userId]);


    const clearHistory = async () => {// Удаление всей истории и обновление состояния
        try {
            const scrollY = window.scrollY; // Сохраняем текущую позицию прокрутки

            // Отправляем запрос на удаление всей истории
            const response = await api.delete(`/HistoryOfBrowsing/deleteall/` + userId);

            if (response.status === 200) {
                setHistory([]); // Очищаем историю в состоянии

                setTimeout(() => {// Восстанавливаем позицию прокрутки
                    window.scrollTo({top: scrollY, behavior: "auto"});
                }, 0);

                console.log('data.message');
            } else {
                console.error('data.message');
            }
        } catch (error) {
            console.error("Ошибка при удалении всей истории:", error);
        }
    };


    const deleteVideoInViewHistory = async (videoId: number) => {
        try {
            const response = await api.delete('/HistoryOfBrowsing/' + videoId);

            if (response.status === 200) {
                const scrollY = window.scrollY; // Запоминаем текущую позицию прокрутки

                setHistory((prevHistory) =>// Обновляем состояние истории
                    prevHistory
                        .map((group) => ({
                            ...group,
                            historyOfBrowsingVideos: group.historyOfBrowsingVideos.filter((video) => video.id !== videoId),
                        }))
                        .filter((group) => group.historyOfBrowsingVideos.length > 0) // Убираем пустые группы
                );

                setTimeout(() => {// Восстанавливаем позицию прокрутки
                    window.scrollTo({top: scrollY, behavior: "auto"});
                }, 0);

                console.log("Видео успешно удалено из истории");
            } else {
                console.error('Ошибка при отправке комментария:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при подключении к серверу:', error);
        }
    }
    return (
        <div className={'flex justify-between'}>
            <div className={'basis-9/12'} style={{padding: '20px'}}>
                <h1 className={'font-bold text-[1.355rem]'}>История просмотра</h1>
                {history?.map((group) => (
                    <div key={group.date}>
                        <h2 className={'font-semibold text-[20px]'} style={{margin: '20px 0 10px'}}>
                            {new Date(group.date).toLocaleDateString('ru-RU', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h2>
                        <div>
                            {group.historyOfBrowsingVideos?.map((item) => (
                                <div className={'px-5'} key={item.id}>
                                    <div className={'flex mb-4 relative cursor-pointer w-max'}>
                                        <div className={'relative'}>
                                            <Image
                                                onClick={() => router.push(item.vRoomVideoUrl)}
                                                src={`data:image/jpeg;base64,${byteArrayToBase64(base64ToUint8Array(item.cover))}`}
                                                alt={item.videoTitle}
                                                className={'rounded-[8px] aspect-video'}
                                                width={245}
                                                height={230}
                                            />
                                            <div
                                                className="bg-black px-1 text-[0.775rem] text-white rounded w-max absolute bottom-1.5 right-1.5">
                                                {formatDuration(item.duration)}
                                            </div>
                                        </div>
                                        <div className={'flex flex-col min-w-[300px] w-full'}
                                             style={{marginLeft: '10px'}}>
                                            <h1 className={'text-[20px]'}>{item.videoTitle}</h1>
                                            <p className={'text-[14px] text-gray-600'}>
                                                {item.channelName} <span
                                                className={'pr-1.5'}></span> {formatNumber(item.viewCount)} views
                                            </p>
                                            <p>{item.videoDescription}</p>
                                        </div>
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
                                                    <DropdownMenuItem
                                                        onClick={() => deleteVideoInViewHistory(item.id)}>
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
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {/* правый блок */}
            <div className={'basis-[36%] p-4 fixed right-14 top-32'}>
                <div className="flex flex-col w-full space-y-4 text-sm text-gray-800">
                    <div className="relative w-full">
                        <input
                            type="search"
                            id="search"
                            className="block py-2 min-w-[280px] w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Искать в истории просмотра"
                        />
                    </div>
                    <div onClick={() => clearHistory()} className="flex flex-row items-center space-x-2 cursor-pointer">
                        <IoTrashOutline size={24}/>
                        <p>Очистить историю просмотра</p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default WatchHistoryPage;
