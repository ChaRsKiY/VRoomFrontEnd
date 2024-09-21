"use client"

import React, {useEffect, useState} from 'react'
import {IoMdNotifications} from "react-icons/io";
import {testNotifications} from "@/testdata/notifications";

const NotificationButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

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

    const unreadNotifications = testNotifications.filter((el) => !el.isRead).length

    return (
        <div className="relative self-center flex">
            <IoMdNotifications onClick={handleCloseOpen} className="text-2xl text-neutral-500 cursor-pointer self-center"/>
            {unreadNotifications >= 1 && <div className="absolute text-[0.74rem] bg-green rounded-full p-0.5 top-[-1px] right-[-3px] h-3.5 w-3.5 flex items-center justify-center">
                <div>{unreadNotifications}</div>
            </div>}
            {isOpen && <div className="absolute top-10 right-0 w-80 bg-white shadow-2xl rounded-xl z-50 notify-dropdown overflow-hidden">
                {testNotifications.length === 0 ? (
                    <div className="p-5">
                        <div className="text-[1.05rem] font-[500] mb-2">Notifications</div>
                        <div className="text-neutral-500">No notifications yet</div>
                    </div>
                ) : testNotifications.map((notification) => (
                    <div key={notification.id} className="p-2.5 border-b border-neutral-200 hover:bg-neutral-100">
                        <div className="font-bold">{notification.title}</div>
                        <div className="text-neutral-500">{notification.description}</div>
                    </div>
                ))}
                    </div>}
            </div>
                )
            }

            export default NotificationButton