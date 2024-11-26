"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import api from '@/services/axiosApi';

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
            const response = await api.get(`/ChannelSettings/getinfochannel/${userId}`);
            if (response.status === 200) {
                const data: any = await response.data;
                setAvatar(data.channelProfilePhoto);
                setName(data.channelName);
            }
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };
    const {t}: { t: ITranslationFunction } = useTranslation();//

    return (
        <div className="flex p-[0.625rem] items-center gap-[0.625rem] self-stretch rounded-[0.625rem]">
            <Image className="w-[2.5rem] h-[2.5rem] rounded-[2.5rem] " width={100} height={100}
                   src={avatar} alt="Avatar"/>

            <div className="flex flex-col justify-center items-start gap-[0.3125rem] flex-[1_0_0]">
                <p className="-webkit-box   self-stretch overflow-hidden text-[#000] text-ellipsis font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">Your
                    channel</p>
                <p className="-webkit-box   self-stretch overflow-hidden text-[#000] text-ellipsis font-Inter text-[0.875rem] font-not-italic font-400 leading-normal">{name}</p>
            </div>
        </div>
    )
}

export default UserCategoryBlock