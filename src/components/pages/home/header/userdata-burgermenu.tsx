"use client"

import React from 'react'
import {  useState, useEffect } from 'react';
import { IUser } from '@/types/user.interface';
import api from '@/services/axiosApi';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserResource } from "@clerk/types";
import Link from "next/link";

const UserDataInBurgerMenu: React.FC<{ user: any | undefined | null }> = ({ user }: { user: any | undefined | null }) => {

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
        <div>
            <div className="flex space-x-3">
                {/* <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>{user ? user?.username?.slice(0, 2) : "VR"}</AvatarFallback>
                </Avatar> */}
                                <div >
                    {iAmUser &&(
                      <img
                          src={iAmUser.channelProfilePhoto}
                          alt="User Avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                        />
                    )}
                     </div>
                <div className="flex flex-col">
                    <div className="font-[500] text-[1.1rem]">{user?.username}</div>
                    <div className="">{user?.fullName}</div>
                    <Link href="/channel" className="mt-2.5 text-blue-400">View channel</Link>
                </div>

            </div>
        </div>
    )
}

export default UserDataInBurgerMenu