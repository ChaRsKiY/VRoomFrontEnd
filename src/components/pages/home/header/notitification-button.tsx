// "use client"

// import React, { useEffect, useState } from 'react'
// import { IoMdNotifications } from "react-icons/io";
// import { useUser } from "@clerk/nextjs";
// import { INotification } from "@/types/inotification.interface";
// import api from '@/services/axiosApi';

// const NotificationButton: React.FC = () => {
//     const [isOpen, setIsOpen] = useState(false)
//     const { user, isLoaded } = useUser();
//     const [notifications, setNotifications] = useState<INotification[]>([]);

//     useEffect(() => {
//         if (user) {
//             fetchNotifications(user.id); // Загружаем уведомления при наличии пользователя
//         }

//         // Очистка уведомлений при выходе пользователя
//         if (!user && isLoaded) {
//             setNotifications([]); // Очищаем уведомления, если пользователь вышел
//         }
//     }, [user, isLoaded]);

//     const fetchNotifications = async (userId: string) => {
//         try {
//             const response = await api.get(`/Notification/getbyuserid/1/10/${userId}`);
//             const data: any[] = await response.data;

//             // Преобразуем данные в массив объектов типа INotification
//             const notifications: INotification[] = data.map(item => ({
//                 id: item.id,
//                 userId: item.userId,
//                 message: item.message,
//                 isRead: item.isRead,
//                 date: new Date(item.date) // Преобразуем дату в объект Date
//             }));

//             // Обновляем состояние с полученными уведомлениями
//             setNotifications(notifications);
//         } catch (error) {
//             console.error('Ошибка при загрузке уведомлений:', error);
//         }
//     };

//     const handleCloseOpen = () => {
//         setIsOpen(!isOpen)
//     }

//     const handleOutsideClick = (e: MouseEvent) => {
//         const path = e.composedPath();

//         if (!path.some(el => el instanceof HTMLElement && el.className && true && el.className.includes('notify-dropdown'))) {
//             setIsOpen(false);
//         }
//     };

//     useEffect(() => {
//         if (isOpen) {
//             document.body.addEventListener("click", handleOutsideClick);
//         } else {
//             document.body.removeEventListener("click", handleOutsideClick);
//         }

//         return () => {
//             document.body.removeEventListener("click", handleOutsideClick);
//         };
//     }, [isOpen]);

//     const unreadNotifications = notifications.filter((el) => !el.isRead).length

//     return (
//         <div className="relative self-center flex">
//             <IoMdNotifications onClick={handleCloseOpen} className="text-2xl text-neutral-500 cursor-pointer self-center" />
//             {unreadNotifications >= 1 && <div className="absolute text-[0.74rem] bg-green rounded-full p-0.5 top-[-1px] right-[-3px] h-3.5 w-3.5 flex items-center justify-center">
//                 <div>{unreadNotifications}</div>
//             </div>}
//             {isOpen && <div className="absolute top-10 right-0 w-80 bg-white dark:bg-neutral-800 shadow-custom-big rounded-xl z-50 notify-dropdown overflow-hidden">
//                 {notifications.length === 0 ? (
//                     <div className="p-5">
//                         <div className="text-[1.05rem] font-[500] mb-2">Notifications</div>
//                         <div className="text-neutral-500">No notifications yet</div>
//                     </div>
//                 ) : notifications.map((notification) => (
//                     <div key={notification.id} className="p-2.5 border-b border-neutral-200 hover:bg-neutral-100">
//                         <div className="font-bold">{notification.message}</div>
//                         <div className="text-neutral-500">{notification.date.toLocaleDateString()}</div>
//                     </div>
//                 ))}
//             </div>}

//         </div>
//     )
// }

// export default NotificationButton


"use client"

import React, { useEffect, useState } from 'react'
import { IoMdNotifications } from "react-icons/io";
import { useUser } from "@clerk/nextjs";
import { INotification } from "@/types/inotification.interface";
import api from '@/services/axiosApi';

const NotificationButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isLoaded } = useUser();
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [visibleCount, setVisibleCount] = useState(3);

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
            const response = await api.get(`/Notification/getbyuserid/${userId}`);
            const data: any[] = await response.data;

            const notifications: INotification[] = data.map(item => ({
                id: item.id,
                userId: item.userId,
                message: item.message,
                isRead: item.isRead,
                date: new Date(item.date)
            }));

            setNotifications((prevNotifications) => {
                const existingIds = new Set(prevNotifications.map((n) => n.id)); // Собираем ID уже существующих
                const uniqueNotifications = notifications.filter(
                    (notification) => !existingIds.has(notification.id) // Проверяем, чтобы ID не дублировались
                );
                return [...prevNotifications, ...uniqueNotifications]; // Добавляем только уникальные уведомления
            });
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
    const markAsRead = async (id: number) => {
        try {
            await api.put(`/Notification/markasread/${id}`);

            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении уведомления:', error);
        }
    };
    const markAllAsRead = async () => {
        try {
            await api.put(`/Notification/markallasRead/${user?.id}`);

            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, isRead: true }))
            );
        } catch (error) {
            console.error('Ошибка при массовом обновлении уведомлений:', error);
        }
    };

    const showMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
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
        <div className="relative self-center flex">
            <IoMdNotifications onClick={handleCloseOpen} className="text-2xl text-neutral-500 cursor-pointer self-center" />
            {unreadNotifications >= 1 && <div className="absolute text-[0.74rem] bg-green rounded-full p-0.5 top-[-1px] right-[-3px] h-3.5 w-3.5 flex items-center justify-center">
                <div>{unreadNotifications}</div>
            </div>}
            {isOpen && <div className="absolute top-10 right-0 w-80 bg-white dark:bg-neutral-800 shadow-custom-big
             rounded-xl z-50 notify-dropdown max-h-60 overflow-y-auto">
                {notifications.length > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:underline 
                                     sticky top-0 bg-white dark:bg-neutral-800 z-10 w-full text-left pl-3"
                    >
                        Mark all as read
                    </button>
                )}
                {notifications.length === 0 ? (
                    <div className="p-5">
                        <div className="text-[1.05rem] font-[500] mb-2">Notifications</div>
                        <div className="text-neutral-500">No notifications yet</div>
                    </div>
                ) : notifications
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, visibleCount)
                    .map((notification) => (
                        <div
                            title='Click to mark as read'
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)} // Клик для отметки
                            className={`p-2.5 border-b border-neutral-200 cursor-pointer ${notification.isRead ? 'text-neutral-400' : 'hover:bg-neutral-100'
                                }`}
                        >
                            <div className="font-bold">{notification.message}</div>
                            <div className="text-neutral-500"><small>{notification.date.toLocaleString()}</small></div>
                        </div>
                    ))}
                {visibleCount < notifications.length && (
                    <button
                        onClick={showMore}
                        className="text-sm text-blue-500 hover:underline bg-white dark:bg-neutral-800 w-full text-left pl-3"
                    >
                        See more
                    </button>
                )}
            </div>}

        </div>
    )
}

export default NotificationButton


