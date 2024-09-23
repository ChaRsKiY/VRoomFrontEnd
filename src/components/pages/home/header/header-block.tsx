"use client"

import React from 'react'
import {IoIosSettings, IoMdNotifications} from "react-icons/io";
import {SignedIn, SignedOut, UserButton, useUser} from "@clerk/nextjs";
import { useSpring, animated } from '@react-spring/web'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/navigation";
import NotificationButton from "@/components/pages/home/header/notitification-button";
import SettingsButton from "@/components/pages/home/header/settings-button";
import BurgerMenu from "@/components/pages/home/header/burger-menu";

const HeaderBlock: React.FC = () => {
    const { t }: { t: ITranslationFunction } = useTranslation()

    const { push } = useRouter()

    return (
        <div className="flex space-x-5 items-center max-lg:space-x-3.5">
            <TooltipProvider>
                <Tooltip >
                    <TooltipTrigger className="max-sm:hidden">
                        <NotificationButton />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("notification")}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger className="max-sm:hidden">
                        <SettingsButton />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("settings")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <BurgerMenu />
        </div>
    )
}

export default HeaderBlock