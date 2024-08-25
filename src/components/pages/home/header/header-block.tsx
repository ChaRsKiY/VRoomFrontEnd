"use client"

import React from 'react'
import {IoIosSettings, IoMdNotifications} from "react-icons/io";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import { useSpring, animated } from '@react-spring/web'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";

const HeaderBlock: React.FC = () => {
    const { t }: ITranslationFunction = useTranslation()

    const [springs, api] = useSpring(() => ({
        from: { transform: 'rotate(0deg)' },
    }))

    const [springsSettings, apiSettings] = useSpring(() => ({
        from: { transform: 'rotate(0deg)' },
    }))

    const handleNotificationsMouseEnter = () => {
        api.start({
            to: [
                { transform: 'rotate(15deg)', config: { duration: 300 } }, // First animation, duration 100ms
                { transform: 'rotate(-15deg)', config: { duration: 300 } }, // Second animation, duration 100ms
                { transform: 'rotate(0deg)', config: { duration: 300 } }, // Third animation, duration 100ms
            ],
        });
    }

    const handleNotificationsMouseLeave = () => {
        api.start({
            to: { transform: 'rotate(0deg)' },
        })
    }

    const handleSettingsMouseEnter = () => {
        apiSettings.start({
            to: [
                { transform: 'rotate(60deg)', config: { duration: 400 } }, // First animation, duration 100ms
                { transform: 'rotate(40deg)', config: { duration: 200 } }, // Second animation, duration 100ms
            ],
        });
    }

    const handleSettingsMouseLeave = () => {
        apiSettings.start({
            to: { transform: 'rotate(0deg)' },
        })
    }

    return (
        <div className="flex space-x-5 items-center">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <animated.div
                            onMouseEnter={handleNotificationsMouseEnter}
                            onMouseLeave={handleNotificationsMouseLeave}
                            style={springs}
                        >
                            <IoMdNotifications className="text-2xl text-neutral-500 cursor-pointer"/>
                        </animated.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("notifications")}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <animated.div
                            onMouseEnter={handleSettingsMouseEnter}
                            onMouseLeave={handleSettingsMouseLeave}
                            style={springsSettings}
                        >
                            <IoIosSettings className="text-2xl text-neutral-500 cursor-pointer"/>
                        </animated.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("settings")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <SignedOut>
                <SignInButton/>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
    )
}

export default HeaderBlock