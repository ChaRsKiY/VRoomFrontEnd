"use client";

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { IoLogOutOutline, IoMenu, IoMoonOutline } from "react-icons/io5";
import NotificationButtonMenu from "@/components/pages/home/header/notification-button-in-menu";
import UserDataInBurgerMenu from "@/components/pages/home/header/userdata-burgermenu";
import { CiLogin } from "react-icons/ci";
import HeaderMenuButton from "@/components/pages/home/header/menu-button";
import {usePathname, useRouter} from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { MdOutlineWbSunny } from "react-icons/md";
import {useTranslation} from "next-i18next";
import i18nConfig from "@/../i18nConfig";
import {LanguagePicker} from "@/components/pages/home/header/language-picker";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [theme, setTheme] = useState<string>();
    const [appearance, setAppearance] = useState<string>('system');
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { push, refresh } = useRouter();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const currentPathname = usePathname();

    const handleChange = (value: any) => {
        // set cookie for next-i18n-router
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${value};expires=${expires};path=/`;

        // redirect to the new locale path
        if (
            currentLocale === i18nConfig.defaultLocale
        ) {
            push('/' + value + currentPathname);
        } else {
            push(
                currentPathname.replace(`/${currentLocale}`, `/${value}`)
            );
        }

        refresh();
    };

    useEffect(() => {
        const localTheme = localStorage.getItem('theme');
        const localAppearance = localStorage.getItem('appearance') || 'system';
        const browserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = localTheme || (localAppearance === 'system' ? browserTheme : localAppearance);
        setTheme(initialTheme);
        setAppearance(localAppearance);
        document.body.classList.toggle('dark', initialTheme === 'dark');
        localStorage.setItem('theme', initialTheme);
        localStorage.setItem('appearance', localAppearance);
    }, []);

    const themeChange = (newAppearance: string) => {
        const browserTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const newTheme = newAppearance === 'system' ? browserTheme : newAppearance;
        setTheme(newTheme);
        setAppearance(newAppearance);
        document.body.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
        localStorage.setItem('appearance', newAppearance);
    };

    const handleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="self-center relative">
            {!user ? (
                <button className="flex items-center" onClick={handleOpen}>
                    <IoMenu className="cursor-pointer h-8 w-8 text-neutral-500" />
                </button>
            ) : (
                <Avatar className="cursor-pointer h-8 w-8" onClick={handleOpen}>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user?.username?.slice(0, 2) || "VR"}</AvatarFallback>
                </Avatar>
            )}

            {isOpen && (
                <div
                    className="absolute top-10 min-w-64 right-0 bg-white dark:bg-neutral-950 shadow-2xl rounded-lg p-4 flex flex-col">
                    {isLoaded && user ? (
                        <>
                            <UserDataInBurgerMenu user={user}/>
                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                            <HeaderMenuButton icon={<VscAccount size={22}/>} text="Account"
                                              action={() => push("/account")}/>
                            <HeaderMenuButton icon={<HiOutlineSwitchHorizontal size={23}/>} text="Switch account"
                                              action={() => {
                                              }}/>
                            <HeaderMenuButton icon={<IoLogOutOutline size={23}/>} text="Logout" action={signOut}/>
                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                        </>
                    ) : (
                        <>
                            <HeaderMenuButton icon={<CiLogin size={23}/>} text="Sign in"
                                              action={() => push("/auth/signin")}/>
                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                        </>
                    )}

                    <HeaderMenuButton
                        icon={theme === "dark" ? <IoMoonOutline size={23}/> : <MdOutlineWbSunny size={23}/>}
                        text={`Appearance: ${appearance === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}`}
                        action={() => themeChange(appearance === 'system' ? 'light' : appearance === 'light' ? 'dark' : 'system')}
                    />

                    <LanguagePicker handleLanguageChange={handleChange} currentLanguage={currentLocale} />

                    <NotificationButtonMenu/>
                </div>
            )}
        </div>
    );
};

export default BurgerMenu;