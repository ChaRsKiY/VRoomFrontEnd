"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";

const UserCategoryBlock = () => {
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
            const response = await fetch(`https://localhost:7154/api/ChannelSettings/getinfochannel/${userId}`);
            const data: any = await response.json();

            setAvatar(data.channelBanner);
            setName(data.channelName);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };
     const {t}: { t: ITranslationFunction } = useTranslation();//

    return (
        <div className="p-4 text-center">
            <Image className="w-100 h-100 mx-auto rounded-full" width={100} height={100}
                   src={avatar} alt="Avatar"/>

            <p className="mt-2 text-gray-700 font-semibold">Your channel</p>
            <p className="text-sm text-gray-500">{name}</p>
        </div>
    )
}

export default UserCategoryBlock