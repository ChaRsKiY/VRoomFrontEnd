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

const HeaderBlock: React.FC = () => {
    const { t }: { t: ITranslationFunction } = useTranslation()

    const { push } = useRouter()

    return (
        <div className="flex space-x-5 items-center max-lg:space-x-3.5 max-sm:hidden">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <NotificationButton />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("notification")}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <SettingsButton />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("settings")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <SignedOut>
                <button onClick={() => push("/auth/signin")} className="border-2 border-blue text-white bg-blue px-1.5 rounded">Sign in</button>
                <button onClick={() => push("/auth/signup")} className="border-2 border-neutral-200 bg-neutral-200 px-1.5 rounded">Sign up</button>
            </SignedOut>
            <SignedIn>
            <UserButton/>
            </SignedIn>
        </div>
    )
}

export default HeaderBlock