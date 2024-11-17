"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import api from '@/services/axiosApi';

const ShortChannelBlock = () => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [avatar, setAvatar] = useState<string>('https://placehold.co/100x100.svg');
    const [name, setName] = useState<string>();

    useEffect(() => {
        if (user) {
            fetchChannel(user.id); // Загружаем уведомления при наличии пользователя
        }
    }, [user]);
    const fetchChannel = async (userId: string) => {
        try {
            const response = await api.get(`/ChannelSettings/getinfochannel/${userId}`);
            if (response.status === 200) {
                const data: any = await response.data;
                setAvatar(data.channelProfilePhoto);
                setName(data.channelName);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    };
    const {t}: { t: ITranslationFunction } = useTranslation();//

    return (
        <div className="flex items-center space-x-4">

            <Image className="bg-purple-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl"
                   width={70} height={70} alt="Avatar"
                   src={avatar}/>
            <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <Link target={'_blank'} href={"/channel/editing"} className="block pl-0 pr-4 py-2 rounded-full">Customize
                    channel
                    view</Link>
            </div>
        </div>
    )
}

export default ShortChannelBlock