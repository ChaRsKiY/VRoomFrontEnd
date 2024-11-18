"use client"

import React, { useEffect, useState } from 'react'
import { IoMdNotifications } from "react-icons/io";
import { useUser } from "@clerk/nextjs";
import { INotification } from "@/types/inotification.interface";
import { IoNotificationsOutline } from "react-icons/io5";
import api from '@/services/axiosApi';

const NotificationButtonMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isLoaded } = useUser();
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        if (user) {
            fetchNotifications(user.id); 
        }
        if (!user && isLoaded) {
            setNotifications([]); 
        }
    }, [user, isLoaded]);

    const fetchNotifications = async (userId: string) => {
        try {
            const response = await api.get(`/Notification/getbyuserid/1/10/${userId}`);
            const data: any[] = await response.data;

            const notifications: INotification[] = data.map(item => ({
                id: item.id,
                userId: item.userId,
                message: item.message,
                isRead: item.isRead,
                date: new Date(item.date) 
            }));

            setNotifications(notifications);
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };

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

    const unreadNotifications = notifications.filter((el) => !el.isRead).length

    return (
        <button
            onClick={handleCloseOpen}
            className="hidden max-sm:flex relative items-center space-x-2 rounded-[0.5rem] hover:bg-neutral-200 cursor-pointer p-2 pr-3">

            <div className="min-sm:relative self-center flex">
                <IoNotificationsOutline
                    className="text-2xl cursor-pointer self-center" />
                {unreadNotifications >= 1 && <div
                    className="absolute text-[0.74rem] bg-green rounded-full p-0.5 top-[-1px] right-[-3px] h-3.5 w-3.5 flex items-center justify-center">
                    <div>{unreadNotifications}</div>
                </div>}
                {isOpen && <div
                    className="absolute top-12 right-0 w-80 bg-white dark:bg-neutral-800 shadow-2xl rounded-xl z-50 notify-dropdown overflow-hidden">
                    {notifications.length === 0 ? (
                        <div className="p-5">
                            <div className="text-[1.05rem] font-[500] mb-2">Notifications</div>
                            <div className="text-neutral-500">No notifications yet</div>
                        </div>
                    ) : notifications.map((notification) => (
                        <div key={notification.id} className="p-2.5 border-b border-neutral-200 hover:bg-neutral-100">
                            <div className="font-bold">{notification.message}</div>
                            <div className="text-neutral-500">{notification.date.toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>}
            </div>
            <span className="text-[1.075rem]">Notifications</span>
        </button>
    )
}

export default NotificationButtonMenu