"use client"

import React from 'react'
import {IoIosSettings, IoMdNotifications} from "react-icons/io";
import { useState, useEffect } from 'react';
import {ITranslationFunction} from "@/types/translation.interface";
import {useTranslation} from "next-i18next";
import { useSpring, animated } from '@react-spring/web'
import {Tooltip,  TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { useUser } from '@clerk/nextjs';
import { INotification } from '@/types/inotification.interface';




// //  модальное окно создаются таким образом:
const TooltipContent: React.FC<TooltipContentProps> = ({ children , onClick }) => (
  <div onClick={onClick} style={{ cursor: 'pointer' }}>
    {children}
  </div>
);

const Modal: React.FC<ModalProps>  = ({ isOpen, onClose, children }) => {
    const { user } = useUser(); 
  if (!user||!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal} onClick={onClose} >
       {/* <button onClick={onClose}>[x]</button> */}
        {children}
       
      </div>
    </div>
  );
};



const Notifications = () => {
    const { user } = useUser(); // Получаем текущего пользователя
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        if (user) {
            fetchNotifications(user.id); // Загружаем уведомления при наличии пользователя
        }
    }, [user]);

    const fetchNotifications = async (userId: string) => {
        try {
            const response = await fetch(`https://localhost:7154/api/Notification/getbyuserid/1/10/${userId}`);
            const data: any[] = await response.json();


            // Преобразуем данные в массив объектов типа INotification
            const notifications: INotification[] = data.map(item => ({
                id: item.id,
                userId: item.userId,
                message: item.message,
                isRead: item.isRead,
                date: new Date(item.date) // Преобразуем дату в объект Date
            }));


            // Обновляем состояние с полученными уведомлениями
            setNotifications(notifications);

        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);     
    };

    const { t }: { t: ITranslationFunction } = useTranslation();

    return (
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <animated.div onClick={handleOpenModal}>
                        <IoMdNotifications className="text-2xl text-neutral-500 cursor-pointer" />
                    </animated.div>
                </TooltipTrigger>
                <TooltipContent>
                    <p></p>
                </TooltipContent>
            </Tooltip>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notification: INotification) => (
                            <li key={notification.id}>{notification.message}
                            <div style={modalStyles.date}>
                                {notification.date.toLocaleDateString()}
                                </div></li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет новых уведомлений.</p>
                )}
            </Modal>
        </div>
    );
};


// Стили для модального окна
const modalStyles: { [key: string]: React.CSSProperties }  = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    display: 'flex',
    justifyContent: 'flex-end',  // Перемещаем модальное окно вправо
    alignItems: 'flex-start',     // Перемещаем модальное окно вверх
    padding: '20px', 
  },
  modal: {
    backgroundColor: 'grey',
    padding: '20px',
    borderRadius: '5px',
    maxWidth: '500px',
    width: '200px',
    color:"white",
    
  },
date:{
    display: 'flex',
    justifyContent: 'flex-end',  // Перемещаем модальное окно вправо
    alignItems: 'flex-end',     // Перемещаем модальное окно вверх
    fontSize: '12px',
    color:'yellow'
}
};
export default Notifications;
 