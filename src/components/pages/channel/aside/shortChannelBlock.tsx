"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import Link from "next/link";

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
        <div className=" grid-cols-3 flex max-lg:grid-cols-2 max-sm:grid-cols-1 max-sm:pr-0">
            <Image className="flex-1" style={{borderRadius: '50%'}} width={110} height={110} alt="Avatar"
                   src={avatar}/>
            <div className="pl-5">
                <h1><strong>{name}</strong></h1>
                <Link target={'_blank'} href={"/channel/editing"} className="space-y-2.5">Customize channel
                    view</Link>
            </div>
        </div>
    )
}

export default ShortChannelBlock