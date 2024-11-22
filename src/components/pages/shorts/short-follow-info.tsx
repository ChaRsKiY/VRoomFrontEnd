"use client"

import React, {useState, useEffect} from 'react';
import {IVideo} from "@/types/videoinfo.interface"
import OpenShareDialogButton from "@/components/pages/shorts/share-button";
import api from '@/services/axiosApi';
import Image from "next/image";
import {formatNumber, formatTimeAgo} from "@/utils/format";
import {RiPlayListAddFill} from "react-icons/ri";
import {BiDislike, BiLike} from "react-icons/bi";
import {IoFlagOutline} from "react-icons/io5";
import {useUser} from "@clerk/nextjs";
import ShortFollowBlock from "@/components/pages/shorts/short-follow-block";
import {signalRService} from "@/services/signalr.service";
import Link from "next/link";

interface IShortFollowInfoProps {
    video: IVideo;
}

const ShortFollowInfo: React.FC<IShortFollowInfoProps> = ({video}: IShortFollowInfoProps) => {
    const {user} = useUser();
    const [newVideo, setVideo] = useState<IVideo>();
    const [displayR, setDisplayR] = useState('none');
    const [isFollowed, setIsFollowed] = useState(false);

    const dislike = async (id: number) => {
        if (user) {
            try {

                const response = await api.put('/Video/dislike/' + id + '/' + user.id);

                if (response.status === 200) {
                    console.log('дизлайк');
                } else {
                    console.error('Ошибка при dislike:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }

    }

    const like = async (id: number) => {
        if (user) {
            try {
                const response = await api.put('/Video/like/' + id + '/' + user.id);

                if (response.status === 200) {
                    console.log('лайк');
                } else {
                    console.error('Ошибка при like:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };

    const checkIsFollowed = async () => {
        if (user) {
            try {
                const response = await api.get('/Subscription/isfolowed/' + video.channelSettingsId + '/' + user.id);

                if (response.status === 200) {
                    setIsFollowed(true);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };
    const addSubscription = async () => {
        if (user) {
            try {
                const response = await api.post('/Subscription/add/' + video.channelSettingsId + '/' + user.id);

                if (response.status === 200) {
                    setIsFollowed(true);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };

    const deleteSubscription = async () => {
        if (user) {
            try {
                const response = await api.delete('/Subscription/delete/' + video.channelSettingsId + '/' + user.id);

                if (response.status === 200) {
                    setIsFollowed(false);
                } else {
                    console.error('Ошибка при isfolowed:', response.statusText);
                }

            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    };

    useEffect(() => {
        const handleMessage = (messageType: string, payload: any) => {
            console.log('Сообщение от SignalR сервера:', messageType, payload);

            if (messageType === 'up_video') {
                const i = payload;
                setVideo(i);
            }
        };

        signalRService.onMessageReceived(handleMessage);

        // Очистка подписки при размонтировании компонента
        return () => {
            signalRService.offMessageReceived(handleMessage);
        };
    }, [video]);

    useEffect(() => {
        setVideo(video);
        checkIsFollowed();
    }, [video]);

    const openReport = () => {
        setDisplayR('block');
    };

    const closeReport = () => {
        setDisplayR('none');
        console.log('closing report');

    };


    useEffect(() => {
        console.log('Текущее значение displayR:', displayR);
    }, [displayR]);
    return (
        <>

            {newVideo ? (<div
                className="flex w-[19.5rem] max-h-max flex-col items-start gap-[0.9375rem] shrink-0">
                <p className="-webkit-box   self-stretch overflow-hidden text-[#000] text-ellipsis font-Inter text-[1.25rem] font-not-italic font-500 leading-normal">{newVideo.tittle}</p>
                <div className="flex items-center gap-[0.325rem] self-stretch">
                    <Link href={"/gotochannel/" + newVideo.id}
                          className={'flex items-center gap-[0.325rem] flex-[1_0_0]'}>
                        <Image src={newVideo.channelProfilePhoto} alt={newVideo.channelName} width={40} height={40}
                               className="w-[2.5rem] h-[2.5rem] rounded-[2.5rem] "/>
                        <div className={"flex flex-col items-start flex-[1_0_0]"}>
                            <p className={"-webkit-box   self-stretch overflow-hidden text-[#000] text-ellipsis font-Inter text-[1rem] font-not-italic font-500 leading-normal"}>{newVideo.channelName}</p>
                            <p className={"self-stretch text-[#404040] font-Inter text-[0.75rem] font-not-italic font-400 leading-normal"}>{formatNumber(newVideo.channelSubscriptionCount)} followers</p>
                        </div>
                    </Link>
                    <ShortFollowBlock isFollowed={isFollowed} onDelete={deleteSubscription} onAdd={addSubscription}/>

                </div>

                <div className="flex items-center gap-[1.6875rem] self-stretch">
                    <div className={'flex items-center gap-[0.3125rem]'}>
                        <div className={'w-[1.6875rem] h-[1.6875rem]'}>
                            <BiLike size={24} onClick={() => like(newVideo.id)}
                                    className="cursor-pointer w-[1.4775rem] h-[1.46975rem] shrink-0 fill-[#000]"/>
                        </div>
                        <p className="text-[#000] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal"
                           title={newVideo.likeCount.toString()}>{formatNumber(newVideo.likeCount)}</p>
                    </div>
                    <div className={'flex items-center gap-[0.3125rem] flex-[1_0_0]'}>
                        <div className={'w-[1.6875rem] h-[1.6875rem]'}>
                            <BiDislike size={24} onClick={() => dislike(newVideo.id)}
                                       className="cursor-pointer w-[1.4775rem] h-[1.46975rem] shrink-0 fill-[#000]"/>
                        </div>
                        <p className="text-[#000] font-Inter text-[0.875rem] font-not-italic font-400 leading-normal"
                           title={newVideo.dislikeCount.toString()}>{formatNumber(newVideo.dislikeCount)}</p>
                    </div>
                    <div className={'w-[1.6875rem] h-[1.6875rem]'}>
                        <div className={'w-[1.4875rem] h-[1.4875rem]'}>
                            <RiPlayListAddFill size={22}
                                               className="cursor-pointer w-[1.3475rem] h-[1.3475rem] shrink-0"/>
                        </div>

                    </div>
                    <div className={'w-[1.6875rem] h-[1.6875rem]'}>
                        <OpenShareDialogButton URL={newVideo.vRoomVideoUrl}/>
                    </div>
                    <div className={'w-[1.6875rem] h-[1.6875rem]'}>
                        <div className={'w-[1.5875rem] h-[1.5875rem]'}>
                            <IoFlagOutline size={22}
                                           className="cursor-pointer w-[1.4875rem] h-[1.4875rem]"/>
                        </div>
                    </div>
                </div>

                <div className="h-[0.0625rem] shrink-0 self-stretch bg-[#E6E6E6]"></div>

                <p className="self-stretch text-[#000] font-Inter text-[1rem] font-not-italic font-500 leading-normal">Description</p>
                <p className="flex-[1_0_0] h-max self-stretch text-[#000] text-ellipsis whitespace-nowrap font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">{newVideo.description}</p>
            </div>) : (
                <></>
            )}

        </>

    )
}

export default ShortFollowInfo;