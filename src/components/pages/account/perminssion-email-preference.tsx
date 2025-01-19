'use client';
import React, {useState, useEffect} from 'react'
import {Switch} from "@/components/ui/switch";
import api from '@/services/axiosApi';
import { IUserNotif } from '@/types/user-notifications.interface';
import { useUser } from '@clerk/nextjs';

const PermissionEmailPreference: React.FC = () => {
    const { user } = useUser();
    const [iAmUser, setUser] = useState<IUserNotif | null>(null);

    const getUser = async () => {
        try {
    
          const response = await api.get('/User/getbyclerkid/' + user?.id);
    
    
          if (response.status = 200) {
            const data: IUserNotif= await response.data;
            setUser(data);
           
          } else {
            console.error('Ошибка при получении channel.json:', response.statusText);
          }
        } catch (error) {
          console.error('Ошибка при подключении к серверу:', error);
        }
      };
    
      useEffect(() => {
        getUser();
    }, [user]);

    const onCheckedOnMainEmailNotificatios = async (checked: boolean) => {
        if (user) {
            try {
                const response = await api.put('/User/subscribeonmainemailnotifications/' + user.id + '/' + checked);
                if (response.status === 200) {
                    console.log('успешнo');
                } else {
                    console.error('Ошибка :', response.statusText);
                }
            } catch (error) {
                console.error('Ошибка при подключении к серверу:', error);
            }
        }
    }
    return (
        <div className="flex-1">
            {iAmUser?(
            <div className="flex items-center space-x-4">
                <Switch  defaultChecked={iAmUser.subscribedOnMainEmailNotifications} onCheckedChange={onCheckedOnMainEmailNotificatios}/>
                <div>
                    <h3>
                        Send me emails about my VRoom activity and updates I requested</h3>
                    <h4 className="text-[0.9rem] text-neutral-500">If this setting is turned off, VRoom may still send you messages regarding your account, required service announcements, legal notifications, and privacy matters</h4>
                </div>
            </div>):<></>}
        </div>
    )
}

export default PermissionEmailPreference