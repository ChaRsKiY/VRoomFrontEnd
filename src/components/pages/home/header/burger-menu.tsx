"use client";

import React, {useContext, useEffect, useState} from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { IoLogOutOutline, IoMenu, IoMoonOutline } from "react-icons/io5";
import NotificationButtonMenu from "@/components/pages/home/header/notification-button-in-menu";
import UserDataInBurgerMenu from "@/components/pages/home/header/userdata-burgermenu";
import { CiLogin } from "react-icons/ci";
import HeaderMenuButton from "@/components/pages/home/header/menu-button";
import {usePathname, useRouter} from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import {MdOutlineFeedback, MdOutlineWbSunny} from "react-icons/md";
import {useTranslation} from "next-i18next";
import i18nConfig from "@/../i18nConfig";
import {LanguagePicker} from "@/components/pages/home/header/language-picker";
import {TbSettings} from "react-icons/tb";
import {AccountSwitch} from "@/components/pages/home/header/account-switch";
import {RxQuestionMarkCircled} from "react-icons/rx";
import {ThemeContext} from "@/components/providers/theme.provider";
import { IUser } from '@/types/user.interface';
import api from '@/services/axiosApi';

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<string>();
    const [appearance, setAppearance] = useState<string>('system');
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { push, refresh } = useRouter();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;
    const currentPathname = usePathname();

    const { setTheme: setContextTheme } = useContext(ThemeContext);

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
        setContextTheme(newTheme);
    };

    const handleOpen = () => setIsOpen(!isOpen);
    const [iAmUser, setUser] = useState<IUser | null>(null);

  const getUser = async () => {
    try {

      const response = await api.get('/ChannelSettings/getbyownerid/' + user?.id);

      if (response.status === 200) {
        const data: IUser = await response.data;
        setUser(data);
      } else {
        console.error('Ошибка при получении пользователя:', response.statusText);
      }

    } catch (error) {
      console.error('Ошибка при подключении к серверу:', error);
    }
  };

  useEffect(() => {
    getUser();
}, [user]);

    return (
        <div className="self-center relative">
            {!user ? (
                <button className="flex items-center" onClick={handleOpen}>
                    <IoMenu className="cursor-pointer h-8 w-8 text-neutral-500" />
                </button>
            ) : (
                // <Avatar className="cursor-pointer h-8 w-8" onClick={handleOpen}>
                //     <AvatarImage src={user?.imageUrl} />
                //     <AvatarFallback>{user?.username?.slice(0, 2) || "VR"}</AvatarFallback>
                // </Avatar>
                <div >
                    {iAmUser &&(
                      <img    onClick={handleOpen}
                          src={iAmUser.channelProfilePhoto}
                          alt="User Avatar"
                          style={{ width: '44px', height: '44px', borderRadius: '50%', marginRight: '10px' }}
                        />
                    )}
                     </div>
            )}

            {isOpen && (
                <div
                    className="absolute top-10 min-w-64 right-0 bg-white dark:bg-neutral-950 shadow-custom-big rounded-lg p-4 flex flex-col">
                    {isLoaded && user ? (
                        <>
                            <UserDataInBurgerMenu user={user}/>
                            <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>
                            <NotificationButtonMenu/>
                            <HeaderMenuButton icon={<VscAccount size={22}/>} text="Account"
                                              action={() => push("/account")}/>
                            <AccountSwitch />
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

                    <LanguagePicker handleLanguageChange={handleChange} currentLanguage={currentLocale}/>

                    <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>

                    <HeaderMenuButton icon={<TbSettings size={23}/>} text="Settings" action={() => push("/account")}/>


                    <div className="bg-neutral-300 rounded-full h-[1.5px] my-1.5"/>

                    <HeaderMenuButton icon={<RxQuestionMarkCircled size={23} />} text="Help" action={() => push("/help")} />
                    <HeaderMenuButton icon={<MdOutlineFeedback size={23} />} text="Feedback" action={() => push("/feedback")} />
                </div>
            )}
        </div>
    );
};

export default BurgerMenu;