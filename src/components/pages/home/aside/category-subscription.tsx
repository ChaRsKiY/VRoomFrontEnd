'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import Link from "next/link";
import Image from "next/image";
import { MdExpandMore } from "react-icons/md";
import { useUser } from '@clerk/nextjs';
import api from '@/services/axiosApi';

interface IBlock {
    name: string,
    icon?: ReactNode,
    iconPath?: string,
    path: string,
    iconClassNames?: string
}

const CategorySubscription: React.FC = () => {

    const [mainPageFollowed, setMainPageFollowed] = useState<IBlock[]>([]);
    const [allFollowed, setAllFollowed] = useState<IBlock[]>([]);
    const { user } = useUser();
    const [visibleCount, setVisibleCount] = useState(5);


    const handleClick = () => {
        const nextVisibleCount = visibleCount + 3;
        setVisibleCount(nextVisibleCount);

        const nextItems = allFollowed.slice(visibleCount, nextVisibleCount);
        setMainPageFollowed(prevCategories => [...prevCategories, ...nextItems]);
    };

    const getFollowedCategories = async () => {

        try {
            const response = await api.get(`/Subscription/findbyuserid/${user?.id}`);

            if (response.status != 200) {
                throw new Error('Ошибка получения данных');
            }

            const subscriptions = await response.data;
            console.log(subscriptions);

            setMainPageFollowed(subscriptions.slice(0, 3).map((subscription: any) => ({
                iconPath: subscription.channelProfilePhoto ,  
                name: subscription.channelNikName, 
                path: "/gotochannel/" + subscription.id,  
                iconClassNames: "rounded-full"  
            })));

            setAllFollowed(subscriptions.map((subscription: any) => ({
                iconPath: subscription.channelProfilePhoto ,  
                name: subscription.channelNikName,  
                path: `/gotochannel/${subscription.id}`,  
                iconClassNames: "rounded-full"  
            })));



        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }

    };

    useEffect(() => {
        if (user) {
            getFollowedCategories();
        }
    }, [user]);

    return (
        <div>
            <div>
                <div className="pl-5 font-bold mb-2">Followed</div>
                {mainPageFollowed.length > 0 ? (
                    <div className="flex flex-col space-y-1">
                        {mainPageFollowed.map((el, key) => (
                            <Link href={el.path} key={key} className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                                {el.icon ? (
                                    <div className="text-2xl">{el.icon}</div>
                                ) : (
                                    <div className="text-2xl">
                                        <Image className={el.iconClassNames} src={el.iconPath!} alt={el.name} width={26} height={26} style={{ minHeight: '26px' }} />
                                    </div>
                                )}
                                <div>{el.name}</div>
                            </Link>
                        ))}
                    </div>) :
                    <div style={{ paddingLeft: '50px' }}>------------</div>}
            </div>
            <div className="flex flex-col space-y-1 mt-1 hover:cursor-pointer">
                {visibleCount < allFollowed.length && (
                    <div onClick={handleClick} style={{ cursor: 'pointer' }}
                        className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                        <div className="text-2xl"><MdExpandMore /></div>
                        <div> More followed</div>
                    </div>)}
            </div>
        </div>
    )
}

export default CategorySubscription