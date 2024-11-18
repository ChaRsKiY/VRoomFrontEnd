'use client'

import React, { useState, useEffect, ReactNode } from 'react';

import Link from "next/link";
import { MdExpandMore } from "react-icons/md";
import api from '@/services/axiosApi';
import { BiBook, BiBroadcast, BiCategory, BiFilm, BiFootball, BiLogoPlayStore, BiMusic, BiNews, BiSolidFlame } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

interface IBlock {
    name: string,
    icon?: ReactNode,
    iconPath?: string,
    path: string,
    iconClassNames?: string
}


const CategoryVideos: React.FC = () => {

    const [mainPageCategories, setMainPageCategories] = useState<IBlock[]>([]);
    const [allCategories, setAllCategories] = useState<IBlock[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const {t} = useTranslation();
    

    const handleClick = () => {
        const nextVisibleCount = visibleCount + 5;
        setVisibleCount(nextVisibleCount);

        setMainPageCategories(allCategories);
    };
    const findIcon = (name: string) => {
        if (name == 'music')
            return <BiMusic />;
        if (name == 'films')
            return <BiFilm />;
        if (name == 'education')
            return <BiBook />;
        if (name == "trending")
            return <BiSolidFlame />;
        if (name == "sport")
            return <BiFootball />;
        if (name == "games")
            return <BiLogoPlayStore />;
        if (name == "news")
            return <BiNews />;
        if (name == "live")
            return <BiBroadcast />
        return <BiCategory />;
    };

    const getCategories = async () => {

        try {
            const response = await api.get(`/Category`);

            if (response.status != 200) {
                throw new Error('Ошибка получения данных');
            }

            const categories = await response.data;

            setMainPageCategories(categories.slice(0, visibleCount).map((category: any) => ({
                iconPath: findIcon(category.name),
                name: t("categories:"+category.name),
                path: "/mainbycategory?search=" + category.name,
                iconClassNames: "rounded-full"
            })));

            // setAllCategories(categories.map((category: any) => ({
            //     iconPath: findIcon(category.name),
            //     name: category.name,
            //     path: "/mainbycategory?search=" + category.name,
            //     iconClassNames: "rounded-full"
            // })));



        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }

    };

    useEffect(() => {

        getCategories();

    }, [visibleCount]);
   

    return (
        <div>
            <div>
                <div className="pl-5 font-bold mb-2">Categories</div>
                {mainPageCategories.length > 0 ? (
                    <div className="flex flex-col space-y-1">
                        {mainPageCategories.map((el, key) => (
                            <Link href={el.path} key={key} className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 py-1 min-h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                                {el.iconPath ? (
                                    <div className="text-2xl">{el.iconPath}</div>
                                ) : (
                                    <div className="text-2xl">
                                        <BiCategory />
                                    </div>
                                )}
                                <div>{el.name}</div>
                            </Link>
                        ))}
                    </div>) :
                    <div style={{ paddingLeft: '50px' }}>------------</div>}
            </div>
            <div className="flex flex-col space-y-1 mt-1 hover:cursor-pointer">
                {visibleCount < allCategories.length && (
                    <div onClick={handleClick} style={{ cursor: 'pointer' }}
                        className={"flex space-x-4 items-center px-4 rounded-xl hover:bg-neutral-200 h-10 text-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"}>
                        <div className="text-2xl"><MdExpandMore /></div>
                        <small> More categories</small>
                    </div>)}
            </div>
        </div>
    )
}

export default CategoryVideos