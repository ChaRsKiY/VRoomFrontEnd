"use client"

import React, {useRef, useState, useEffect, ChangeEvent, MouseEvent} from 'react';
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {IVideo} from "@/types/videoinfo.interface";
import {signalRService} from "@/services/signalr.service";
import {IContentVideo} from "@/types/videoDTO.interface";

interface IFollowShortBlockProps {
    short: IVideo;

}

const FollowShortBlock: React.FC<IFollowShortBlockProps> = ({short}: IFollowShortBlockProps) => {
    const {user} = useUser();
    const [newVideo, setVideo] = useState<IVideo>();
    const [displayR, setDisplayR] = useState('none');
    const [isFolowed, setIsFolowed] = useState(false);


    const checkIsFolowed = async () => {
        if (user) {
            try {
                const response = await fetch('https://localhost:7154/api/Subscription/isfolowed/' + short.channelSettingsId + '/' + user.id, {
                    method: 'GET',
                });

                if (response.ok) {
                    setIsFolowed(true);
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
                const response = await fetch('https://localhost:7154/api/Subscription/add/' + short.channelSettingsId + '/' + user.id, {
                    method: 'POST',
                });

                if (response.ok) {
                    setIsFolowed(true);
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
                const response = await fetch('https://localhost:7154/api/Subscription/delete/' + short.channelSettingsId + '/' + user.id, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setIsFolowed(false);
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
    }, [short]);

    useEffect(() => {
        setVideo(short);
        checkIsFolowed();
    }, [short]);

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
            {newVideo ? (
                <div className="flex flex-row items-center">
                    <Image src={newVideo.channelProfilePhoto} width={42} alt={newVideo.channelName} height={42}
                           style={{minHeight: '40px'}} className="rounded-full"/>

                    <div className="text-white pl-3">{newVideo.channelName}</div>
                    <div className="pl-4">
                        <button className="bg-red-500 text-white rounded-xl pl-3 pr-3 pt-1 pb-1">Subscribe</button>
                    </div>

                </div>) : <></>}</>

    );


};

export default FollowShortBlock;