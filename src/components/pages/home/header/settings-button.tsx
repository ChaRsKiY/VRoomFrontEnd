"use client"

import React, {useEffect, useState} from 'react'
import {IoIosSettings, IoMdNotifications} from "react-icons/io";
import {testNotifications} from "@/testdata/notifications";

const SettingsButton: React.FC = () => {
    /*const [isOpen, setIsOpen] = useState(false)

    const handleCloseOpen = () => {
        setIsOpen(!isOpen)
    }

    const handleOutsideClick = (e: MouseEvent) => {
        const path = e.composedPath();

        if (!path.some(el => el instanceof HTMLElement && el.className && true && el.className.includes('notify-dropdown'))) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.addEventListener("click", handleOutsideClick);
        } else {
            document.body.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            document.body.removeEventListener("click", handleOutsideClick);
        };
    }, [isOpen]);

    const unreadNotifications = testNotifications.filter((el) => !el.isRead).length*/

    return (
        <div>
            <IoIosSettings className="text-2xl text-neutral-500 cursor-pointer"/>
        </div>
    )
}

export default SettingsButton