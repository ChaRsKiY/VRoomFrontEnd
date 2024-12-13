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
        // return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        // <path d="M8 7.25C8.19891 7.25 8.38968 7.32902 8.53033 7.46967C8.67098 7.61032 8.75 7.80109 8.75 8V9.25H10C10.1989 9.25 10.3897 9.32902 10.5303 9.46967C10.671 9.61032 10.75 9.80109 10.75 10C10.75 10.1989 10.671 10.3897 10.5303 10.5303C10.3897 10.671 10.1989 10.75 10 10.75H8.75V12C8.75 12.1989 8.67098 12.3897 8.53033 12.5303C8.38968 12.671 8.19891 12.75 8 12.75C7.80109 12.75 7.61032 12.671 7.46967 12.5303C7.32902 12.3897 7.25 12.1989 7.25 12V10.75H6C5.80109 10.75 5.61032 10.671 5.46967 10.5303C5.32902 10.3897 5.25 10.1989 5.25 10C5.25 9.80109 5.32902 9.61032 5.46967 9.46967C5.61032 9.32902 5.80109 9.25 6 9.25H7.25V8C7.25 7.80109 7.32902 7.61032 7.46967 7.46967C7.61032 7.32902 7.80109 7.25 8 7.25ZM17 11.75C17 11.4848 16.8946 11.2304 16.7071 11.0429C16.5196 10.8554 16.2652 10.75 16 10.75C15.7348 10.75 15.4804 10.8554 15.2929 11.0429C15.1054 11.2304 15 11.4848 15 11.75V12C15 12.2652 15.1054 12.5196 15.2929 12.7071C15.4804 12.8946 15.7348 13 16 13C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12V11.75ZM16 7C16.2652 7 16.5196 7.10536 16.7071 7.29289C16.8946 7.48043 17 7.73478 17 8V8.25C17 8.51522 16.8946 8.76957 16.7071 8.95711C16.5196 9.14464 16.2652 9.25 16 9.25C15.7348 9.25 15.4804 9.14464 15.2929 8.95711C15.1054 8.76957 15 8.51522 15 8.25V8C15 7.73478 15.1054 7.48043 15.2929 7.29289C15.4804 7.10536 15.7348 7 16 7ZM19 10C19 10.2652 18.8946 10.5196 18.7071 10.7071C18.5196 10.8946 18.2652 11 18 11H17.75C17.4848 11 17.2304 10.8946 17.0429 10.7071C16.8554 10.5196 16.75 10.2652 16.75 10C16.75 9.73478 16.8554 9.48043 17.0429 9.29289C17.2304 9.10536 17.4848 9 17.75 9H18C18.2652 9 18.5196 9.10536 18.7071 9.29289C18.8946 9.48043 19 9.73478 19 10ZM14.25 11C14.5152 11 14.7696 10.8946 14.9571 10.7071C15.1446 10.5196 15.25 10.2652 15.25 10C15.25 9.73478 15.1446 9.48043 14.9571 9.29289C14.7696 9.10536 14.5152 9 14.25 9H14C13.7348 9 13.4804 9.10536 13.2929 9.29289C13.1054 9.48043 13 9.73478 13 10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11H14.25Z" fill="black"/>
        // <path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 3C12.75 2.80109 12.671 2.61032 12.5304 2.46967C12.3897 2.32902 12.1989 2.25 12 2.25C11.8011 2.25 11.6103 2.32902 11.4697 2.46967C11.329 2.61032 11.25 2.80109 11.25 3V4.487C9.81002 4.507 8.37269 4.58333 6.93802 4.716L6.60602 4.746C5.45095 4.85322 4.37607 5.38293 3.58738 6.23362C2.7987 7.0843 2.35169 8.19613 2.33202 9.356L2.32002 10.069C2.27316 12.8602 2.49822 15.6494 2.99202 18.397C3.11088 19.0568 3.45778 19.654 3.97212 20.084C4.48647 20.5141 5.13556 20.7498 5.80602 20.75H6.02702C6.63184 20.7506 7.22379 20.5754 7.73084 20.2457C8.23789 19.916 8.63819 19.446 8.88302 18.893L9.94302 16.501C10.734 14.718 13.266 14.718 14.057 16.501L15.117 18.893C15.3619 19.446 15.7622 19.916 16.2692 20.2457C16.7763 20.5754 17.3682 20.7506 17.973 20.75H18.194C18.8645 20.7498 19.5136 20.5141 20.0279 20.084C20.5423 19.654 20.8892 19.0568 21.008 18.397C21.5018 15.6494 21.7269 12.8602 21.68 10.069L21.668 9.356C21.6484 8.19613 21.2014 7.0843 20.4127 6.23362C19.624 5.38293 18.5491 4.85322 17.394 4.746L17.062 4.716C15.6283 4.58292 14.1898 4.50619 12.75 4.486V3ZM7.07602 6.21C10.3517 5.90666 13.6484 5.90666 16.924 6.21L17.256 6.24C18.0429 6.31325 18.7752 6.67423 19.3125 7.2538C19.8498 7.83337 20.1544 8.59079 20.168 9.381L20.18 10.094C20.226 12.7877 20.009 15.4795 19.532 18.131C19.4755 18.4448 19.3106 18.7287 19.066 18.9332C18.8215 19.1378 18.5128 19.2499 18.194 19.25H17.973C17.6587 19.2505 17.3511 19.1595 17.0876 18.9881C16.8241 18.8168 16.6161 18.5725 16.489 18.285L15.428 15.893C14.109 12.921 9.89102 12.921 8.57202 15.893L7.51202 18.285C7.25202 18.872 6.66902 19.25 6.02702 19.25H5.80702C5.48804 19.2501 5.17916 19.1381 4.93439 18.9336C4.68963 18.729 4.52455 18.4449 4.46802 18.131C3.9911 15.4798 3.77407 12.7884 3.82002 10.095L3.83202 9.381C3.84564 8.59064 4.1504 7.83309 4.68792 7.25349C5.22544 6.6739 5.95792 6.31302 6.74502 6.24L7.07602 6.21Z" fill="black"/>
        // </svg>
        
        if (name == "news")
            return <BiNews />;
        if (name == "live")
            return <BiBroadcast />
    //    return  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M20.3333 10.9999C20.3333 16.1333 16.1999 20.3333 10.9999 20.3333C5.79994 20.3333 1.6666 16.1999 1.6666 10.9999C1.6666 6.06659 5.4666 1.99992 10.3999 1.66659V4.13325C6.59994 4.46659 3.8666 7.79992 4.19993 11.5999C4.53327 15.3999 7.8666 18.1333 11.6666 17.7999C15.1999 17.4666 17.8666 14.5333 17.8666 10.9999H16.5333C16.5333 14.0666 14.0666 16.5333 10.9999 16.5333C7.93327 16.5333 5.4666 14.0666 5.4666 10.9999C5.4666 8.19992 7.59994 5.79992 10.3333 5.53325V8.46659C8.93327 8.86659 8.0666 10.2666 8.39994 11.7333C8.79994 13.1333 10.1999 13.9999 11.6666 13.6666C13.0666 13.2666 13.9333 11.8666 13.5999 10.3999C13.3333 9.46659 12.5999 8.73325 11.6666 8.46659V0.333252H10.9333C5.0666 0.333252 0.266602 5.13325 0.266602 10.9999C0.266602 16.8666 5.0666 21.6666 10.9333 21.6666C16.7999 21.6666 21.5999 16.8666 21.5999 10.9999H20.3333Z" fill="#424949"/>
    //     </svg>
        
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

            setAllCategories(categories.map((category: any) => ({
                iconPath: findIcon(category.name),
                name: category.name,
                path: "/mainbycategory?search=" + category.name,
                iconClassNames: "rounded-full"
            })));



        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }

    };

    useEffect(() => {

        getCategories();
        console.log("categories",allCategories)

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