"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {useUser} from "@clerk/nextjs";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";

const ProfilePhotoBlock = () => {
    const {user} = useUser(); // Получаем текущего пользователя
    const [avatar, setAvatar] = useState<string>('https://placehold.co/120x80.svg');
    // const [name, setName] = useState<string>();

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
            // setName(data.channelName);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };
    const {t}: { t: ITranslationFunction } = useTranslation();

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile photo</h2>
            <p className="text-sm text-gray-600">The profile photo is shown, for example, next to
                your video or comments on YouTube.</p>
            <div className="flex items-center">
                <div className="flex items-center">
                    <Image className="w-100 h-100 mx-auto mr-2 rounded-full mt-3" width={120} height={120}
                           src={avatar} alt="Banner Image"/>
                    <div className="ml-4">
                        <p className="text-sm text-gray-600">The profile photo is shown, for example, next to
                            your video or comments on YouTube.</p>
                        <p className="text-sm text-gray-600 mt-2">We recommend using an image
                            At least 98 x 98 pixels in size in PNG or GIF format. Animated pictures
                            upload
                            it is forbidden. File size: no more than 4 MB. Remember that the image must
                            comply with the rules
                            YouTube community.
                        </p>
                        <div className="mt-4 space-x-2">
                            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">Change
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePhotoBlock